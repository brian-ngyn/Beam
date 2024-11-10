# test_client.py

import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import requests
import tempfile
import os
import sys
import time 
import keyboard

def record_audio_max_duration(max_duration=10, fs=44100):
    """
    Records audio from the microphone until the user presses the 's' key or the max_duration is reached.

    Parameters:
    - max_duration (int): Maximum duration in seconds to record.
    - fs (int): Sampling frequency.

    Returns:
    - numpy.ndarray: Recorded audio data.
    """
    print(f"Recording... Press 's' to stop or wait for {max_duration} seconds.")
    recording = []
    try:
        with sd.InputStream(samplerate=fs, channels=1, dtype='int16') as stream:
            for _ in range(int(max_duration * fs / 1024)):
                data, _ = stream.read(1024)
                recording.append(data.copy())
                if keyboard.is_pressed('s'):
                    print("\nRecording stopped by user.")
                    break
        recording = np.concatenate(recording)
        print("Recording complete.")
        return recording
    except Exception as e:
        print(f"Error recording audio: {e}")
        sys.exit(1)


def record_audio(duration=5, fs=44100):
    """
    Records audio from the microphone for a specified duration.

    Parameters:
    - duration (int): Duration in seconds to record.
    - fs (int): Sampling frequency.

    Returns:
    - numpy.ndarray: Recorded audio data.
    """
    print(f"Recording for {duration} seconds...")
    try:
        recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()
        print("Recording complete.")
        return recording
    except Exception as e:
        print(f"Error recording audio: {e}")
        sys.exit(1)

def save_audio(recording, fs=44100):
    """
    Saves the recorded audio to a temporary WAV file.

    Parameters:
    - recording (numpy.ndarray): Audio data.
    - fs (int): Sampling frequency.

    Returns:
    - str: Path to the saved audio file.
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmpfile:
            wav.write(tmpfile.name, fs, recording)
            return tmpfile.name
    except Exception as e:
        print(f"Error saving audio file: {e}")
        sys.exit(1)

def send_trigger_detection(audio_path, safe_word, url='http://localhost:8000/trigger_detection'):
    """
    Sends the audio file and safe word to the /trigger_detection endpoint.

    Parameters:
    - audio_path (str): Path to the audio file.
    - safe_word (str): Safe word to check in the transcribed text.
    - url (str): Endpoint URL.

    Returns:
    - dict: JSON response from the server.
    """
    try:
        with open(audio_path, 'rb') as f:
            files = {'file': f}
            data = {'safe_word': safe_word}
            response = requests.post(url, files=files, data=data)
            response.raise_for_status()
            return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error sending request to /trigger_detection: {e}")
        sys.exit(1)

def send_summary(audio_path, url='http://localhost:8000/summary'):
    """
    Sends the audio file to the /summary endpoint.

    Parameters:
    - audio_path (str): Path to the audio file.
    - url (str): Endpoint URL.

    Returns:
    - dict: JSON response from the server.
    """
    try:
        with open(audio_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(url, files=files)
            response.raise_for_status()
            return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error sending request to /summary: {e}")
        sys.exit(1)

def main():
    """
    Main function to execute the script.
    """
    print("=== FastAPI Audio Processing Client ===\n")
    
    # Prompt user for recording duration
    while True:
        try:
            duration = int(input("Enter recording duration in seconds (e.g., 5): "))
            if duration <= 0:
                print("Please enter a positive integer for duration.")
                continue
            break
        except ValueError:
            print("Invalid input. Please enter a valid integer.")
    
    # Record audio
    recording = record_audio(duration=duration)
    
    # Save audio to a temporary file
    audio_path = save_audio(recording)
    print(f"Audio saved to temporary file: {audio_path}\n")
    
    try:
        # Prompt user for safe word
        safe_word = input("Enter the safe word to check for: ").strip()
        if not safe_word:
            print("Safe word cannot be empty.")
            sys.exit(1)
        
        print("\n=== Sending to /trigger_detection ===")
        trigger_response = send_trigger_detection(audio_path, safe_word)
        print("Response from /trigger_detection:")
        print(trigger_response)
        time.sleep(1)
        print("\n=== Sending to /summary ===")
        summary_response = send_summary(audio_path)
        print("Response from /summary:")
        print(summary_response)
        
    finally:
        # Clean up: Delete the temporary audio file
        if os.path.exists(audio_path):
            os.remove(audio_path)
            print(f"\nTemporary audio file {audio_path} deleted.")

if __name__ == "__main__":
    main()
