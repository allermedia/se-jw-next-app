import Script from 'next/script'
import { VideoInterface } from '../types/video'

import c from '@/styles/ContentJwVideoShoppable'

type ShoppableVideoProps = VideoInterface
export default function ShoppableVideo(props: ShoppableVideoProps) {
  const { videoID: mediaId } = props

  return (
    <div>
      <div className={c`container liveShopping-root`} data-mediaid={mediaId}></div>
      <Script async type="text/javascript" src="https://aller-live-shopping.vercel.app/scripts/embed/bundle.js" />
    </div>
  )
}
