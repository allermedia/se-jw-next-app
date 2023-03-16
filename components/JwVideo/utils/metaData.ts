import { stripHtml } from "./stripHtml";
import { JW_USER_ID } from "../constants";
import { VideoMetaData } from "../types/video";

function formatISODuration(seconds: number) {
    // TODO this could probably have been done better.
    const o = new Date(0);
    const p = new Date(seconds * 1000);
    const time = new Date(p.getTime() - o.getTime());
    const ms = time.getMilliseconds();
    const secondRounding = Math.round(ms / 1000)
    const s = time.getSeconds() + secondRounding;
    const m = time.getMinutes();
    const sec = s > 0 ? `${s}S` : '';
    const min = m > 0 ? `${m}M` : '';

    return `PT${min}${sec}`;
}

interface MetaFieldsArguments {
    duration: number
    title: string,
    description?: string,
    publishedAt: string,
    mediaID: string,
    thumbnail: string
}

export default function formatMetaFields({duration, title, description, publishedAt, mediaID, thumbnail}: MetaFieldsArguments ): VideoMetaData {
    return {
        duration: duration ? formatISODuration(duration) : '',
        title: stripHtml(title),
        description: stripHtml(description),
        uploadDate: publishedAt || '',
        contentUrl: mediaID ? `https://content.jwplatform.com/videos/${mediaID}-${JW_USER_ID}.mp4` : '',
        thumbnailUrl: thumbnail,
    }
}