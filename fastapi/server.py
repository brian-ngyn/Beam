# main.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import openai
from transformers import pipeline
import shutil

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
API_KEY = "# main.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import openai
from transformers import pipeline
import shutil

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
API_KEY = "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"

# Set your OpenAI API key as an environment variable for security
openai.api_key = API_KEY

# Initialize the aggression detection model globally
aggression_classifier = pipeline("text-classification", model="unitary/toxic-bert")

@app.post("/trigger_detection")
async def trigger_detection(
    file: UploadFile = File(...),
    safe_word: str = Form(...)
):
    """
    Endpoint to detect aggression level and check for a safe word in the provided audio.
    
    Parameters:
    - file: Audio file uploaded by the user.
    - safe_word: The word to check for in the transcribed text.
    
    Returns:
    - safe_word_present (bool): Indicates if the safe word was found.
    - aggression_level (float): Aggression level between 0 and 1.
    """
    # Save the uploaded audio file to a temporary location
    audio_filename = "uploaded_audio.wav"
    try:
        with open(audio_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save audio file: {e}")
    finally:
        file.file.close()

    # Transcribe audio using OpenAI Whisper
    try:
        with open(audio_filename, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            text = transcript["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
    finally:
        # Clean up the saved audio file
        if os.path.exists(audio_filename):
            os.remove(audio_filename)

    # Aggression Detection
    aggression_level = detect_aggression(text)

    # Safe Word Check
    safe_word_present = check_safe_word(text, safe_word)

    return {
        "safe_word": safe_word_present,
        "aggression_level": aggression_level
    }

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
            return float(result['score'])
    return 0.0  # Non-aggressive

def check_safe_word(text: str, safe_word: str) -> bool:
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
    return safe_word_lower in text_lower

@app.post("/summary")
async def summarize_audio(file: UploadFile = File(...)):
    """
    Endpoint to generate a summary and label for the provided audio.
    
    Parameters:
    - file: Audio file uploaded by the user.
    
    Returns:
    - summary (str): Summary of the conversation.
    - label (str): Classification label.
    """
    audio_filename = "uploaded_audio.wav"
    try:
        with open(audio_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Audio file saved as {audio_filename}.")
    except Exception as e:
        logger.error(f"Failed to save audio file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save audio file: {e}")
    finally:
        file.file.close()

    # Transcribe audio using OpenAI Whisper
    try:
        with open(audio_filename, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            text = transcript.get("text", "")
            logger.info("Audio transcription successful.")
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
    finally:
        if os.path.exists(audio_filename):
            os.remove(audio_filename)
            logger.info(f"Temporary audio file {audio_filename} deleted.")

    if not text:
        logger.warning("Transcription resulted in empty text.")
        raise HTTPException(status_code=400, detail="Transcription resulted in empty text.")

    # Generate summary and label using GPT
    try:
        # Generate Summary using ChatCompletion
        summary_messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Provide a concise summary of the following conversation:\n{text}"}
        ]
        summary_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=summary_messages,
            max_tokens=150,
            temperature=0.7,
        )
        summary_text = summary_response.choices[0].message['content'].strip()
        logger.info("Summary generation successful.")

        # Generate Label using ChatCompletion
        classification_messages = [
            {"role": "system", "content": "You are a classification assistant."},
            {"role": "user", "content": f"Classify the following conversation into one of the following categories: 'Aggressive', 'Calm', 'Neutral', 'Happy', 'Sad', 'Angry'.\n\nConversation:\n{text}\n\nLabel:"}
        ]
        classification_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=classification_messages,
            max_tokens=5,
            temperature=0,
        )
        label = classification_response.choices[0].message['content'].strip()
        logger.info(f"Conversation classified as: {label}")

    except Exception as e:
        logger.error(f"Summary generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {e}")

    return {
        "summary": summary_text,
        "label": label
    }

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
    )"

# Set your OpenAI API key as an environment variable for security
openai.api_key = API_KEY

# Initialize the aggression detection model globally
aggression_classifier = pipeline("text-classification", model="unitary/toxic-bert")

@app.post("/trigger_detection")
async def trigger_detection(
    file: UploadFile = File(...),
    safe_word: str = Form(...)
):
    """
    Endpoint to detect aggression level and check for a safe word in the provided audio.
    
    Parameters:
    - file: Audio file uploaded by the user.
    - safe_word: The word to check for in the transcribed text.
    
    Returns:
    - safe_word_present (bool): Indicates if the safe word was found.
    - aggression_level (float): Aggression level between 0 and 1.
    """
    # Save the uploaded audio file to a temporary location
    audio_filename = "uploaded_audio.wav"
    try:
        with open(audio_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save audio file: {e}")
    finally:
        file.file.close()

    # Transcribe audio using OpenAI Whisper
    try:
        with open(audio_filename, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            text = transcript["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
    finally:
        # Clean up the saved audio file
        if os.path.exists(audio_filename):
            os.remove(audio_filename)

    # Aggression Detection
    aggression_level = detect_aggression(text)

    # Safe Word Check
    safe_word_present = check_safe_word(text, safe_word)

    return {
        "safe_word": safe_word_present,
        "aggression_level": aggression_level
    }

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
            return float(result['score'])
    return 0.0  # Non-aggressive

def check_safe_word(text: str, safe_word: str) -> bool:
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
    return safe_word_lower in text_lower

@app.post("/summary")
async def summarize_audio(file: UploadFile = File(...)):
    """
    Endpoint to generate a summary and label for the provided audio.
    
    Parameters:
    - file: Audio file uploaded by the user.
    
    Returns:
    - summary (str): Summary of the conversation.
    - label (str): Classification label.
    """
    audio_filename = "uploaded_audio.wav"
    try:
        with open(audio_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Audio file saved as {audio_filename}.")
    except Exception as e:
        logger.error(f"Failed to save audio file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save audio file: {e}")
    finally:
        file.file.close()

    # Transcribe audio using OpenAI Whisper
    try:
        with open(audio_filename, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            text = transcript.get("text", "")
            logger.info("Audio transcription successful.")
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
    finally:
        if os.path.exists(audio_filename):
            os.remove(audio_filename)
            logger.info(f"Temporary audio file {audio_filename} deleted.")

    if not text:
        logger.warning("Transcription resulted in empty text.")
        raise HTTPException(status_code=400, detail="Transcription resulted in empty text.")

    # Generate summary and label using GPT
    try:
        # Generate Summary using ChatCompletion
        summary_messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Provide a concise summary of the following conversation:\n{text}"}
        ]
        summary_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=summary_messages,
            max_tokens=150,
            temperature=0.7,
        )
        summary_text = summary_response.choices[0].message['content'].strip()
        logger.info("Summary generation successful.")

        # Generate Label using ChatCompletion
        classification_messages = [
            {"role": "system", "content": "You are a classification assistant."},
            {"role": "user", "content": f"Classify the following conversation into one of the following categories: 'Aggressive', 'Calm', 'Neutral', 'Happy', 'Sad', 'Angry'.\n\nConversation:\n{text}\n\nLabel:"}
        ]
        classification_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=classification_messages,
            max_tokens=5,
            temperature=0,
        )
        label = classification_response.choices[0].message['content'].strip()
        logger.info(f"Conversation classified as: {label}")

    except Exception as e:
        logger.error(f"Summary generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {e}")

    return {
        "summary": summary_text,
        "label": label
    }

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
