import type { ContextBridgeApi } from '../electron/preload'
import type { ContextBridgeImageApi } from '../electron/preload-image'

declare global {
  interface Window {
    electronAPI: ContextBridgeApi;
    imageAPI: ContextBridgeImageApi;
  }
}