/**
 * Offline queue for guard scans on flaky networks.
 * Pure logic (storage + sender are injected) so it is unit-tested without a phone.
 * Each item carries a clientId: the server ignores repeats, so a retry can never double-count.
 */
export type QueueItem<T> = { clientId: string; payload: T; tries: number; queuedAt: number }
export type Storage = { get(): Promise<string | null>; set(v: string): Promise<void> }
export type Send<T> = (item: QueueItem<T>) => Promise<"ok" | "duplicate" | "retry" | "reject">

export class OfflineQueue<T> {
  constructor(private store: Storage, private send: Send<T>, private maxTries = 8, private now = () => Date.now()) {}

  private async read(): Promise<QueueItem<T>[]> {
    const raw = await this.store.get()
    if (!raw) return []
    try { return JSON.parse(raw) } catch { return [] }
  }
  private write(items: QueueItem<T>[]) { return this.store.set(JSON.stringify(items)) }

  async size() { return (await this.read()).length }

  async enqueue(clientId: string, payload: T) {
    const items = await this.read()
    if (items.some((i) => i.clientId === clientId)) return // already queued
    items.push({ clientId, payload, tries: 0, queuedAt: this.now() })
    await this.write(items)
  }

  /** Try to send everything, oldest first. Stops at the first network failure (still offline). */
  async flush(): Promise<{ sent: number; dropped: number; left: number }> {
    const items = await this.read()
    const keep: QueueItem<T>[] = []
    let sent = 0, dropped = 0, offline = false
    for (const it of items) {
      if (offline) { keep.push(it); continue }
      let r: Awaited<ReturnType<Send<T>>>
      try { r = await this.send(it) } catch { r = "retry" }
      if (r === "ok" || r === "duplicate") sent++
      else if (r === "reject") dropped++
      else {
        offline = true
        const next = { ...it, tries: it.tries + 1 }
        if (next.tries >= this.maxTries) dropped++
        else keep.push(next)
      }
    }
    await this.write(keep)
    return { sent, dropped, left: keep.length }
  }
}
export const memoryStorage = (): Storage => { let v: string | null = null; return { get: async () => v, set: async (x) => { v = x } } }
