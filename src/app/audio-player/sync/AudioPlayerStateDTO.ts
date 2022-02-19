import {Device} from "./Device";
import {AudioPlayerActionType} from "./AudioPlayerActionType";

export class AudioPlayerStateDTO {
  activeDevice?: Device;
  currentSongId?: string;
  volume?: number;
  time?: number;
  playing?: boolean;
  // enableShuffle?: boolean;

  constructor(activeDevice: Device, currentSongId: string, volume: number, currentTime: number, playing: boolean) {
    this.activeDevice = activeDevice;
    this.currentSongId = currentSongId;
    this.volume = volume;
    this.time = currentTime;
    this.playing = playing;
    // this.enableShuffle = true;
  }
}
