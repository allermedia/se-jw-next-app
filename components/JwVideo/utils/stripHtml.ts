export const stripHtml = (s: string | undefined): string => (s ? s.replace(/<\/?[^>]+(>|$)/g, '') : '')
