import { convertMinToSec } from "./convertMinToSec";

const updateThumbnailToConfig = (mediaID: string, file = '', enableMovingThumbnail = false, startAtTime = '', device: string) => {
    const mediaFile = `https://cdn.jwplayer.com/v2/media/${mediaID}/poster`;
    const startAtTimeInSeconds = convertMinToSec(startAtTime);
  
    const baseVideoConfig =  [
      {
        file,
        mediaid: mediaID,
        image: `${mediaFile}.jpg?width=${device === 'mobile' ? 320 : 640}`,
        starttime: startAtTimeInSeconds 
      },
    ];
  
    return enableMovingThumbnail ? [{
      ...baseVideoConfig[0],
      images: [
        {
          src: `${mediaFile}.mp4?width=320`,
          width: 320,
          type: 'video/mp4',
        },
        {
          src: `${mediaFile}.mp4?width=640`,
          width: 640,
          type: 'video/mp4',
        },
      ],
    }] : baseVideoConfig;
};

export default function getPlaylist(mediaID: string, file='', enableMovingThumbnail = false, startAtTime = '', device = 'mobile') {
    return updateThumbnailToConfig(mediaID, file, enableMovingThumbnail, startAtTime, device);
}