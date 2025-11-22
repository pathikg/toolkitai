from fastapi import FastAPI, File, UploadFile, Response, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rembg import remove
from PIL import Image, ImageDraw, ImageFont

import io
import os
import base64
import tempfile
import logging
import wave

from google import genai
from google.genai import types

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def add_watermark(image_path: str, text: str = "toolkitai.io") -> None:
    """
    Add watermark to image file in-place
    Args:
        image_path: Path to the image file
        text: Watermark text
    """
    # Load the image
    img = Image.open(image_path)
    
    # Convert to RGB if needed (most common format)
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')
    
    # Create drawing context
    draw = ImageDraw.Draw(img)
    
    width, height = img.size
    font_size = max(12, int(width * 0.02))
    
    # Try to load a nice font
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
    
    # Get text dimensions
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Calculate position (bottom-right with padding)
    padding = max(10, int(width * 0.01))
    x = width - text_width - padding
    y = height - text_height - padding
    
    # Draw semi-transparent background
    bg_padding = 5
    background_bbox = [
        x - bg_padding,
        y - bg_padding,
        x + text_width + bg_padding,
        y + text_height + bg_padding
    ]
    draw.rectangle(background_bbox, fill=(0, 0, 0))
    
    # Draw white text
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    # Save back to the same file
    img.save(image_path)

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
        
        # Save to temp file, add watermark, read back
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
            tmp_path = tmp_file.name
            tmp_file.write(output_data)
        
        # Add watermark in-place
        add_watermark(tmp_path)
        
        # Read the watermarked image
        with open(tmp_path, "rb") as f:
            watermarked_data = f.read()
        
        # Clean up
        os.remove(tmp_path)
        
        logger.info("Background removal successful with watermark")
        return Response(content=watermarked_data, media_type="image/png")
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
                    
                    # Save to a temporary file
                    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
                        tmp_path = tmp_file.name
                    
                    img.save(tmp_path)
                    
                    # Add watermark in-place
                    add_watermark(tmp_path)
                    
                    # Read back the watermarked image
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

@app.post("/api/face-swap")
async def face_swap(
    source_image: UploadFile = File(...),
    target_image: UploadFile = File(...)
):
    try:
        logger.info(f"Processing face swap request. Source: {source_image.filename}, Target: {target_image.filename}")
        
        # Read images
        source_bytes = await source_image.read()
        target_bytes = await target_image.read()
        
        source_pil = Image.open(io.BytesIO(source_bytes))
        target_pil = Image.open(io.BytesIO(target_bytes))
        
        # Calculate aspect ratio of target image to match output
        width, height = target_pil.size
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
        
        logger.info(f"Detected aspect ratio for target image: {aspect_ratio}")
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logger.error("GOOGLE_API_KEY not set")
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not set")

        client = genai.Client(api_key=api_key)
        
        prompt = """Face Swap Task:
        1. Analyze the input images.
        2. The FIRST image provided is the SOURCE FACE (the face to be copied).
        3. The SECOND image provided is the TARGET BODY/SCENE (the image to receive the face).
        4. Replace the face in the TARGET image with the face from the SOURCE image.
        5. CRITICAL: Keep the TARGET image's background, lighting, body pose, hair, and style EXACTLY as they are. Only change the facial features to match the SOURCE person.
        6. Blend the source face naturally into the target image, adjusting skin tone and lighting to match the target scene.
        7. Ensure high photorealism.
        8. Go all out on quality and realism.
        """

        # Ensure source image is first (face) and target image is second (scene/body)
        # We explicitly tell the model which is which in the prompt, but ordering matters for some models.
        
        logger.info("Sending request to Gemini API for Face Swap...")
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt, source_pil, target_pil], # Put prompt first, then source (face), then target (body)
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio
                )
            )
        )
        logger.info("Received response from Gemini API")
        
        generated_image_bytes = None
        
        if response.parts:
            for part in response.parts:
                if part.inline_data:
                    img = part.as_image()
                    
                    # Save to a temporary file
                    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
                        tmp_path = tmp_file.name
                    
                    img.save(tmp_path)
                    
                    # Add watermark in-place
                    add_watermark(tmp_path)
                    
                    # Read back the watermarked image
                    with open(tmp_path, "rb") as f:
                        generated_image_bytes = f.read()
                    
                    os.remove(tmp_path)
                    break
        
        if not generated_image_bytes:
            text_response = ""
            if response.parts:
                for part in response.parts:
                    if part.text:
                        text_response += part.text
            
            logger.warning(f"No image generated. Text response: {text_response}")
            
            if text_response:
                raise HTTPException(status_code=400, detail=f"Generation failed: {text_response}")
            else:
                raise HTTPException(status_code=500, detail="Failed to generate image. The model might have failed to process the request.")
             
        logger.info("Face swap successful, returning image.")
        return Response(content=generated_image_bytes, media_type="image/png")
        
    except HTTPException as he:
        logger.error(f"HTTP Exception in face swap: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in face swap: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/celebrity-selfie")
