import { DownloadResponse, Storage } from '@google-cloud/storage';
const storage = new Storage;
const BucketName = "";

class AudioControl {
  private static _instance: AudioControl | null = null;
  private _audioElement: HTMLAudioElement | null = null;
  private _wavFile: string = "";

  private constructor() {
    
    if (AudioControl._instance == null) {
      AudioControl._instance = new AudioControl()
    } 
    return AudioControl._instance
  }

  public static instance() {
    return new AudioControl();
  }

  // WARNING: UNSURE OUTPUT FILE TYPE
  private async downloadIntoMemory(fileName: string ) {
    const contents = storage.bucket(BucketName).file(fileName).download();
    return contents;
  }

  private loadVoiceFile(WAV_file: DownloadResponse) {
    console.log(WAV_file)
    //this._audioElement = new Audio(WAV_file)
  }

  public loadAudio(fileName: string) {
    const contents: Promise<DownloadResponse> = this.downloadIntoMemory(fileName);
    contents
    .then(this.loadVoiceFile)
    .catch((error) => error);
  }

  public playLoadedAudio() {
    if (this._audioElement == null) {
      throw Error("no audio file loaded");
    }
    this._audioElement?.play();
  }
  
}


export { AudioControl }