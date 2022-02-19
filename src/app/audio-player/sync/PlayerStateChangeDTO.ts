import {ActionEventType} from "./ActionEventType";
import {AudioPlayerStateDTO} from "./AudioPlayerStateDTO";

export class PlayerStateChangeDTO {
  event?: ActionEventType;
  state?: AudioPlayerStateDTO;


  constructor(event: ActionEventType, state: AudioPlayerStateDTO) {
    this.event = event;
    this.state = state;
  }
}
