import { describe, it, expect } from "vitest"
import { OfflineQueue, memoryStorage, fitSize } from "../src"

describe("OfflineQueue", () => {
  it("does not queue the same scan twice", async () => {
    const q = new OfflineQueue<string>(memoryStorage(), async () => "ok")
    await q.enqueue("a1", "x"); await q.enqueue("a1", "x")
    expect(await q.size()).toBe(1)
  })
  it("sends everything when online, oldest first", async () => {
    const order: string[] = []
    const q = new OfflineQueue<string>(memoryStorage(), async (i) => { order.push(i.clientId); return "ok" })
    await q.enqueue("a", "1"); await q.enqueue("b", "2"); await q.enqueue("c", "3")
    expect(await q.flush()).toEqual({ sent: 3, dropped: 0, left: 0 })
    expect(order).toEqual(["a", "b", "c"])
  })
  it("keeps items when offline and stops at the first failure", async () => {
    let calls = 0
    const q = new OfflineQueue<string>(memoryStorage(), async () => { calls++; throw new Error("offline") })
    await q.enqueue("a", "1"); await q.enqueue("b", "2")
    expect(await q.flush()).toEqual({ sent: 0, dropped: 0, left: 2 })
    expect(calls).toBe(1)
  })
  it("treats a server 'duplicate' as done", async () => {
    const q = new OfflineQueue<string>(memoryStorage(), async () => "duplicate")
    await q.enqueue("a", "1")
    expect((await q.flush()).sent).toBe(1)
  })
  it("drops a rejected item so it cannot block the queue", async () => {
    const q = new OfflineQueue<string>(memoryStorage(), async (i) => (i.clientId === "bad" ? "reject" : "ok"))
    await q.enqueue("bad", "x"); await q.enqueue("good", "y")
    expect(await q.flush()).toEqual({ sent: 1, dropped: 1, left: 0 })
  })
  it("gives up after maxTries", async () => {
    const q = new OfflineQueue<string>(memoryStorage(), async () => "retry", 2)
    await q.enqueue("a", "1")
    await q.flush()
    expect(await q.flush()).toEqual({ sent: 0, dropped: 1, left: 0 })
  })
})
describe("fitSize", () => {
  it("shrinks a 4000x3000 photo to 1280 wide", () => expect(fitSize(4000, 3000)).toEqual({ width: 1280, height: 960 }))
  it("never enlarges a small photo", () => expect(fitSize(800, 600)).toEqual({ width: 800, height: 600 }))
})
