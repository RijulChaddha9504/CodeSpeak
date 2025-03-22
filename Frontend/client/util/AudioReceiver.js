const NODE_BACKEND_DOMAIN_PORT = "http://localhost:3000";

export class AudioReceiver {
  // private static _instance: AudioControl | null = null;
  static _instance = null;
  _audioBuffer = null;
  _wavFile = "";

  constructor() {
    
  }

  static instance() {
    if (AudioReceiver._instance == null) {
      AudioReceiver._instance = new AudioReceiver();
    } 
    return AudioReceiver._instance;
    // return new AudioControl();
  }

  async _loadAudioFileFromNode() { 
    const url = new URL(NODE_BACKEND_DOMAIN_PORT + "/api/get_local_audio_file");
    const params = {
      audio_file_path: 'en-US-Standard-A.wav',
    };

    url.search = new URLSearchParams(params).toString();
    console.log(url);

    await fetch(url).then(async (response) => {
        console.log(response);
        const data = await response.json();
        console.log(data);
      
        this._audioBuffer = data.audio_contents; 
      }); 
  }

  async playAudioFromArrayBuffer() {
    try {
      await this._loadAudioFileFromNode(); 
      const uint8Array = new Uint8Array(this._audioBuffer.data); // Create a Uint8Array from the array
      const arrayBuffer = uint8Array.buffer;
  
      const audioContext = new window.AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
  
      source.onended = function() {
        console.log("Audio playback finished.");
      };
  
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }
}