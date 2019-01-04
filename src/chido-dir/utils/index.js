export { default as buildSyncRouter } from './buildSyncRouter'
export { default as jsMatch } from './jsMatch'

export const isDev = process.env.NODE_ENV === 'development'
export const isServer = typeof window === 'undefined'
export const cssMatch = string => string.match(/\.css$/)
