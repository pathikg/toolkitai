from fastapi import FastAPI, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io
import os

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
    return {"status": "online", "message": "ToolkitAI Backend is running"}

@app.post("/api/bg-removal")
async def bg_removal(file: UploadFile = File(...)):
    # Read the image file
    image_data = await file.read()
    
    # Remove background using rembg
    # rembg expects and returns bytes by default if not using PIL explicitly in new versions,
    # but let's use PIL for better control if needed, or just pass bytes.
    # The 'remove' function accepts bytes and returns bytes.
    
    output_data = remove(image_data)
    
    # Return the processed image as a PNG response
    return Response(content=output_data, media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

