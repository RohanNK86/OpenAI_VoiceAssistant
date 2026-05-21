import os
import whisper
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv

# Load env variables
load_dotenv(override=True)

# FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper
speech_model = whisper.load_model("tiny")

# OpenRouter client
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

@app.get("/")
def home():
    return {"message": "AI Voice Assistant Backend Running"}

@app.post("/voice")
async def voice_assistant(audio: UploadFile = File(...)):

    os.makedirs("temp", exist_ok=True)
    temp_file = "temp/temp_audio.wav"

    # Save uploaded audio
    with open(temp_file, "wb") as f:
        f.write(await audio.read())

    # Speech to text
    result = speech_model.transcribe(temp_file)

    user_text = result["text"]
    
    model_id = os.getenv("MODEL_ID", "openai/gpt-oss-120b:free")

    # AI response
    completion = client.chat.completions.create(
        model=model_id,
        messages=[
            {
                "role": "user",
                "content": user_text
            }
        ]
    )

    ai_reply = completion.choices[0].message.content

    return {
        "user_text": user_text,
        "ai_reply": ai_reply
    }
