import { B2B_API_ENDPOINT } from '../constants'
import fetchWithDefaults from './fetchWithDefaults'

function getB2BVideos(activeB2BCampaigns: any[], mediaInfo: any, brand: string) {
  // Helper methods
  const satifiesActiveCampaignCriteria = (campaign: any, mediaVertical: string) => {
    /**
     * Any campaign that comes here is an ACTIVE campaign.
     * Decide to show a campaign :
     *  1. Campaign has started
     *  2. Goal has not been reached
     *  3. Campaign Belongs to the vertical of the video
     *  4. Campaign has the same Brand as the video or Campaign's brand = All.
     */
    const hasCampaignStarted = (targetCampaign: { startDate: string }) =>
      new Date().toISOString() >= targetCampaign.startDate
    const isSameBrand = (targetCampaign: { brand: string[] }, targetBrand: string) =>
      targetCampaign.brand.includes(targetBrand) || targetCampaign.brand.includes('all')
    const isGoalCompleted = () => {
      const getExtraPercent = (goalLimit: number) => {
        const EXTRA_PERCENT = 5
        return goalLimit * (EXTRA_PERCENT / 100)
      }
      /**
       * A goal is completed if : Goal Limit is reached
       * Goal limit is calculated as the goal limit+ extra percent determined by variable EXTRA_PERCENT
       */
      return campaign.goalReached >= campaign.goalLimit + getExtraPercent(campaign.goalLimit)
    }

    const isCampaignGoalHit = isGoalCompleted()

    return (
      hasCampaignStarted(campaign) &&
      !isCampaignGoalHit &&
      campaign.vertical === mediaVertical &&
      isSameBrand(campaign, brand)
    )
  }

  const vertical = mediaInfo?.vertical
  const isInB2BVerticals = activeB2BCampaigns?.map((i) => i.vertical).includes(vertical)
  const activeCampaigns = activeB2BCampaigns?.filter((i) => satifiesActiveCampaignCriteria(i, vertical))

  let activeB2BInfo = ''
  if (isInB2BVerticals) {
    activeCampaigns?.forEach((i) => {
      const verticalShare = i.verticalShare.filter(
        (camp: { brand: string }) => camp.brand === brand || camp.brand === 'all'
      )[0]
      activeB2BInfo += `${i.campaignId}-${i.mediaId}-${verticalShare ? verticalShare.share : 0}-${i.userFrequency}*`
    })
  }
  return activeB2BInfo
}

const fetchB2BInfo = async (mediaId: string) => {
  const { activeB2BCampaigns, mediaInfo } = await fetchWithDefaults(
    `${B2B_API_ENDPOINT}/getCampaignsAndMediaInfo/${mediaId}`
  )
  const site = process.env.OCELOT_SITE || ''

  const b2bInfo = getB2BVideos(activeB2BCampaigns, mediaInfo, site)

  return {
    b2bInfo,
    link: mediaInfo?.video_comm_link,
    linkText: mediaInfo?.video_comm_link_text,
    markingText: mediaInfo?.video_comm_ad_text,
    file: mediaInfo?.fileSource
  }
}

export default fetchB2BInfo
