import { B2B_USER_INFO, videoProxyUrl } from '../../constants'
import { UserInformation } from './types'

const b2bServerUrl = `${videoProxyUrl}/api/b2b`

export const saveUserInformation = async (campaignId: string | null, userInformation: UserInformation) => {
  if (!campaignId) {
    return
  }

  if (userInformation?.seenCampaigns?.hasOwnProperty(campaignId)) {
    userInformation.seenCampaigns[campaignId] = userInformation.seenCampaigns[campaignId] + 1
  } else {
    userInformation.seenCampaigns[campaignId] = 1
    //Register view in DB
    await fetch(`${b2bServerUrl}/regUniqueView/${campaignId}`).catch((err) =>
      console.log('B2B Unique view could not be registered')
    )
  }

  localStorage.setItem(B2B_USER_INFO, JSON.stringify(userInformation))
}

export const getUserInformation = () => {
  const b2bUserInfo = localStorage.getItem(B2B_USER_INFO)
  if (b2bUserInfo) {
    return JSON.parse(b2bUserInfo)
  } else {
    return {
      seenCampaigns: {},
    }
  }
}