async def celebrity_selfie(
    source_image: UploadFile = File(...),
    target_image: UploadFile = File(...),
    custom_prompt: str = Form("")
):
    """
    Celebrity Selfie endpoint - uses same face-swap logic
    User uploads their photo (source) and celebrity photo (target)
    Optional custom_prompt for specific instructions
    """
    try:
        logger.info(f"Processing celebrity selfie request. User: {source_image.filename}, Celebrity: {target_image.filename}, Custom prompt: {custom_prompt}")
        
        # Read images
        source_bytes = await source_image.read()
        target_bytes = await target_image.read()
        
        source_pil = Image.open(io.BytesIO(source_bytes))
        target_pil = Image.open(io.BytesIO(target_bytes))
        
        # Calculate aspect ratio of target image to match output
        width, height = target_pil.size
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
        
        logger.info(f"Detected aspect ratio for celebrity image: {aspect_ratio}")
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logger.error("GOOGLE_API_KEY not set")
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not set")

        client = genai.Client(api_key=api_key)
        
        # Base prompt
        prompt = """Celebrity Selfie Face Swap Task:
        1. Analyze the input images.
        2. The FIRST image provided is the USER'S FACE (the face to be copied).
        3. The SECOND image provided is the CELEBRITY IMAGE (the image to receive the face).
        4. Replace the face in the CELEBRITY image with the face from the USER image.
        5. CRITICAL: Keep the CELEBRITY image's background, lighting, body pose, hair, and style EXACTLY as they are. Only change the facial features to match the USER person.
        6. Blend the user's face naturally into the celebrity image, adjusting skin tone and lighting to match the scene.
        7. Ensure high photorealism and natural looking result.
        8. Go all out on quality and realism to make it look like the user is actually in the celebrity's photo.
        """
        
        # Add custom prompt if provided
        if custom_prompt and custom_prompt.strip():
            prompt += f"\n\n9. ADDITIONAL USER INSTRUCTIONS: {custom_prompt.strip()}"
            logger.info(f"Added custom instructions to prompt: {custom_prompt.strip()}")

        logger.info("Sending request to Gemini API for Celebrity Selfie...")
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt, source_pil, target_pil],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio
                )
            )
        )
        logger.info("Received response from Gemini API")
        
        generated_image_bytes = None
        
        if response.parts:
            for part in response.parts:
                if part.inline_data:
                    img = part.as_image()
                    
                    # Save to a temporary file
                    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
                        tmp_path = tmp_file.name
                    
                    img.save(tmp_path)
                    
                    # Add watermark in-place
                    add_watermark(tmp_path)
                    
                    # Read back the watermarked image
                    with open(tmp_path, "rb") as f:
                        generated_image_bytes = f.read()
                    
                    os.remove(tmp_path)
                    break
        
        if not generated_image_bytes:
            text_response = ""
            if response.parts:
                for part in response.parts:
                    if part.text:
                        text_response += part.text
            
            logger.warning(f"No image generated. Text response: {text_response}")
            
            if text_response:
                raise HTTPException(status_code=400, detail=f"Generation failed: {text_response}")
            else:
                raise HTTPException(status_code=500, detail="Failed to generate image. The model might have failed to process the request.")
             
        logger.info("Celebrity selfie successful, returning image.")
        return Response(content=generated_image_bytes, media_type="image/png")
        
    except HTTPException as he:
        logger.error(f"HTTP Exception in celebrity selfie: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in celebrity selfie: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class PodcastRequest(BaseModel):
    topic: str
    language: str = "en-US"

@app.post("/api/podcast-creator")
async def podcast_creator(request: PodcastRequest):
    try:
        logger.info(f"Processing podcast generation for topic: {request.topic} in language: {request.language}")
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not set")

        client = genai.Client(api_key=api_key)
        
        # Step 1: Generate the script with Grounding
        grounding_tool = types.Tool(
            google_search=types.GoogleSearch()
        )

        text_prompt = f"""
        You are a scriptwriter for a podcast. Write a dialogue between two hosts, Emily and Mark, about the following topic:
        Topic: "{request.topic}"
        Language: "{request.language}"
        
        Characters:
        - Emily: Enthusiastic, knowledgeable, and high-energy host.
        - Mark: Skeptical, curious, and slightly sarcastic co-host who asks the questions the audience might have.
        
        Rules:
        1. Use Google Search to find the latest facts and information about the topic.
        2. Explain the concept clearly and engagingly.
        3. Keep the dialogue natural and conversational.
        4. Length: Around 200-300 words.
        5. Output: The dialogue script, with speaker names (Emily: ... Mark: ...).
        """
        
        text_response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=text_prompt,
            config=types.GenerateContentConfig(
                tools=[grounding_tool]
            )
        )
        
        if not text_response.text:
            raise HTTPException(status_code=500, detail="Failed to generate podcast script")
            
        script_text = text_response.text.strip()
        logger.info(f"Generated podcast script length: {len(script_text)}")
        
        # Step 2: Generate audio
        # Using multi-speaker configuration
        audio_prompt = f"""TTS the following conversation between Mark and Emily:
        {script_text}
        """
        
        audio_response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=audio_prompt,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                        speaker_voice_configs=[
                            types.SpeakerVoiceConfig(
                                speaker='Emily',
                                voice_config=types.VoiceConfig(
                                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                        voice_name='Zephyr', # Energetic
                                    )
                                )
                            ),
                            types.SpeakerVoiceConfig(
                                speaker='Mark',
                                voice_config=types.VoiceConfig(
                                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                        voice_name='Puck', # Skeptical/Curious
                                    )
                                )
                            ),
                        ]
                    )
                ),
            )
        )
        
        audio_data_base64 = ""
        
        if audio_response.parts:
            for part in audio_response.parts:
                if part.inline_data:
                    pcm_bytes = part.inline_data.data
                    
                    # Save to a temporary file, then read it back as bytes
                    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
                        tmp_path = tmp_file.name
                    
                    try:
                        # Write PCM data to WAV file
                        with wave.open(tmp_path, 'wb') as wav_file:
                            wav_file.setnchannels(1)
                            wav_file.setsampwidth(2)
                            wav_file.setframerate(24000)
                            wav_file.writeframes(pcm_bytes)
                        
                        # Read back the WAV file
                        with open(tmp_path, "rb") as f:
                            wav_bytes = f.read()
                            
                        logger.info(f"Converted PCM to WAV via temp file. Size: {len(wav_bytes)} bytes")
                        audio_data_base64 = base64.b64encode(wav_bytes).decode('utf-8')
                        
                    finally:
                        # Clean up the temporary file
                        if os.path.exists(tmp_path):
                            os.remove(tmp_path)
                        
                    break
        
        if not audio_data_base64:
            raise HTTPException(status_code=500, detail="Failed to generate audio")
            
        return {
            "script_text": script_text,
            "audio_data": audio_data_base64
        }

    except Exception as e:
        logger.error(f"Error in podcast creator: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
