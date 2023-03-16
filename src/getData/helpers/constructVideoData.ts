import { ContentVideoData } from "../../../components/JwVideo/types/video";
import getPlaylist from "./getPlaylist";

export const constructVideoData = (data : any, file: string, enableMovingThumbnail: boolean, startAtTime: string): ContentVideoData => {
    const {title, mediaid, link, image, duration, pubdate, description, playerID, autostart, mute} = data;
    return {
      videoID: mediaid,
      playerID,
      thumbnail: image,
      mute, 
      title,
      duration,
      date: pubdate,
      publishedAt: pubdate,
      autostart,
      playlist: getPlaylist(mediaid, file, enableMovingThumbnail, startAtTime),
      floating: {
        dismissible: true,
        mode: 'notVisible'
      },
      articleInfo: {
        articleId: 123,
        articleVerticals: ['beauty', 'elle']
      },
      b2bInfo: '',
      link: '',
      linkText: '',
      markingText: '',
      hintText: '',
      videoMetaData: {
        title,
        description,
        uploadDate: pubdate,
        duration,
        thumbnailUrl: image,
        contentUrl: `https://cdn.jwplayer.com/videos/${mediaid}-alAVThkH.mp4`,
      },
      durationMinutes: '0:40',
      fullWidth: false,
      enableShop: false,
      enableTeaser:false,
      stillImage: false
    }
  }