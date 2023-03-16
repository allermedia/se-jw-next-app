import { slugify } from 'lib/utils'

export default function getVideoSiteLink(videoID: string, title: string) {
  const brand = process.env.OCELOT_SITE || ''

  const slug = slugify(title)
  const VIDEO_PAGE_SUPPORTED_BRANDS = ['allas', 'hant', 'elle', 'femina', 'svenskdam', 'mabra', 'residence']
  if (!VIDEO_PAGE_SUPPORTED_BRANDS.includes(brand)) {
    return ''
  }

  const domain = brand === 'residence' ? 'residencemagazine' : brand
  const topDomain = brand === 'mabra' ? 'com' : 'se'

  return `https://www.${domain}.${topDomain}/video/${slug}/${videoID}`
}
