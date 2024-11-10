# test_client.py

import requests
import sys
import os
import time

def send_trigger_detection(url_mov, safe_word, endpoint_url='http://localhost:8000/trigger_detection'):
    """
    Sends the Supabase URL and safe word to the /trigger_detection endpoint.

    Parameters:
    - url_mov (str): Supabase URL of the .mov file.
    - safe_word (str): Safe word to check in the transcribed text.
    - endpoint_url (str): Endpoint URL.

    Returns:
    - dict: JSON response from the server.
    """
    try:
        data = {
            'url_mov': url_mov,
            'safe_word': safe_word
        }
        response = requests.post(endpoint_url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error sending request to /trigger_detection: {e}")
        sys.exit(1)

def send_summary(url_mov, endpoint_url='http://localhost:8000/summary'):
    """
    Sends the Supabase URL to the /summary endpoint.

    Parameters:
    - url_mov (str): Supabase URL of the .mov file.
    - endpoint_url (str): Endpoint URL.

    Returns:
    - dict: JSON response from the server.
    """
    try:
        data = {'url_mov': url_mov}
        response = requests.post(endpoint_url, json=data)
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

    # Prompt user for Supabase URL
    url_mov = input("Enter the Supabase URL of the .mov file: ").strip()
    if not url_mov:
        print("Supabase URL cannot be empty.")
        sys.exit(1)

    # Prompt user for safe word
    safe_word = input("Enter the safe word to check for: ").strip()
    if not safe_word:
        print("Safe word cannot be empty.")
        sys.exit(1)

    try:
        print("\n=== Sending to /trigger_detection ===")
        trigger_response = send_trigger_detection(url_mov, safe_word)
        print("Response from /trigger_detection:")
        print(trigger_response)
        time.sleep(1)
        print("\n=== Sending to /summary ===")
        summary_response = send_summary(url_mov)
        print("Response from /summary:")
        print(summary_response)

    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
