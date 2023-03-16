const AUTH_TOKEN = 'oSIo2-6drKbhYm1Hx7ckIWInTUdSVWNIRmpjVzUzVVVzNVZWaHphRUpuUTFGVVoyUlQn'

const getDefaultHeaders = (Authorization = AUTH_TOKEN) =>
  new Headers({
    Authorization,
    'Content-Type': 'application/x-www-form-urlencoded',
  })

const getData = async (url: string, headers: any) => {
  const defaults = {
    method: 'get',
    headers,
  }
  const res = await fetch(encodeURI(url), defaults)
  return res.json()
}

export default function fetchWithDefaults(url: string, params = getDefaultHeaders) {
  return getData(url, params())
}
