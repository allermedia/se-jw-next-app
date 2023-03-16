import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { useJwPlayer } from '../JwPlayerContext'
import { adsSetup } from '../modules/ads/adsSetup'
import { ArticleInfo } from '../types/articleInfo'
import { VideoInterface } from '../types/video'
import { lazyLog, setupLogging } from '../utils/lazyLog'
import { mobileAspect, floatBehavior, videoAdWatch, sentryTracking} from './features'


const checkForUserConsentAndGetAdConfig = ({
  articleInfo,
  autostart,
  ypPartId,
}: {
  articleInfo: ArticleInfo
  autostart: string | boolean
  ypPartId: string | null
}): {} => {
  return new Promise((resolve) => {
    if (window.userConsent) {
      window.userConsent.isTargetingApproved(async (response: any) => {
        if (response) {
          //Targetting is approved here
          const customAdConfig = await adsSetup({ articleInfo, autoStart: autostart, wasYouplay: ypPartId === null })
          resolve(customAdConfig)
        } else {
          resolve({})
        }
      })
    } else {
      resolve({})
    }
  })
}

const setupPlayer = async (params: VideoInterface) => {
  const { videoID: mediaID, autostart, articleInfo, ypPartId = null } = params
  const player = window.jwplayer(document.getElementById(mediaID))
  const jwDefaults = window.jwDefaults
  // const customAdConfig = await checkForUserConsentAndGetAdConfig({ autostart, articleInfo, ypPartId })
  const playerEnv = player?.getEnvironment()
  const isMobile = playerEnv?.OS?.mobile

  const features = [
    mobileAspect,
    floatBehavior,
    sentryTracking,
    videoAdWatch
  ].map(setup => setup(player, params, isMobile))

  const configOverrides = features.reduce((configValues, feature) => {
    return {
      ...configValues,
      ...feature.preConfig()
    }
  }, {})

  const videoPlayerConfig = {
    ...params,
    advertising: {
      ...jwDefaults.advertising,
      // ...customAdConfig,
    },
    ...configOverrides,
  }
  lazyLog(() => `Video config is  ${JSON.stringify(videoPlayerConfig, null, 4)}`)

  player.setup(videoPlayerConfig).on('ready', (/*{setupTime: any}*/) => {
    features.forEach(feature => feature.onReady())
  })
  return player;
}

export default function JwPlayer(props: VideoInterface) {
  const { asPath } = useRouter()
  const { player, onPlayerSet } = useJwPlayer()

  setupLogging(asPath)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (window.jwplayer) {
        clearInterval(interval)
        const instance = await setupPlayer(props)
        onPlayerSet(instance)
      }
    })
    return () => clearInterval(interval)
  }, [])

  return <div id={props.videoID}></div>
}
