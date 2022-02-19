import {Injectable} from "@angular/core";
import {AudioPlayerStateDTO} from "./AudioPlayerStateDTO";
import {Device} from "./Device";
import {AudioPlayerActionType} from "./AudioPlayerActionType";
import * as SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {DeviceType} from "./DeviceType";
import {HttpService} from "../../http.service";
import {PlayerStateChangeDTO} from "./PlayerStateChangeDTO";

@Injectable(
  {providedIn: "root"}
)
export class AudioPlayerWebSocketSyncHandler {
  private readonly SERVER_URL: string = "http://localhost:8888/broadcast";
  private static deviceId: string = '';
  private connectedDevices: Device[] = [];
  private client?: CompatClient;
  private deviceId: string = '';

  constructor(private http: HttpService) {
  }

  openWebSocketSession(playerState: AudioPlayerStateDTO): void {
    let sockJS = new SockJS(this.SERVER_URL);
    this.client = Stomp.over(sockJS);
    this.client.connect({'Authorization': 'Bearer ' + localStorage.getItem('token')!}, () => {
    })
    this.client.onConnect = (event) => {
      this.onConnected(playerState);
    }
  }

  onConnected(playerState: AudioPlayerStateDTO) {
    console.log(JSON.stringify({
      device: this.connectDevice(),
      playerState: playerState
    }));
    this.client?.send("/app/connect/device", {}, JSON.stringify({
      device: this.connectDevice(),
      playerState: playerState
    }));
    this.subscribe();
    this.http.getConnectedDevices().subscribe(value => {
      console.log(value)
      this.connectedDevices.push(...value);
    })
  }

  subscribe(): void {
    console.log(localStorage.getItem("userId"))
    this.client?.subscribe('/topic/device/events/' + localStorage.getItem("userId"), function (event) {
      let body = JSON.parse(event.body);
      let messageEvent = body.event;
      let customEvent = new CustomEvent(messageEvent, {detail: body.state});
      // console.log(messageEvent);
      document.dispatchEvent(customEvent);
      console.log(body);
    }, {})
    this.client?.subscribe("/topic/messages/connect/" + localStorage.getItem("userId"), (event) => {
      console.log("New connection")
      console.log(event.body)
      let device = JSON.parse(event.body);
      this.connectedDevices.push(device);
    })
    this.disconnectHandler();
  }

  private disconnectHandler(): void {
    this.client?.subscribe("/topic/messages/events/disconnect/" + localStorage.getItem("userId"), (event) => {
      let value = JSON.parse(event.body);
      let playerId = value.playerId;
      for (let i = 0; i < this.connectedDevices.length; i++) {
        if (this.connectedDevices[i].deviceId == playerId) {
          this.connectedDevices.splice(this.connectedDevices.indexOf(this.connectedDevices[i]), 1);
        }
      }
    })
  }

  private connectDevice(): Device {
    this.deviceId = this.generateRandomId();
    return new Device(this.deviceId, "Web player " + this.detectBrowserName(),
      DeviceType.WEB_PLAYER, 50);
  }

  sendMessage(playerState: PlayerStateChangeDTO): void {
    let s = JSON.stringify(playerState);
    console.log(s);
    this.client?.send(`/app/device/events`, {'Authorization': 'Bearer ' + localStorage.getItem('token')!}, s);
  }

  //
  // onMessage(): string {
  //   this.webSocket!.onmessage = function (event) {
  //     console.log(event.data)
  //     let json = JSON.parse(event.data);
  //     AudioPlayerWebSocketSyncHandler.deviceId = json.currentDeviceId;
  //     console.log(json.state)
  //     return event.data;
  //   }
  //   return '';
  // }

  // resumePlaying(currentSongId: string, isActive: boolean, volume: number, currentTime: number) {
  //   this.webSocket?.send(JSON.stringify(this.buildAudioPlayerStateDTO(
  //     currentSongId, isActive, volume, currentTime, AudioPlayerActionType.PLAY
  //   )));
  // }
  // closeConnection(): void {
  //   this.webSocket?.close();
  // }
  //
  // buildAudioPlayerStateDTO(currentSongId: string, isActive: boolean, volume: number, currentTime: number, playerState: AudioPlayerActionType): AudioPlayerStateDTO {
  //   let browserName = this.detectBrowserName();
  //   return new AudioPlayerStateDTO(new Device(AudioPlayerWebSocketSyncHandler.deviceId, browserName, "Aboba", isActive),
  //     playerState, currentSongId, volume, currentTime);
  // }
  //

  detectBrowserName(): string {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'Edge browser';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'Opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'Google Chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'Mozila Firefox';
      case agent.indexOf('safari') > -1:
        return 'Safari';
      default:
        return 'other';
    }
  }

  private generateRandomId(): string {
    return (Math.random() + 1).toString(36).substring(7);
  }

  getConnectedDevices(): Device[] {
    console.log(this.connectedDevices)
    return this.connectedDevices;
  }

  //
  // getConnectedDevices(): Device[] {
  //   return [];
  // }

  getCurrentActiveDevice(): Device | undefined {
    for (let i = 0; i < this.connectedDevices.length; i++) {
      if (this.connectedDevices[i].active) return this.connectedDevices[i];
    }
    return undefined;
  }

  isCurrentDeviceActive(): boolean {
    for (let i = 0; i < this.connectedDevices.length; i++) {
      console.log("active: " + this.connectedDevices[i].active + " id: " + this.connectedDevices[i].deviceId == this.deviceId)
      if (this.connectedDevices[i].active && this.connectedDevices[i].deviceId == this.deviceId) return true;
    }
    return false;
  }

  switchDevice(playerStateChangeDTO: PlayerStateChangeDTO) {
    let s = JSON.stringify(playerStateChangeDTO);
    console.log(s)
    this.client?.send("/app/device/events/switch", {'Authorization': 'Bearer ' + localStorage.getItem('token')!}, s);
  }

  setActiveDevice(deviceId: string | undefined) {
    let connectedDevices = this.getConnectedDevices();
    for (let i = 0; i < connectedDevices.length; i++) {
      let device = connectedDevices[i];
      if (device.deviceId == deviceId) {
        this.getCurrentActiveDevice()!.active = false;
        device.active = true;
      }
    }
  }
}
