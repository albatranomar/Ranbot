import { Listener } from "discord-akairo";

export default class VoiceStateUpdateEvent extends Listener {
  public constructor() {
    super("VOICE_STATE_UPDATE", {
      emitter: "websocket",
      event: "VOICE_STATE_UPDATE",
    });
  }

  exec() {
  }
}
