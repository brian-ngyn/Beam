# main.py
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import openai
from transformers import pipeline
import logging
import requests
import tempfile
from moviepy.editor import VideoFileClip

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Set your OpenAI API key as an environment variable for security
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize the aggression detection model globally
aggression_classifier = pipeline("text-classification", model="unitary/toxic-bert")

class TriggerDetectionRequest(BaseModel):
    url_mov: str
    safe_word: str

class SummaryRequest(BaseModel):
    url_mov: str

    class Config:
        from_attributes = True
        populate_by_name = True

def download_and_convert_mov(url_mov):
    """
    Downloads the .mov file from the given URL and converts it to a .wav audio file using MoviePy.

    Parameters:
    - url_mov (str): URL of the .mov file.

    Returns:
    - str: Path to the converted .wav audio file.
    """
    try:
        # Download the .mov file
        response = requests.get(url_mov, stream=True)
        response.raise_for_status()
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mov') as tmp_mov_file:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    tmp_mov_file.write(chunk)
            mov_path = tmp_mov_file.name
            logger.info(f".mov file downloaded to {mov_path}")

        # Convert .mov to .wav using MoviePy
        wav_path = mov_path.replace('.mov', '.wav')
        clip = VideoFileClip(mov_path)
        clip.audio.write_audiofile(wav_path, logger=None)
        clip.close()
        logger.info(f".mov file converted to .wav at {wav_path}")

        # Clean up the .mov file
        os.remove(mov_path)
        logger.info(f"Temporary .mov file {mov_path} deleted.")

        return wav_path

    except Exception as e:
        logger.error(f"Error downloading or converting .mov file: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing .mov file: {e}")

def detect_aggression(text: str) -> float:
    """
    Detects the aggression level in the given text using a pre-trained model.

    Parameters:
    - text (str): Transcribed text from audio.

    Returns:
    - aggression_level (float): Aggression level between 0 and 1.
    """
    results = aggression_classifier(text)
    # Extract the score for 'toxic' label
    for result in results:
        if result['label'].lower() == 'toxic':
            logger.info(f"Aggression level detected: {result['score']}")
            return float(result['score'])
    return 0.0  # Non-aggressive

def check_safe_word(text: str, safe_word: str = "beam") -> bool:
    """
    Checks if the provided safe word is present in the text.

    Parameters:
    - text (str): Transcribed text from audio.
    - safe_word (str): The word to search for.

    Returns:
    - bool: True if safe word is found, False otherwise.
    """
    text_lower = text.lower()
    safe_word_lower = safe_word.lower()
    presence = safe_word_lower in text_lower
    logger.info(f"Safe word {'found' if presence else 'not found'} in the text.")
    return presence

@app.post("/trigger_detection")
async def trigger_detection(request: TriggerDetectionRequest):
    """
    Endpoint to detect aggression level and check for a safe word in the provided audio.

    Parameters:
    - request (TriggerDetectionRequest): Contains the Supabase URL and safe word.

    Returns:
    - safe_word_present (bool): Indicates if the safe word was found.
    - aggression_level (float): Aggression level between 0 and 1.
    """
    wav_path = download_and_convert_mov(request.url_mov)

    try:
        # Transcribe audio using OpenAI Whisper
        with open(wav_path, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            text = transcript["text"]
            logger.info("Audio transcription successful.")

        # Aggression Detection
        aggression_level = detect_aggression(text)

        # Safe Word Check
        safe_word_present = check_safe_word(text, request.safe_word)

        return {
            "safe_word": safe_word_present,
            "aggression_level": aggression_level
        }

    except Exception as e:
        logger.error(f"Error processing audio file: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing audio file: {e}")

    finally:
        # Clean up the wav file
        if os.path.exists(wav_path):
            os.remove(wav_path)
            logger.info(f"Temporary audio file {wav_path} deleted.")

@app.post("/summary")
async def summarize_audio(request: SummaryRequest):
    """
    Endpoint to generate a summary and label for the provided audio.

    Parameters:
    - request (SummaryRequest): Contains the Supabase URL.

    Returns:
    - summary (str): Summary of the conversation.
    - label (str): Classification label.
    """
    wav_path = download_and_convert_mov(request.url_mov)

    try:
        # Transcribe audio using OpenAI Whisper
        with open(wav_path, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            text = transcript.get("text", "")
            logger.info("Audio transcription successful.")

        if not text:
            logger.warning("Transcription resulted in empty text.")
            raise HTTPException(status_code=400, detail="Transcription resulted in empty text.")

        # Generate summary using OpenAI ChatCompletion
        summary_messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Provide a concise summary of the following conversation:\n\n{text}"}
        ]
        summary_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=summary_messages,
            max_tokens=150,
            temperature=0.7,
        )
        summary_text = summary_response.choices[0].message['content'].strip()
        logger.info("Summary generation successful.")

        # Generate label using OpenAI ChatCompletion
        classification_messages = [
            {"role": "system", "content": "You are a classification assistant."},
            {"role": "user", "content": f"Classify the following conversation into one of the following categories: 'Aggressive', 'Calm', 'Neutral', 'Happy', 'Sad', 'Angry'.\n\nConversation:\n\n{text}\n\nLabel:"}
        ]
        classification_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=classification_messages,
            max_tokens=5,
            temperature=0,
        )
        label = classification_response.choices[0].message['content'].strip()
        logger.info(f"Conversation classified as: {label}")

        return {
            "summary": summary_text,
            "label": label
        }

    except Exception as e:
        logger.error(f"Error generating summary or label: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating summary or label: {e}")

    finally:
        # Clean up the wav file
        if os.path.exists(wav_path):
            os.remove(wav_path)
            logger.info(f"Temporary audio file {wav_path} deleted.")

# Optional: Root endpoint for basic health check
@app.get("/")
def read_root():
    return {"message": "FastAPI Server is running."}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",  # Ensure this matches your filename and FastAPI instance name
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug"
    )
