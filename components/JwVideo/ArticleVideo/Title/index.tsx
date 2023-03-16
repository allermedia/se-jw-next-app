
import React from 'react'
import Image from 'next/image'
import tvLogo from 'public/tv-logo-2.svg'
import Link from 'next/link'



function getVideoLinkLogo(showLink: boolean, ctsLabel: string, mediaId: string) {
  const logoImage = <Image src={tvLogo} alt="" className={`m-0`}></Image>

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
  return <span className={`flex justify-end logo__wrapper_theme`}>{logoImage}</span>
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
    <figcaption className={`relative z-[1] flex justify-between items-start mt-3.5 mb-3`} itemProp="headline">
      <span className={`grow-0 shrink-0 basis-9/12 non-italic pr-1 md:pr-0 title__text_theme`}>{title}</span>
      {logo}
    </figcaption>
  )
}

export default Title
