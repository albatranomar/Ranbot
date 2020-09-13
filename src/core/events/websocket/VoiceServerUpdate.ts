import { Listener } from "discord-akairo";

export default class VoiceStateUpdateEvent extends Listener {
  public constructor() {
    super("VOICE_SERVER_UPDATE", {
      emitter: "websocket",
      event: "VOICE_SERVER_UPDATE",
    });
  }

  exec() {
  }
}
