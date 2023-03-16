import qs from 'query-string'
import { JW_CDN_URL } from '../../constants'
import { ArticleInfo } from '../../types/articleInfo'
import { lazyLog } from '../../utils/lazyLog'
import waitFor from '../../utils/waitFor'
import { replaceTag } from './e2eTest/replaceTag'


const addArticleDataToAdTag = (tag: string, articleInfo: ArticleInfo, videoData: any, experimentGroup: any, adsPpId: any) => {
  const { articleId = '', articleVerticals = [] } = articleInfo
  const { wasYouplay } = videoData
  const { url, query: tagQuery } = qs.parseUrl(tag)

  const custParams = tagQuery.cust_params || ''
  const [params] = Array.isArray(custParams) ? custParams : [custParams]

  const custParamsObj = qs.parse(params as string)
  // Add 'verticals'
  if (articleVerticals?.length) {
    // Put verticals in a set to create a list with unique values
    const verticalsSet = new Set([articleVerticals])
    const verticals = Array.from(verticalsSet)
    lazyLog(() => `Adding verticals to JW player ad tags: ${verticals} for player in article #${articleId}`)
    // eslint-disable-next-line
    custParamsObj['Vertikal'] = verticals.join(',')
  }

  if (experimentGroup) {
    lazyLog(() => `Set optimizeId to adTag`)
    // eslint-disable-next-line
    custParamsObj['abgroup'] = experimentGroup
  }
  if (adsPpId) {
    lazyLog(() => `Set ppid to adTag`);
  }

  // Add converted to youplay measurement
  if (wasYouplay) {
    // maybe have youplay ID here?
    // eslint-disable-next-line
    custParamsObj['videoplayer'] = 'youplay'
  }
  return adsPpId
    ? `${url}?${qs.stringify({
        ...tagQuery,
        cust_params: qs.stringify(custParamsObj),
        ppid: adsPpId,
      })}`
    : `${url}?${qs.stringify({
        ...tagQuery,
        cust_params: qs.stringify(custParamsObj),
      })}`;

}

export const adsSetup = async ({
  articleInfo,
  autoStart,
  wasYouplay,
}: {
  articleInfo: ArticleInfo
  autoStart: string | boolean
  wasYouplay: boolean
}) => {
  const brand = process.env.OCELOT_SITE || ''
  let adscheduleid: any
  if (brand.includes('residence')) {
    // const adsReady = () => !!(window.ads && window.ads.getAdScheduleId)

    lazyLog(() => `TRY wait for getAdScheduleId ...`)

    const startTime = new Date().valueOf()

    const adScheduleTimeout = 2000
    try {
      // await waitFor(adsReady, { timeout: adScheduleTimeout })
    } catch (e) {
      // log.warn(`Timeout ${adScheduleTimeout} for window.ads.getAdScheduleId:`, e);
    }



      // Fetch from Ads Microservice, brand specific adscheduleid based on if a video is autoplay or click to play
      adscheduleid = autoStart === 'viewable' ? 'OhFmmo3F' : 'ib9PwBrj'

      lazyLog(
        () =>
          `Using ${autoStart === 'viewable' ? 'autoplay' : 'clickToplay'} ${adscheduleid} from Ads-MS to get scheduleID`
      )
    

    lazyLog(() => `Using ${adscheduleid} from ads-bundle to get schedule`)
  }

  if (!adscheduleid) {
    throw new Error(`No ad schedule Id found`)
  }

  const advertisingDefaults = await (await fetch(`${JW_CDN_URL}/advertising/schedules/${adscheduleid}.json`)).json()

  const { schedule } = advertisingDefaults
  if (!schedule) {
    throw new Error(`No ad schedule found in supplied ad config`)
  }

  let experimentGroup: any = null

  // Wait for ads bundle to load
  // const adsReady = () => !!(window.ads && window.ads.getVideoExperimentGroup)
  const adScheduleTimeout = 2000

  try {
    lazyLog(() => `TRY wait for getAdScheduleId ...`)
    const startTime = new Date().valueOf()

    // await waitFor(adsReady, { timeout: adScheduleTimeout })
    const tDiff: number = new Date().valueOf() - startTime
    lazyLog(() => `Ads ready wait time:  ${Math.round(tDiff)} milliseconds`)

    // experimentGroup = await window.ads.getVideoExperimentGroup().catch((reason: string) => lazyLog(() => reason))

    const timeDiff: number = new Date().valueOf() - startTime
    lazyLog(() => `AdSchedulId wait time:  ${Math.round(timeDiff)} milliseconds`)

    lazyLog(() => `window.ads.getVideoExperimentGroup()  ${experimentGroup} `)
  } catch (e) {
    console.warn(`Timeout ${adScheduleTimeout} for window.ads.getAdScheduleId:`, e)
  }

  let adsPpId: any = null;

  // const adsReadyForPpId = () => !!(window.ads && window.ads.getVideoPpId);

  const adsTimeout = 2000;
  try {
    // await waitFor(adsReadyForPpId, { timeout: adsTimeout });
  } catch (e) {
    console.warn(`Timeout ${adsTimeout} for window.ads.getVideoPpId:`, e);
  }
  // if (window.ads && window.ads.getVideoPpId) {
  //   adsPpId = window.ads.getVideoPpId();
  // }

  const modifySchedule = () => {
    const url = new URL(window.location.href)
    const dfpIdVal = url.searchParams.get('dfp_id')

    if (dfpIdVal) {
      //It is from a test article, show test ad.
      return schedule.map(({ tag }: { tag: string }) => ({
        tag: replaceTag(tag, dfpIdVal),
      }))
    } else {
      return schedule.map(({ tag }: { tag: string }) => ({
        tag: addArticleDataToAdTag(tag, articleInfo, { wasYouplay }, experimentGroup, adsPpId),
      }))
    }
  }

  return {
    schedule: modifySchedule(),
    adscheduleid,
  }
}
