const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
export const CDN = (src: string | undefined): string | undefined => {
  if (src) {
    if (src.includes('http')) {
      return src;
    }
    return CDN_URL || 'http://d26p4pe0nfrg62.cloudfront.net/' + src;
  }
  return src;
}
