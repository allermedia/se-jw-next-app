
import React from 'react'
import Image from 'next/image'
import tvLogo from 'public/tv-logo-2.svg'
import Link from 'next/link'



function getVideoLinkLogo(showLink: boolean, ctsLabel: string, mediaId: string) {
  const logoImage = <Image src={tvLogo} alt="" className={`logo logo_theme`}></Image>

  if (showLink) {
    return (
      <Link href="/video/">
        <a
          className={`logo__wrapper logo__wrapper_theme cts-impression-item`}
          data-cts-label={ctsLabel}
          data-cts-name={ctsLabel}
          data-cts-id={mediaId}
          data-cts-creative={ctsLabel}
          aria-label="Gå till video"
        >
          {logoImage}
        </a>
      </Link>
    )
  }
  return <span className={`logo__wrapper logo__wrapper_theme`}>{logoImage}</span>
}

interface Props {
  title: string
  showLink: boolean
  ctsLabel: string
  mediaId: string
}

const Title: React.FC<Props> = ({ title, showLink, ctsLabel, mediaId }) => {
  const logo = getVideoLinkLogo(showLink, ctsLabel, mediaId)
  return (
    <figcaption className={`caption title`} itemProp="headline">
      <span className={`title__text title__text_theme`}>{title}</span>
      {logo}
    </figcaption>
  )
}

export default Title
