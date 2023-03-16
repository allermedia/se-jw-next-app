
import { useEffect, useState, useCallback } from 'react'
import { PLAY } from '../../constants/playEvents'
import { useJwPlayer, usePlayerEvent } from '../../JwPlayerContext'

interface UnmutePropsType {
  ctsLabel: string
}

type UnmuteButtonState = 'off' | 'on' | 'show'

export default function Unmute({ ctsLabel }: UnmutePropsType) {
  const { player, isMute, currentMedia } = useJwPlayer()
  const [showUnmute, setShowUnmute] = useState<UnmuteButtonState>('off')
  const [animationClasses, setAnimationClasses] = useState('show')

  const mediaId = currentMedia ? currentMedia.mediaid : ''

  if (isMute && showUnmute === 'on') {
    setShowUnmute('show')
  }

  const onUnmuteClick = () => {
    player.setMute(false)
  }

  const onPlay = useCallback(() => {
    let unmute: UnmuteButtonState = 'on'
    if (player.getMute()) {
      unmute = 'show'
    }
    setShowUnmute(unmute)
  }, [player])

  usePlayerEvent(player, PLAY, onPlay)
  useEffect(() => {
    if (showUnmute !== 'show') {
      return () => {}
    }
    const timeouts: Array<NodeJS.Timeout> = []

    timeouts.push(setTimeout(() => setAnimationClasses('show expanded'), 3000))
    timeouts.push(setTimeout(() => setAnimationClasses('show'), 7000))
    timeouts.push(setTimeout(() => setAnimationClasses(''), 17000))

    return () => {
      timeouts.map((t) => clearTimeout(t))
    }
  }, [showUnmute])

  return (
    <>
      {showUnmute === 'show' && (
        <div
          onClick={onUnmuteClick}
          className={`button ${animationClasses} ${isMute ? '' : 'has-volume'} jwplayer__unmute cts-impression-item`}
          data-cts-label={ctsLabel}
          data-cts-name={ctsLabel}
          data-cts-id={mediaId}
          data-cts-creative={ctsLabel}
        >
          <span className={`button__text`}>Slå på ljud</span>
        </div>
      )}
    </>
  )
}
