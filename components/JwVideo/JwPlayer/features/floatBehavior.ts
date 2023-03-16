import { JwPlayer, VideoInterface } from "../../types/video";
import { PlayerFeature } from "./types";

let observerInstance: IntersectionObserver | null = null;
const floaters = new WeakMap();

function getObserver (threshold = 0.3): IntersectionObserver {
    if (observerInstance == null) {
        observerInstance = createObserver(threshold);
    }

    return observerInstance
}

function createObserver(threshold = 0.3) {
  const floatObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const data = floaters.get(e.target);
        if (!data) {
          return;
        }

        // data.initialized: don't float when IntersectionObserver runs the callback immediately on page load.
        if (data.initialized && data.shouldFloat && window.jwplayer) {
          const jwplayer = window.jwplayer
          const player = jwplayer(e.target)
          const belowScreen = e.boundingClientRect.top >= 0;
          player.setFloating(!belowScreen && !e.isIntersecting)
        }

        data.initialized = true;
      });
    },
    { threshold }
  );

  return floatObserver;
}

export default function setup(player: JwPlayer, {floating, autostart}: VideoInterface, isMobile: boolean) : PlayerFeature {
  if (!isMobile|| (floating && (!floating.mode || floating.mode === 'never'))) {
      return {
          preConfig: () => {
              return {}
          },
          onReady: () => {}
      };
    }
  
    // Disable built-in floating timing.
    const preConfig = () => {
      return {
          floating: {
              dismissible: true,
              mode: 'never',
          },
      }
    }
    
    const onReady = () => {
      const container = player.getContainer();
      floaters.set(container, {
          shouldFloat: autostart === 'viewable',
          initialized: false,
      });

      getObserver().observe(container);
    };

    return {
      preConfig,
      onReady
    }
}