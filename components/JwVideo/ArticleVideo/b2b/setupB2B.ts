import { B2B_API_ENDPOINT, JW_CDN_URL } from '../../constants'
import { findB2BMediaCandidate } from '../b2b/getB2BCandidate'
import { getUserInformation, saveUserInformation as recordUserVisitToB2BVideo } from '../b2b/userInformation'

const SHOW_COMMERCIAL_LINK_TEXT_CLASS = 'js_show-commercial-link-text'
const SHOW_COMMERCIAL_MARKING_TEXT_CLASS = 'js_show-commercial-marking-text'

const HIDE_JW_NEXT_POPUP = 'js_hide-next-popup'

/** @param {jwplayer.JWPlayer} player */
export default function (
  player: any,
  {
    b2bInfo = '',
    mediaID,
    isB2BVideoPlaying = false,
  }: {
    b2bInfo: string
    mediaID: string
    isB2BVideoPlaying: boolean
  }
) {
  const playerEl = player.getContainer()

  let currentPlayingMediaId: string // Media id, To keep track if the currently playing video is a B2B video or not.
  let b2bCampaignId: string | null // To get campaign ID when available (For recording goals, unique views etc)
  let b2bMediaId: string | null // To get media ID of the B2B video in the campaign
  let b2bMediaInformation: any = {} // Information of the B2B video in the campaign (link text, link, ads text etc.)

  let isB2BVideoShownInThisSession = false // To keep track if a B2B video was showin in a given session
  let decideToShowB2BVideo = false // Did we decide to show a B2b video in a session? (required for deciding if we are showing an exit link or not)
  // const clientId = await getClientId();

  const addExitLinkClasses = (className: string, classList: any, data: string) => {
    if (!data) {
      return
    }

    if (data && !data.length) {
      return
    }

    classList.add(className)
  }

  const exitLinkTracking = (el: any, mediaId: string, shouldAdd = false) => {
    const exitLinkButton = el.parentElement.parentElement.querySelector(`#exit-link`)
    if (!exitLinkButton) {
      return
    }
    const EXIT_LINK_LABEL = 'exitLinkButton'

    const attributeList = {
      'data-cts-label': EXIT_LINK_LABEL,
      'data-cts-name': EXIT_LINK_LABEL,
      'data-cts-creative': EXIT_LINK_LABEL,
    }

    if (shouldAdd) {
      exitLinkButton.classList.add('cts-impression-item')
      Object.keys(attributeList).map((key) => {
        //@ts-ignore
        exitLinkButton.setAttribute(key, attributeList[key])
      })
      exitLinkButton.setAttribute('data-cts-id', mediaId)
    } else {
      exitLinkButton.classList.remove('cts-impression-item')
      Object.keys(attributeList).map((key) => {
        //@ts-ignore
        exitLinkButton.removeAttribute(key, attributeList[key])
      })
      exitLinkButton.removeAttribute('data-cts-id', mediaId)
    }
  }

  const alterVideoElements = () => {
    return new Promise((resolve) => {
      ;[shouldShowNextUpPopup, shouldShowCommercialLinks].map((modifyClass) => modifyClass(playerEl, { b2bMediaId }))
      resolve(true)
    })
  }

  const shouldShowNextUpPopup = (currentlyPlayingVideoElement: any, { b2bMediaId }: { b2bMediaId: string | null }) => {
    if (b2bMediaId) {
      // If we show commercial video next, hide the Next up popup.
      currentlyPlayingVideoElement.classList.add(HIDE_JW_NEXT_POPUP)
    } else {
      // show next up Popup
      currentlyPlayingVideoElement.classList.remove(HIDE_JW_NEXT_POPUP)
    }
  }

  const updateElementContent = (el: any) => {
    const COMMERCIAL_LINK_TEXT_CLASS = 'js_commercial-text--link-text'
    // Inject commercial data.
    const buttonEl = el.parentElement.parentElement.querySelector(
      `.${SHOW_COMMERCIAL_LINK_TEXT_CLASS} .${COMMERCIAL_LINK_TEXT_CLASS}`
    )

    if (buttonEl) {
      buttonEl.setAttribute('href', b2bMediaInformation?.commercial_video_link)
      buttonEl.textContent = b2bMediaInformation?.commercial_video_link_text
    }
    const commercialMarkingElement = el.parentElement.parentElement.querySelector(
      `.${SHOW_COMMERCIAL_MARKING_TEXT_CLASS} .js_commercial-text--marking-text`
    )

    if (commercialMarkingElement) {
      commercialMarkingElement.textContent = b2bMediaInformation?.commercial_video_ad_text
    }
  }

  const addExitLinks = (el: any, mediaId: string) => {
    const classList = el.parentElement.parentElement.classList
    addExitLinkClasses(SHOW_COMMERCIAL_LINK_TEXT_CLASS, classList, b2bMediaInformation?.commercial_video_link_text)
    addExitLinkClasses(SHOW_COMMERCIAL_MARKING_TEXT_CLASS, classList, b2bMediaInformation?.commercial_video_ad_text)
    updateElementContent(el)
    exitLinkTracking(el, mediaId, true)
  }

  const shouldShowCommercialLinks = (
    currentlyPlayingVideoElement: any,
    { b2bMediaId }: { b2bMediaId: string | null }
  ) => {
    // If we are showing commercial video, add commercial texts to it.
    if (currentPlayingMediaId === b2bMediaId) {
      addExitLinks(currentlyPlayingVideoElement, currentPlayingMediaId)
    } else {
      const classList = currentlyPlayingVideoElement.parentElement.parentElement.classList
      classList.remove(SHOW_COMMERCIAL_MARKING_TEXT_CLASS)
      classList.remove(SHOW_COMMERCIAL_LINK_TEXT_CLASS)
      exitLinkTracking(currentlyPlayingVideoElement, currentPlayingMediaId)
    }
  }

  const shouldShowB2BVideo = async (b2bInfo: string) => {
    if (!b2bMediaId && !isB2BVideoShownInThisSession) {
      const userInfo = getUserInformation()
      const { campaignId, mediaId } = findB2BMediaCandidate(b2bInfo, userInfo)

      b2bCampaignId = campaignId
      b2bMediaId = mediaId
    }
  }

  const fetchB2BMedia = async (mediaId: string) => {
    const data = await fetch(`${JW_CDN_URL}/media/${mediaId}`)
    const {
      playlist: [media],
    } = await data.json()

    b2bMediaInformation = {
      commercial_video_link: media?.video_comm_link,
      commercial_video_link_text: media?.video_comm_link_text,
      commercial_video_ad_text: media?.video_comm_ad_text,
    }

    isB2BVideoShownInThisSession = true // Mark that the b2b Video is shown.
    return media // Play the updated media
  }

  const recordGoalReachedAndResetVariables = async (campaignId: string | null) => {
    if (campaignId) {
      b2bMediaId = null
      await fetch(`${B2B_API_ENDPOINT}/recordGoalReached/${campaignId}`).catch((err) =>
        console.warn('B2B Goal increment could not be registered', err)
      )
      // Reset after playing the video.
      b2bCampaignId = null
    }
  }

  player
    .on('playlistItem', ({ item }: { item: { mediaid: string } }) => {
      const { mediaid } = item
      currentPlayingMediaId = mediaid
      decideToShowB2BVideo = false
    })
    .on('complete', () => {
      // Remove classes from earlier video
      const classList = playerEl.parentElement.parentElement.classList
      classList.remove(SHOW_COMMERCIAL_MARKING_TEXT_CLASS)
      classList.remove(SHOW_COMMERCIAL_LINK_TEXT_CLASS)
      exitLinkTracking(playerEl, currentPlayingMediaId)

      isB2BVideoPlaying = false
      player.setPlaylistItemCallback(async () => {
        if (b2bMediaId && !isB2BVideoShownInThisSession && !isB2BVideoPlaying) {
          try {
            return await fetchB2BMedia(b2bMediaId) // Play the updated media
          } catch (error) {
            console.warn(`setPlaylistItemCallback error: `, error)
          }
        }
      })
    })
    .on('time', async ({ position }: { position: number }) => {
      if (!decideToShowB2BVideo && !isB2BVideoPlaying) {
        decideToShowB2BVideo = true
        shouldShowB2BVideo(b2bInfo)
        await alterVideoElements()

        if (!b2bMediaId) {
          //If not a commercial video, test if the related media is a commercial video.
          await fetchB2BMedia(currentPlayingMediaId)
          b2bMediaInformation?.commercial_video_link_text && addExitLinks(playerEl, currentPlayingMediaId)
        }
        const isCurrentlyPlayingB2BVideo = b2bCampaignId && currentPlayingMediaId === b2bMediaId
        if (isCurrentlyPlayingB2BVideo) {
          await recordUserVisitToB2BVideo(b2bCampaignId, getUserInformation())
        }
      } else if (!decideToShowB2BVideo && isB2BVideoPlaying) {
        decideToShowB2BVideo = true
        await fetchB2BMedia(mediaID)
        addExitLinks(playerEl, mediaID)

        // Cos we do not have to show a b2b video again!
        isB2BVideoShownInThisSession = true
      }

      const B2B_MIN_VIEW_DURATION = 3
      const hasSeenB2BVideoForExpectedDuration =
        position > B2B_MIN_VIEW_DURATION && b2bCampaignId && currentPlayingMediaId === b2bMediaId
      if (hasSeenB2BVideoForExpectedDuration) {
        await recordGoalReachedAndResetVariables(b2bCampaignId)
      }
    })
}
