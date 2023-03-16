import { JwPlayer, JwPlayerError, JwPlayerAdError, PlaylistItem, VideoInterface } from "../../types/video";
import { PlayerFeature } from "./types";
import * as Sentry from "@sentry/nextjs";

  // https://developer.jwplayer.com/jwplayer/docs/jw8-ad-errors-reference
  const ignoredAdErrors: {[key: number]: string} = {
    303: 'ignored errors',
    301: 'Ad request Timeout',
    400: 'ignored errors',
    402: 'related to IMASDK and timeout',
    403: 'when a advertiser is trying to run a unsuppported video file, like webm or flash',
    900: 'This error is sent when someone is trying set us ads with an old standard',
    901: 'Ad Error: An unexpected error occurred within the VPAID creative.',
  };

  // See https://developer.jwplayer.com/jwplayer/docs/jw8-player-errors-reference
  const ignoredPlayerErrors: {[key: number]: string} = {
    224003: `Failed to play the associated resource because it is not supported by this browser. Equivalent to the HTML5 MEDIA_ERR_SRC_NOT_SUPPORTED mediaError.`,
    303213: 'The play attempt was interrupted by a call to pause().',
    101102: 'Failed to load jwplayer.core.controls component',
  };

export default function setup (player: JwPlayer): PlayerFeature {
    const onReady = () => {
        player
        .on('adError', (error: JwPlayerAdError) => {
          if (ignoredAdErrors[error?.code]) return;

          Sentry.captureMessage('JW Video Ad Error', {
            tags: {
              code: JSON.stringify(error?.code),
              message: JSON.stringify(error?.message),
              tag: JSON.stringify(error?.tag),
            },
          });
        })
    
        // Player errors
        .on('error', (error: JwPlayerError) => {
          if (ignoredPlayerErrors[error?.code]) return;
    
          Sentry.captureMessage('Error in the Video playback process', {
            tags: {            
              code: JSON.stringify(error?.code),
              message: JSON.stringify(error?.message),
              sourceError: JSON.stringify(error?.sourceError),
            }
          });
        })
        .on('playAttemptFailed', ({ error, playReason, item }: { error: JwPlayerError, playReason: string, item: PlaylistItem }) => {
          Sentry.captureException(`Video error: ${error}`);
          console.log('JW playAttemptFailed', `Video error: ${error}`, playReason, JSON.stringify(item));
        });
    }

    return {
        preConfig: () => { return {} },
        onReady
    }
}