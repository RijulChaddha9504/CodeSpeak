class AudioControl {
  // private static _instance: AudioControl | null = null;
  static _instance = null;

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
}

module.exports = { AudioControl }; 