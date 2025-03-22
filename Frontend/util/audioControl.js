import { NODE_BACKEND_DOMAIN_PORT } from "../server/node_constants.js";

export class AudioControl {
  // private static _instance: AudioControl | null = null;
  static _instance = null;
  _audioBuffer = null;
  _wavFile = "";

  constructor() {
    
  }

  static instance() {
    if (AudioControl._instance == null) {
      AudioControl._instance = new AudioControl();
    } 
    return AudioControl._instance;
    // return new AudioControl();
  }

 // Outputs a buffer of the audio file (Uint8Array)
  async downloadIntoMemory(fileName ) {
    const { Storage: GoogleCloudStorage } = require('@google-cloud/storage');
    const BucketName = "wav-audio-bucket";
    const storage = new GoogleCloudStorage;
    const [contents] = await storage.bucket(BucketName).file(fileName).download();
    return contents;
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

// module.exports = { AudioControl }; 