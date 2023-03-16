import { VideoMetaData } from "../../types/video";

interface MetaDataProps extends VideoMetaData {}

function MetaData(props: MetaDataProps) {
    const {
        title,
        description,
        uploadDate,
        duration,
        thumbnailUrl,
        contentUrl
    } = props;

    return (
        <>
            {title && <meta itemProp="name" content={title}/>}
            {description && <meta itemProp="description" content={description}/>}
            {uploadDate && <meta itemProp="uploadDate" content={uploadDate}/>}
            {duration && <meta itemProp="duration" content={duration} />}
            {thumbnailUrl &&  <meta itemProp="thumbnailUrl" content={thumbnailUrl} />}
            {contentUrl &&  <meta itemProp="contentUrl" content={contentUrl}/>}
        </>
    )
}

export default MetaData