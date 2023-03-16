
/**
 * Use these tracking labels for defining which event you need to only track the actions.
 */
export const TRACKING_LABELS = {
    
}
  
export const CTS_ACTIONS = {
    click: 'click',
    hover: 'hover',
    scroll: 'scroll',
    passive: 'passive',
};

export function sendCTSEvent(action: 'click' | 'hover' | 'scroll' | 'passive' , label: string) {
    const sendEvent = window.cts?.send?.event;
    if (typeof sendEvent !== 'function') {
        console.warn('CTS is not loaded, unable to send CLICK tracking event: ', { action, label });
        return;
    }

    sendEvent(
        'action',
        action,
        label
    );
}