
import { useEffect, useState, useCallback } from 'react'
import { B2B_API_ENDPOINT, JW_CDN_URL } from '../../constants'
import { PLAYLIST_ITEM, TIME } from '../../constants/playEvents'
import { useJwPlayer, usePlayerEvent } from '../../JwPlayerContext'
import { findB2BMediaCandidate } from '../b2b/getB2BCandidate'
import { getUserInformation, saveUserInformation } from '../b2b/userInformation'

const exitlink_item =  'absolute cursor-pointer font-family:Arial font-normal text-xs';
const commercial_link = `
      right-0 
      no-underline 
      top-[13%] 
      bg-[#000000b3]
      py-1.5
      px-3
      text-white
      hover:opacity-90 
      active:opacity-90 
      focus:opacity-90 
      after:content-['>'] 
      after:ml-[6px]
      before:absolute
      before:inset-[-10px]
      `;
const commercial_marking_text= `
      top-3
      left-3
      text-white 
      w-full 
      p-3
      `;

interface ExitLinksPropsType {
  mediaId: string
  ctsLabel: string
  b2bInfo: string
  link: string
  linkText: string
  markingText: string
  showNextPopup: (show: boolean) => void
}

export default function ExitLink({
  linkText,
  markingText,
  link,
  mediaId,
  ctsLabel,
  b2bInfo = '',
  showNextPopup,
}: ExitLinksPropsType) {
  const [commercialLinkText, setCommercialLinkText] = useState<string | null>(linkText)
  const [commercialLink, setCommercialLink] = useState<string | null>(link)
  const [commercialMarkingText, setCommercialMarkingText] = useState<string | null>(markingText)

  //To check if a decision to show b2b video has been taken
  const [didShowB2BVideo, setDidShowB2BVideo] = useState<boolean>(false)
  const [isB2BVideoPlaying, setIsB2BVideoPlaying] = useState<boolean>(linkText ? true : false)
  const [hasB2BVideoShownThisSession, setHasB2BVideoShownThisSession] = useState<boolean>(false)

  const [b2bMediaId, setB2BMediaId] = useState<string | null>(null)
  const [b2bCampaignId, setB2BCampaignId] = useState<string | null>(null)

  //Read from jw player context.
  const { player, currentMedia } = useJwPlayer()
  const currentMediaId = currentMedia ? currentMedia.mediaid : mediaId

  const fetchB2BMedia = async (mediaId: string) => {
    const data = await fetch(`${JW_CDN_URL}/media/${mediaId}`)
    const {
      playlist: [media],
    } = await data.json()

    return media
  }

  useEffect(() => {
    setDidShowB2BVideo(false)
    setIsB2BVideoPlaying(false)
    const setExitLinkValues = async () => {
      setCommercialLinkText(currentMedia?.video_comm_link_text || null)
      setCommercialLink(currentMedia?.video_comm_link || null)
      setCommercialMarkingText(currentMedia?.video_comm_ad_text || null)
    }

    player?.setPlaylistItemCallback(async () => {
      if (b2bMediaId && !hasB2BVideoShownThisSession && !isB2BVideoPlaying) {
        //Hide next up popup if next video an injected b2b video
        showNextPopup(false)
        try {
          return await fetchB2BMedia(b2bMediaId) // Play the updated media
        } catch (error) {
          console.warn(`setPlaylistItemCallback error: `, error)
        }
      } else {
        showNextPopup(true)
      }
    })

    setExitLinkValues()
  }, [b2bMediaId, currentMedia, hasB2BVideoShownThisSession, isB2BVideoPlaying, player, showNextPopup])

  const onTime = useCallback(async ({ position }: { position: number }) => {
    if (didShowB2BVideo) {
      return
    }
    setDidShowB2BVideo(true)

    const recordGoalReachedAndResetVariables = async () => {
      if (b2bCampaignId) {
        setB2BMediaId(null)
  
        await fetch(`${B2B_API_ENDPOINT}/recordGoalReached/${b2bCampaignId}`).catch((err) =>
          console.warn('B2B Goal increment could not be registered', err)
        )
        // Reset after playing the video.
        setB2BCampaignId(null)
      }
    }
  
    const shouldShowB2BVideo = async (b2bInfo: string) => {
      if (!b2bMediaId && !hasB2BVideoShownThisSession) {
        const userInfo = getUserInformation()
        const { campaignId, mediaId } = findB2BMediaCandidate(b2bInfo, userInfo)
        setB2BMediaId(mediaId)
        setB2BCampaignId(campaignId)
      } else {
        setB2BMediaId(null)
        setB2BCampaignId(null)
      }
    }

    await shouldShowB2BVideo(b2bInfo)

    setHasB2BVideoShownThisSession(true)
    const isCurrentlyPlayingB2BVideo = b2bCampaignId && currentMediaId === b2bMediaId
    isCurrentlyPlayingB2BVideo && (await saveUserInformation(b2bCampaignId, getUserInformation()))

    const B2B_MIN_VIEW_DURATION = 3
    const hasSeenB2BVideoForExpectedDuration =
      position > B2B_MIN_VIEW_DURATION && b2bCampaignId && currentMediaId === b2bMediaId
    if (hasSeenB2BVideoForExpectedDuration) {
      await recordGoalReachedAndResetVariables()
    }
  }, [b2bCampaignId, b2bInfo, b2bMediaId, currentMediaId, didShowB2BVideo, hasB2BVideoShownThisSession])

  usePlayerEvent(player, TIME, onTime)

  return (
    <>
      {/* For commercial link Button */}
      {commercialLinkText && commercialLink && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          className={`${commercial_link} ${exitlink_item} cts-impression-item`}
          href={commercialLink as string}
          data-cts-label={ctsLabel}
          data-cts-name={ctsLabel}
          data-cts-id={mediaId}
          data-cts-creative={ctsLabel}
        >
          {commercialLinkText}
        </a>
      )}

      {/* For commercial ad text */}
      {commercialMarkingText && (
        <div className={`${commercial_marking_text} ${exitlink_item}`}>
          <span>{commercialMarkingText}</span>
        </div>
      )}
    </>
  )
}
