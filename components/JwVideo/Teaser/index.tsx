import Link from 'next/link'
import { TeaserData, VideoInterface } from '../types/video'
import CustomHeader from './CustomHeader'




type TeaserVideoProps = VideoInterface & TeaserData & {
  isFrontPage: boolean
}
export default function VideoTeaser(props: TeaserVideoProps) {
  const { videoID: mediaId, thumbnail, title, isFrontPage, hintText, stillImage, teaserLink } = props

  const parentModel = 'bodytext'
  const absoluteWidth = '100'
  const section = 'section'

  const teaserClasses = `
        jwplayer__videoTeaser 
        jwplayer__videoTeaser__${parentModel}Model
        jwplayer__videoTeaser__link
        ${
          !isFrontPage
            ? `jwplayer__videoTeaser__horizontalTeaser jwplayer_videoTeaser__horizontalTeaser__${section}`
            : 'default__alignment'
        }
        ${isFrontPage ? `jwplayer__videoTeaser__front large-abs-${absoluteWidth}` : ''}
    `

  const ctsLabel = `video-teaser|${mediaId}`
  return (
    <article className={`jwplayer__videoTeaser__wrapper cts-impression-group`}>
      <Link href={teaserLink} target="_blank">
        <a
          className={`${teaserClasses} cts-impression-item`}
          data-video-id={mediaId}
          data-cts-label={ctsLabel}
          data-cts-name={ctsLabel}
          data-cts-id={mediaId}
          data-cts-creative={ctsLabel}
        >
          <div className={`jwplayer__videoTeaser__mediaArea ${!isFrontPage ? 'article__mediaArea' : ''}`}>
            {stillImage ? (
              <img
                className={`jwplayer_videoTeaser-media`}
                src={`https://cdn.jwplayer.com/v2/media/${mediaId}/poster.jpg?width=640`}
              />
            ) : (
              <video
                className={`jwplayer_videoTeaser-media`}
                src={`https://cdn.jwplayer.com/v2/media/${mediaId}/poster.mp4?width=640`}
                poster={thumbnail}
                autoPlay={true}
                loop={true}
                playsInline
                muted={true}
              />
            )}
            <svg
              className={`jwplayer__video__playIcon jwplayer_playicon`}
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M23.3794 12.0647C23.3794 5.81676 18.3126 0.75 12.0647 0.75C5.81676 0.75 0.75 5.81676 0.75 12.0647C0.75 18.3126 5.81676 23.3794 12.0647 23.3794C18.3126 23.3794 23.3794 18.3126 23.3794 12.0647Z"
                fill="currentColor"
              ></path>
              <path
                d="M17.1382 11.1499L9.40795 6.39865C9.1958 6.27047 8.91735 6.26163 8.70078 6.38539C8.47979 6.50914 8.34277 6.74339 8.34277 6.99532V16.4537C8.34277 16.7056 8.47979 16.9399 8.69636 17.0636C8.80243 17.1211 8.91735 17.152 9.03668 17.152C9.16486 17.152 9.28861 17.1167 9.39911 17.0504L17.1293 12.3389C17.3371 12.2151 17.4652 11.9853 17.4652 11.7466C17.4741 11.5035 17.3459 11.2737 17.1382 11.1499Z"
                fill="white"
              ></path>
            </svg>
          </div>

          <div className={`jwplayer__videoTeaser__content  ${!isFrontPage ? 'article__title' : 'front__title'}`}>
            <CustomHeader isFront={isFrontPage} title={title}></CustomHeader>
            <p className={`jwplayervideoTeaser__hint`}>{hintText}</p>
          </div>
        </a>
      </Link>
    </article>
  )
}
