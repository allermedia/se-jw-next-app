import logdown from 'logdown'
import debug from 'debug'

let log: any,
  path: string = ''
const isDebugEnabled = () => {
  const searchParams = new URLSearchParams(path)
  return process.env.NODE_ENV !== 'production' || !!searchParams.get('debug')
}

export function lazyLog(cb: any, type = 'info') {
  if (!cb || !isDebugEnabled()) return

  const msg = cb()
  if (log) {
    //@ts-ignore
    log[type](...(Array.isArray(msg) ? msg : [msg]))
  }
}

export function setupLogging(path: string) {
  path = path
  debug.enable(String(isDebugEnabled()))

  const getLogger = (name = 'video') => {
    const log = logdown(name, { prefixColor: `#EC0041` })
    log.state.isEnabled = isDebugEnabled()
    return log
  }
  log = getLogger()
}
