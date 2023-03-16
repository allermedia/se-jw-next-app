import { JwPlayer } from '../../types/video'
import { PlayerFeature } from './types'

export default function setup(player: JwPlayer): PlayerFeature {
  const onReady = () => {
    player.on('adRequest', (response: any) => {
      try {
        if (response && window.adStats) {
          window.adStats.add([
            {
              placement: 'preroll',
              gptEvent: 'slotRequested',
            },
          ])
          window.adStats.push()
        }
      } catch (error) {
        console.warn(`video adwatch error: `, error)
      }
    })
  }
  const preConfig = () => {
    return {
      video: {
        adRequest: true,
      },
    }
  }

  return {
    preConfig,
    onReady,
  }
}
