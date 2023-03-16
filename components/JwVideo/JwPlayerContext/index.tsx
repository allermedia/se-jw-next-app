import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { MUTE, PAUSE, PLAY, PLAYLIST_ITEM, STOP, TIME } from '../constants/playEvents'
import JWPLAYER_EVENT_TYPES from '../constants/playEventTypes'
import { PlaylistItem } from '../types/video'

interface JwPlayerContextType {
  player: any
  isMute: boolean
  isPlaying: boolean
  currentMedia: PlaylistItem | null

  onPlayerSet: (p: any) => void
}

const JwPlayerContext = createContext<JwPlayerContextType>({
  player: null,
  isMute: false,
  isPlaying: false,
  currentMedia: null,

  onPlayerSet: (p: any) => null,
})

export function useJwPlayer(): JwPlayerContextType {
  return useContext(JwPlayerContext)
}

export function usePlayerEvent(player: any, event: JWPLAYER_EVENT_TYPES, callback: Function) {
  useEffect(() => {
    if (!player) {
      return () => {}
    }

    player.on(event, callback)

    return () => {
      player.off(event, callback)
    }
  }, [player, event, callback])
}

export function JwPlayerProvider(props: { children?: React.ReactNode }) {
  const { children } = props
  const [player, setPlayer] = useState<any>(null)
  const [currentMedia, setCurrentMedia] = useState<PlaylistItem | null>(null)
  const [isMute, setIsMute] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const onPlayerSet = useCallback((p: any) => {
    setPlayer(p)
    setIsMute(p.getMute())
  }, [])

  const onMuteEvent = useCallback(({ mute }: { mute: boolean }) => {
    setIsMute(mute)
  }, [])

  const onPlayerPlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const onPlayerPause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const onPlayerStop = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const onPlaylistItem = useCallback(({ index, item }: { index: number; item: PlaylistItem }) => {
    setCurrentMedia(item)
  }, [])

  usePlayerEvent(player, MUTE, onMuteEvent)
  usePlayerEvent(player, PLAY, onPlayerPlay)
  usePlayerEvent(player, PAUSE, onPlayerPause)
  usePlayerEvent(player, STOP, onPlayerStop)
  usePlayerEvent(player, PLAYLIST_ITEM, onPlaylistItem)

  const contextValue: JwPlayerContextType = {
    player,
    isMute,
    isPlaying,
    currentMedia,

    onPlayerSet,
  }

  return <JwPlayerContext.Provider value={contextValue}>{children}</JwPlayerContext.Provider>
}

export default JwPlayerProvider
