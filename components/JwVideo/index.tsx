
import Script from 'next/script'
import ArticleVideo from './ArticleVideo'
import JwPlayerContext from './JwPlayerContext'
import ShoppableVideo from './Shoppable'
import VideoTeaser from './Teaser'
import { ContentVideoData } from './types/video'


interface JwVideoProps {
  data: ContentVideoData
}

const JwVideo: React.FC<JwVideoProps> = ({ data }) => {

  let videoContent  = (
      <>
        <Script src={`https://cdn.jwplayer.com/libraries/${data.playerID}.js`} strategy="lazyOnload" />
        <JwPlayerContext>
          <ArticleVideo {...data} />
        </JwPlayerContext>
      </>
    
  )

  return <div className={`bodytext`}>{videoContent}</div>
}

export const standalone = JwVideo

const ContentJwVideo =  ({ type, data, meta, descendants }) => {
  return <JwVideo data={data as ContentVideoData}></JwVideo>
}

export default ContentJwVideo
