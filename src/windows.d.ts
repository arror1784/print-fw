import type { ContextBridgeApi } from '../electron/preload'

declare global {
  interface Window {
    electronAPI: ContextBridgeApi
  }
}