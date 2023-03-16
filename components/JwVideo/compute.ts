import { Content, Data } from 'types/content'
import { mergeObject } from 'lib/data/compute'
import getVideoSiteLink from './utils/getVideoSiteLink'
import formatMinutes from './utils/formatMinutes'
import fetchB2BInfo from './utils/getB2BVideos'
import getPlaylist from './utils/getPlaylist'
import formatMetaFields from './utils/metaData'
import { JW_USER_ID } from './constants'

export const jwVideo = async (contentData: Content, pageData: Content, device: string): Promise<Content> => {
  const computed = contentData
  const sticky = contentData.data.sticky
  let floating =
    sticky && sticky !== 'default'
      ? {
          floating: {
            dismissible: true,
            mode: contentData.data.sticky,
          },
        }
      : {}

  const aspectratio = contentData.data.aspectratio || '16:9'

  if (aspectratio === '9:16') {
    floating = {
      floating: {
        dismissible: true,
        mode: 'never',
      },
    }
  }
  const { videoID, enableShop, enableTeaser, title,duration, description, publishedAt, thumbnail, enableMovingThumbnail, startAtTime } = contentData.data

  const teaserLink = getVideoSiteLink(videoID, title)

  const { b2bInfo, link, linkText, markingText, file } =
    !enableShop && !enableTeaser
      ? await fetchB2BInfo(videoID)
      : {
          b2bInfo: '',
          link: null,
          linkText: null,
          markingText: null,
          file:  `https://content.jwplatform.com/videos/${videoID}-${JW_USER_ID}.mp4`,
        }

  const videoMetaData = !enableShop && !enableTeaser ? formatMetaFields({duration, title, description, publishedAt, mediaID: videoID, thumbnail}) : {};

  const newProperties = {
    articleInfo: {
      articleVerticals: pageData.data.verticals || [],
      articleId: pageData.meta.id,
    },
    teaserLink,
    ...floating,
    durationMinutes: formatMinutes(contentData.data.duration),
    autostart:
      contentData.meta.isFirstInArticle && contentData.data.autoplay !== 'false' //if first video is asked to be explicitly ctp respect it.
        ? 'viewable'
        : contentData.data.autoplay === 'true' //if video is said to be explicitly autoplay respect it.
        ? 'viewable'
        : false,
    mute: contentData.meta.isFirstInArticle ? true : false,
    playerID: 'nxnAskAP', //TODO fetch for all brands,
    b2bInfo,
    link,
    linkText,
    markingText,
    isFrontPage: pageData.type === 'front',
    playlist: getPlaylist(videoID, file, enableMovingThumbnail, startAtTime, device),
    videoMetaData,
  }
  computed.data = mergeObject(computed.data, newProperties) as Data;

  return computed
}

export default jwVideo
