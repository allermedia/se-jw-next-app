/**
 * Adds tests setup for ads if ?dfp_id=dev-test is present in url
 * @param {*} tag  - Ads tag configured in JW - to be updated with test tag to see test ad.
 * @param {*} dfpIdVal - Test flag from url
 * @returns
 */
export function replaceTag(tag: string, dfpIdVal: string) {
  if (dfpIdVal) {
    return tag.replace('hant.se', dfpIdVal)
  }
}
