import type { electronApiInterface } from '../electron/preload'
import type { ContextBridgeImageApi } from '../electron/preload-image'

declare global {
  interface Window {
    electronAPI: electronApiInterface;
    imageAPI: ContextBridgeImageApi;
  }
}

declare global{
  interface EventTarget{
    tagName:string
  }
}