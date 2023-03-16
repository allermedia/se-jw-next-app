type PLAY = 'play'
type PAUSE = 'pause'
type MUTE = 'mute'
type UNMUTE = 'unmute'
type TIME = 'time'
type PLAYLIST_ITEM = 'playlistItem'
type STOP = 'stop'
type COMPLETE = 'complete'
type AD_START = 'adBreakStart'
type AD_END = 'adBreakEnd'
type DISPLAY_CLICK = 'displayClick'

type JWPLAYER_EVENT_TYPES =
  | PLAY
  | PAUSE
  | MUTE
  | UNMUTE
  | TIME
  | PLAYLIST_ITEM
  | STOP
  | COMPLETE
  | AD_START
  | AD_END
  | DISPLAY_CLICK

export default JWPLAYER_EVENT_TYPES
