import {DeviceType} from "./DeviceType";

export class Device {
  deviceId?: string;
  deviceName?: string;
  type?: DeviceType;
  volume?: number;
  active?: boolean;


  constructor(playingDeviceId: string, deviceName: string, type: DeviceType, volume: number) {
    this.deviceId = playingDeviceId;
    this.deviceName = deviceName;
    this.type = type;
    this.volume = volume;
  }
}
