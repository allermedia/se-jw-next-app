
import { constructVideoData } from "./helpers/constructVideoData";

//these are user inputs. Modify these
const ENABLE_MOVING_THUMBNAIL = false;
const START_AT_TIMESTAMP = '';
const AUTOSTART = 'viewable';
const MUTE = false;
const PLAYER_ID = 'nxnAskAP';
const MEDIA_ID = 'lFbcRC8Q';


export const getMediaID = ():string => MEDIA_ID;

export const getVideoData = (data: any, file: string) => {
  const modifiedData = {
    ...data[0],
    autostart: AUTOSTART,
    mute: MUTE,
    playerID : PLAYER_ID
  }
  return constructVideoData(modifiedData, file, ENABLE_MOVING_THUMBNAIL, START_AT_TIMESTAMP);
}
