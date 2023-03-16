import { JwPlayer, VideoInterface } from "../../types/video"
import { PlayerFeature } from "./types";

export default function setup(player: JwPlayer, { aspectratio }: VideoInterface, isMobile: boolean): PlayerFeature {
  // Force 16:9 aspect for all videos on mobile if not fullscreen
  const overrideAspect = isMobile ? '16:9' : aspectratio
  const configOverrides = overrideAspect ? { aspectratio: overrideAspect } : {}

  const onReady = () => {
    player.on('fullscreen', ({ fullscreen }: { fullscreen: boolean }) => {
      player.setConfig({
        aspectratio: fullscreen ? aspectratio : overrideAspect,
      })
    })
  }

  return {
    preConfig: () => configOverrides,
    onReady
  }
}

