
import { useEffect, useState, useCallback } from 'react'
import { PLAY } from '../../constants/playEvents'
import { useJwPlayer, usePlayerEvent } from '../../JwPlayerContext'

interface UnmutePropsType {
  ctsLabel: string
}
const button = `
group 
hidden 
[&.show]:flex 
md:[&.show]:hidden 
[&.has-volume]:hidden 
w-[30px] 
h-[30px] 
bg-white 
absolute 
bottom-1/2 
left-3 
rounded-2xl 
bg-no-repeat 
whitespace-nowrap 
items-center 
transition-[width] 
duration-100 
ease-linear 
[&.expanded]:w-[97px] 
[&.expanded]:overflow-hidden 
after:absolute 
after:top-[-7px] 
after:left-[-7px]
 after:w-[150%] 
 after:h-[150%] 
 after:animate-pulse-ring 
 after:border-4 
 after:border-solid 
 after:border-white 
 after:rounded-full 
 [&.expanded]-after:hidden
 `;

const button__text =  `
  hidden 
  text-black 
  text-[11px] 
  ml-[35px] 
  group-[.expanded]:inline-block
  `;

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
          className={`${button} ${animationClasses} ${isMute ? '' : 'has-volume'} jwplayer__unmute cts-impression-item`}
          data-cts-label={ctsLabel}
          data-cts-name={ctsLabel}
          data-cts-id={mediaId}
          data-cts-creative={ctsLabel}
        >
          <span className={`${button__text}`}>Slå på ljud</span>
        </div>
      )}
    </>
  )
}
