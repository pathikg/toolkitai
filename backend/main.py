from fastapi import FastAPI, File, UploadFile, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image

import io
import os
import tempfile
import logging

from google import genai
from google.genai import types

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="ToolkitAI API")

# Get allowed origins from environment variable
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"status": "online", "message": "ToolkitAI Backend is running"}

@app.post("/api/bg-removal")
async def bg_removal(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing background removal for file: {file.filename}")
        # Read the image file
        image_data = await file.read()
        
        # Remove background using rembg
        output_data = remove(image_data)
        
        logger.info("Background removal successful")
        # Return the processed image as a PNG response
        return Response(content=output_data, media_type="image/png")
    except Exception as e:
        logger.error(f"Error in background removal: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/virtual-try-on")
async def virtual_try_on(
    person_image: UploadFile = File(...),
    garment_image: UploadFile = File(...)
):
    try:
        logger.info(f"Processing virtual try-on request. Person: {person_image.filename}, Garment: {garment_image.filename}")
        
        # Read images
        person_bytes = await person_image.read()
        garment_bytes = await garment_image.read()
        
        person_pil = Image.open(io.BytesIO(person_bytes))
        garment_pil = Image.open(io.BytesIO(garment_bytes))
        
        # Calculate aspect ratio of person image to match output
        width, height = person_pil.size
        aspect_ratio_map = {
            (1, 1): "1:1",
            (2, 3): "2:3",
            (3, 2): "3:2",
            (3, 4): "3:4",
            (4, 3): "4:3",
            (4, 5): "4:5",
            (5, 4): "5:4",
            (9, 16): "9:16",
            (16, 9): "16:9",
            (21, 9): "21:9",
        }
        
        # Find closest aspect ratio
        def gcd(a, b):
            while b:
                a, b = b, a % b
            return a
        
        divisor = gcd(width, height)
        ratio_w = width // divisor
        ratio_h = height // divisor
        
        # Try to find exact match or closest
        aspect_ratio = "1:1"  # default
        if (ratio_w, ratio_h) in aspect_ratio_map:
            aspect_ratio = aspect_ratio_map[(ratio_w, ratio_h)]
        else:
            # Find closest based on ratio value
            target_ratio = width / height
            closest_key = min(aspect_ratio_map.keys(), key=lambda k: abs((k[0]/k[1]) - target_ratio))
            aspect_ratio = aspect_ratio_map[closest_key]
        
        logger.info(f"Detected aspect ratio for person image: {aspect_ratio}")
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logger.error("GOOGLE_API_KEY not set")
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not set")

        client = genai.Client(api_key=api_key)
        
        prompt = """Virtual Try-On Task:
        1. Analyze the first image (person) and the second image (garment).
        2. If there are multiple people in the first image, apply the garment to the person who is the center of attraction or most prominent.
        3. If there is NO person in the first image, do NOT generate any image output.
        4. Generate a new image of the person from the first image wearing the garment from the second image.
        5. CRITICAL: Keep the person's identity, pose, body shape, and the original background EXACTLY as they are in the first image.
        6. Do NOT modify the person's face, hair, or the background.
        7. Apply the garment naturally to the person's body, adjusting for fit, lighting, and shadows to match the original scene.
        8. Ensure high photorealism.
        9. Do not process any undergarment or inappropriate content requests.
        """
        
        logger.info("Sending request to Gemini API...")
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[person_pil, garment_pil, prompt],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio
                ),
                safety_settings=[
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH
                    ),
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH
                    ),
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH
                    ),
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH
                    )
                ]
            )
        )
        logger.info("Received response from Gemini API")
        
        generated_image_bytes = None
        
        if response.parts:
            for part in response.parts:
                if part.inline_data:
                    img = part.as_image()
                    # Gemini's as_image() appears to return an object that doesn't support BytesIO saving
                    # Save to a temporary file instead, then read it back as bytes
                    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
                        tmp_path = tmp_file.name
                    
                    img.save(tmp_path)
                    
                    with open(tmp_path, "rb") as f:
                        generated_image_bytes = f.read()
                    
                    # Clean up the temporary file
                    os.remove(tmp_path)
                    break
        
        if not generated_image_bytes:
            # Check if there was a text refusal or safety issue
            text_response = ""
            if response.parts:
                for part in response.parts:
                    if part.text:
                        text_response += part.text
            
            logger.warning(f"No image generated. Text response: {text_response}")
            
            if text_response:
                raise HTTPException(status_code=400, detail=f"Generation failed: {text_response}")
            else:
                raise HTTPException(status_code=500, detail="Failed to generate image. The model might have blocked the request due to safety filters.")
             
        logger.info("Virtual try-on successful, returning image.")
        return Response(content=generated_image_bytes, media_type="image/png")
        
    except HTTPException as he:
        logger.error(f"HTTP Exception in virtual try-on: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in virtual try-on: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
