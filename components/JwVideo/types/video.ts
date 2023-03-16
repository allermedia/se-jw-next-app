import { ArticleInfo } from './articleInfo'

/**
 * TODO Aliased for now, can fill out later.
 */
export type JwPlayer = any
export interface VideoInterface {
  videoID: string
  playerID: string
  thumbnail: string
  mute: boolean
  title: string
  duration: number
  date: string
  publishedAt: string
  autostart: string | boolean
  floating: {
    dismissible: boolean
    mode: string
  }

  articleInfo: ArticleInfo
  aspectratio?: string
  description?: string
  ypPartId?: string
  b2bInfo: string
  link: string
  linkText: string
  markingText: string
  hintText: string
  videoMetaData: VideoMetaData,
  playlist:any
}

export interface TeaserData {
  stillImage: boolean
  enableTeaser: boolean
  teaserLink?: string
}

export interface ArticleVideoData {
  durationMinutes: string
  enableDesc?: boolean
  fullWidth: boolean
  enableShop: boolean
}

export type ContentVideoData = VideoInterface & ArticleVideoData & TeaserData

export interface VideoMetaData {
  title: string
  description: string
  uploadDate: string
  duration: string
  thumbnailUrl: string
  contentUrl: string
}

export interface PlaylistItem {
  description: string
  mediaid: string
  file: string
  image: string
  preload: string
  title: string
  tracks: any
  sources: any
  allSources: any
  duration: number
  video_comm_link_text?: string
  video_comm_link?: string
  video_comm_ad_text?: string
}

export interface JwPlayerError {
  code: number
  message: string
  sourceError: object | null
  type: string
}

export interface JwPlayerAdError extends JwPlayerError {
  tag: string
}
