import google.cloud.texttospeech as tts
import os

project_id = "gen-lang-client-0708673015"

def text_to_wav(voice_name: str, text: str):
    language_code = "-".join(voice_name.split("-")[:2])
    text_input = tts.SynthesisInput(text=text)
    voice_params = tts.VoiceSelectionParams(
        language_code=language_code, name=voice_name
    )
    audio_config = tts.AudioConfig(audio_encoding=tts.AudioEncoding.LINEAR16)

    os.environ['GOOGLE_CLOUD_PROJECT'] = project_id
    # os.environ['GOOGLE_APPLICATION_CREDENTIALS'] =
    client = tts.TextToSpeechClient()
    response = client.synthesize_speech(
        input=text_input,
        voice=voice_params,
        audio_config=audio_config,
    )

    filename = f"{voice_name}.wav"
    with open(filename, "wb") as out:
        out.write(response.audio_content)
        print(f'Generated speech saved to "{filename}"')

#text_to_wav("en-US-Standard-A", "Testing text to speech synthesis, working on this feature for users to understand code without visualization")