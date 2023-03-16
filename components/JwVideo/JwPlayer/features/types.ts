import { JwPlayer, VideoInterface } from "../../types/video"

/**
 * Setup function for features that deal strictly with JW and have no interaction with React.
 * player: The player instance being configured.
 * config: VideoInterface passed to the instance.
 * returns An object with methods that will be called during player setup.
 */
export type PlayerFeatureSetup = (player: JwPlayer, config: VideoInterface, isMobile: boolean) => PlayerFeature

/**
 * Contains methods called at various points during player setup.
 * preConfig: Should return overrides for the player config object, they will be merged into initial player config.
 * onReady: Called in player.onReady. Any event callback registering should be done here.
 */
export interface PlayerFeature {
    preConfig: () => Record<string, any>,
    onReady: () => void
}