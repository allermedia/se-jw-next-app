/**
 *
 * @param mediaId
 * Logic to determine if we should show a B2B video to a unique user visiting a video
 *
 * 1. User visits media XXX
 * 2. Check against these conditions:
 *      1. Is media's Vertical included in the verticals of the B2B campaigns we have today?
 *      2. has the campaign started
 *      3. Is the campaign goal completed already?
 * 3. If yes, this is a candidate for B2B videos.
 * 4. To decide which vertical share to drop the user now.
 * 5. Say you have 2 B2B campaigns in same vertical which are active. One with vertical share
 *    of 20% and other 30%. So verticalShareBuckets = [20,30, (100-(20+30))] = [20, 30, 50]
 * 6. Check from user information if this video has been shown to this unnique user and if we already passed the limit
 *    If yes, remove them from the verticalShareBuckets and create the one with the difference appropriately.
 * 7. Now create the  userBuckets  from verticalShareBuckets as userBuckets = [[1 -20], [21 -50], [51-100]]
 * 8. Choose a random number between 1 - 100 and map it to one of these buckets and get a bucket. Say 30.
 * 9. There is a B2B campaign with verticalShare = 30, so the candidate is that one.
 * 10. If not, there is no B2B campaign for this user, they will continue with the normal recommended video.
 *
 */

import { UserInformation } from "./types"

/**
 * Returns if a vertical is a B2B Vertical
 * AND The list of active B2B Campaigns belonging to the vertical
 */

const START = 1
const END = 100

const randomNumBtwInterval = (min = START, max = END) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
/**
 *
 * @param verticalShareBuckets Input as [20, 70, 30]
 * @returns user buckets as [[1 - 20],[21 - 50], [51 - 100]]
 */
const createUserBuckets = (verticalShareBuckets: number[]) => {
  const userBuckets: string[][] = []
  verticalShareBuckets.reduce((acc, i) => {
    userBuckets.push([1 + acc + '-' + (i + acc)])
    acc = i + acc
    return acc
  }, 0)

  return userBuckets
}

const getCampaignList = (b2bInfo: string) => {
  const b2bInfoList = b2bInfo.split('*').filter((i) => i.length)

  return b2bInfoList.map((i) => {
    const [campaignId, mediaId, verticalShare, userFrequency] = i.split('-')
    return {
      campaignId,
      mediaId,
      verticalShare: parseInt(verticalShare, 10),
      userFrequency: parseInt(userFrequency, 10),
    }
  })
}

/**
 *
 * @param campaignList = List of Active campaigns belonging to the Vertical
 * @param userInformation = User seen campaigns information
 * @returns
 */
const getEligibleCampaign = (b2bInfo: string, userInformation: UserInformation) => {
  if (!userInformation) {
    return null
  }
  let verticalShareBuckets: number[] = []
  let campaignList = getCampaignList(b2bInfo)

  if (!Object.keys(userInformation.seenCampaigns).length) {
    // User has not seen any campaigns yet
    verticalShareBuckets = campaignList.map((i) => i.verticalShare)
  } else {
    // User has seen some B2B campaigns.
    // Filter out campaigns that have exceeded the allowed unique view frequency
    campaignList = campaignList.filter((campaign) => {
      const [elgibleCampaign] = Object.keys(userInformation.seenCampaigns).filter(
        (i) =>
          !userInformation.seenCampaigns.hasOwnProperty(campaign.campaignId) ||
          (i === campaign.campaignId && campaign.userFrequency > userInformation.seenCampaigns[i])
      )
      return elgibleCampaign
    })

    verticalShareBuckets = campaignList.reduce((acc: number[], campaign) => {
      acc.push(campaign.verticalShare)
      return acc
    }, [])
  }

  const sumOfVerticalShares = verticalShareBuckets.reduce((i, acc) => acc + i, 0)

  if (sumOfVerticalShares > 0) {
    verticalShareBuckets.push(100 - sumOfVerticalShares)
    // Now user verticalShareBuckets are as - [20, 30, 50]
    const userBuckets = createUserBuckets(verticalShareBuckets)
    const randomNum = randomNumBtwInterval()
    // Map this random number to one of the userBuckets
    const [matchedBucket = null]: any = userBuckets.filter((bucket) => {
      const num = bucket[0].split('-').map((i) => parseInt(i, 10))
      return randomNum >= num[0] && randomNum <= num[1]
    })
    const bucketIndex = userBuckets.indexOf(matchedBucket)

    if (campaignList[bucketIndex]) {
      return campaignList.filter((campaign) => campaign.verticalShare === verticalShareBuckets[bucketIndex])[0]
    }
  }

  // There Doesnt exist a campaign
  return null
}

/**
 *
 * @param b2bInfo String b2bVideo information applicable for this video based on
 * brand, vertical. It is a string seperated with *,
 * campaignId-verticalShare-userFrequency
 * @param userInformation User information with unique user Id and seen Campaigns Information.
 * @returns
 */
export const findB2BMediaCandidate = (b2bInfo: string, userInformation: UserInformation) => {
  let b2bMediaCandidate: {
    campaignId: string | null
    mediaId: string | null
  } = {
    campaignId: null,
    mediaId: null,
  }
  if (!b2bInfo?.length) {
    return b2bMediaCandidate
  }

  const eligibleCampaign = getEligibleCampaign(b2bInfo, userInformation)
  if (eligibleCampaign) {
    b2bMediaCandidate = {
      campaignId: eligibleCampaign.campaignId,
      mediaId: eligibleCampaign.mediaId,
    }
  }

  return b2bMediaCandidate
}
