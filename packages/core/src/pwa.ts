/** Service-worker, install prompt and push helpers. Browser only. */
export async function registerSW(url = "/sw.js", onUpdate?: () => void) {
  if (!("serviceWorker" in navigator)) return null
  const reg = await navigator.serviceWorker.register(url)
  reg.addEventListener("updatefound", () => {
    const w = reg.installing
    w?.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) onUpdate?.() })
  })
  return reg
}
type InstallEvt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
let deferred: InstallEvt | null = null
export function captureInstallPrompt(onReady?: () => void) {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e as InstallEvt; onReady?.() })
}
export const canInstall = () => deferred !== null
export async function promptInstall() { if (!deferred) return "unavailable"; await deferred.prompt(); const r = await deferred.userChoice; deferred = null; return r.outcome }

const b64 = (s: string) => { const p = "=".repeat((4 - (s.length % 4)) % 4), r = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(r, (c) => c.charCodeAt(0)) }
/** Ask permission and return the subscription JSON to POST to the API. vapidPublicKey comes from the Worker. */
export async function subscribePush(vapidPublicKey: string) {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return null
  if ((await Notification.requestPermission()) !== "granted") return null
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(vapidPublicKey) as BufferSource })
  return sub.toJSON()
}
