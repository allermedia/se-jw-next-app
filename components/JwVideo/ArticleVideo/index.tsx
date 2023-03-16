
import { ContentVideoData } from '../types/video'
import MetaData from './MetaData'
import { useCallback, useState } from 'react'
import ExitLink from './ExitLink'
import React from 'react'
import { useJwPlayer, usePlayerEvent } from '../JwPlayerContext'
import { PLAY, AD_START, AD_END, DISPLAY_CLICK, PLAYLIST_ITEM } from '../constants/playEvents'

import formatMinutes from '../utils/formatMinutes'
import { stripHtml } from '../utils/stripHtml'
import JwPlayer from '../JwPlayer'
import Container from './Container'
import Title from './Title'
import Unmute from './Unmute'


type ArticleVideoProps = ContentVideoData

const ArticleVideo: React.FC<ArticleVideoProps> = (props) => {
  const {
    title,
    teaserLink,
    durationMinutes,
    thumbnail,
    enableDesc,
    description,
    fullWidth,
    aspectratio,
    videoID: mediaId,
    b2bInfo,
    link,
    linkText,
    markingText,
    videoMetaData
  } = props
  const [uiClass, setUIClass] = useState<Array<string>>(['jw-flag-mini-sticky'])

  const [miniStickyActive, setMiniStickyActive] = useState(true)
  const { player, currentMedia } = useJwPlayer()

  const addUIClass = useCallback((mode: string) => {
    setUIClass((prev) => (prev.includes(mode) ? prev : [...prev, mode]))
  }, [])

  const removeUIClass = useCallback((mode: string) => {
    setUIClass((prev) => prev.filter((m: string) => m !== mode))
  }, [])

  const deactivateMiniSticky = useCallback(() => {
    if (player.getFloating() && uiClass.includes('jw-flag-mini-sticky')) {
      removeUIClass('jw-flag-mini-sticky')
      setMiniStickyActive(false)
    }
  }, [player, removeUIClass, uiClass])

  const onPlayListItem = useCallback(({ item }: {item: any}) => {
    if (miniStickyActive) {
      if (item.video_advertiser) {
        removeUIClass('jw-flag-mini-sticky')
      } else {
        addUIClass('jw-flag-mini-sticky')
      }
    }
  }, [addUIClass, removeUIClass, miniStickyActive])

  const onPlay = useCallback(() => {
    addUIClass('jw-playing')
  }, [addUIClass])

  const onAdBreakStart = useCallback(() => {
    addUIClass('jw-ad-active')
  }, [addUIClass])

  const onAdBreakEnd = useCallback(() => {
    removeUIClass('jw-ad-active')
  }, [removeUIClass])

  const showNextPopup = useCallback(
    (show: boolean) => {
      if (show) {
        removeUIClass('js_hide-next-popup')
      } else {
        addUIClass('js_hide-next-popup')
      }
    },
    [addUIClass, removeUIClass]
  )

  usePlayerEvent(player, PLAY, onPlay)
  usePlayerEvent(player, AD_START, onAdBreakStart)
  usePlayerEvent(player, AD_END, onAdBreakEnd)
  usePlayerEvent(player, DISPLAY_CLICK, deactivateMiniSticky)
  usePlayerEvent(player, PLAYLIST_ITEM, onPlayListItem)

  const figure = 'pb-4 border-y border-black border-solid';
  const figure_layout =  'mx-auto mb-4 md:mb-[30px]';
  const figure_max_width = 'max-w-[700px]';
  const caption = 'relative z-[1]';

  const figureStyleKeys = `${figure} ${figure_layout} ${fullWidth ? '' : figure_max_width}`;
  const containerClasses = uiClass.join(' ')

  let videoTitle = stripHtml(title)
  let videoDuration = durationMinutes
  let videoDescription = stripHtml(description)

  // Don't set title on initial video, as title prop can be customized
  // by editors in Labrador.
  if (currentMedia?.mediaid !== mediaId) {
    videoTitle = stripHtml(currentMedia?.title || title)
    videoDuration = formatMinutes(currentMedia?.duration as any) || durationMinutes
    videoDescription = stripHtml(currentMedia?.description || description)
  }

  return (
    <div className={`jwplayer_video ${containerClasses} cts-impression-group`}>
      <figure className={`${figureStyleKeys}`} itemScope itemType="https://schema.org/VideoObject">
        <MetaData {...videoMetaData} />
        <Title title={videoTitle} showLink={!!teaserLink} ctsLabel="video-title-link" mediaId={mediaId} />
        <Container
          {...{
            durationMinutes: videoDuration,
            thumbnail,
            title: videoTitle,
            portrait: aspectratio === '9/16',
          }}
        >
          <JwPlayer {...props} />
          <Unmute ctsLabel="unmute-button"></Unmute>
          <ExitLink
            {...{ mediaId, b2bInfo, link, linkText, markingText, showNextPopup }}
            ctsLabel="exitLinkButton"
          ></ExitLink>
        </Container>
        {enableDesc && (
          <figcaption className={`caption`} itemProp="caption">
            {videoDescription}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

export default ArticleVideo
