import { describe, it, expect } from "vitest"
import { moveCard, dropCard, type KanbanCard } from "../src/heavy/kanban"
const cards: KanbanCard[] = [{ id: "a", column: "todo", title: "A" }, { id: "b", column: "todo", title: "B" }, { id: "c", column: "doing", title: "C" }]
describe("moveCard", () => {
  it("moves to another column, end of that column", () => { const r = moveCard(cards, "a", "doing"); expect(r.find((c) => c.id === "a")!.column).toBe("doing"); expect(r.map((c) => c.id)).toEqual(["b", "c", "a"]) })
  it("drops before a given card", () => { expect(moveCard(cards, "a", "doing", "c").map((c) => c.id)).toEqual(["b", "a", "c"]) })
  it("into an empty column", () => { expect(moveCard(cards, "b", "done").find((c) => c.id === "b")!.column).toBe("done") })
  it("unknown id changes nothing", () => expect(moveCard(cards, "zzz", "done")).toBe(cards))
  it("does not mutate the input", () => { moveCard(cards, "a", "doing"); expect(cards[0].column).toBe("todo") })
})
const cols = ["todo", "doing", "done"]
describe("dropCard", () => {
  it("reorders inside a column", () => { expect(dropCard(cards, "b", "a", cols)!.cards.map((c) => c.id)).toEqual(["b", "a", "c"]) })
  it("drops on an empty column id", () => { const r = dropCard(cards, "a", "done", cols)!; expect(r.to).toBe("done"); expect(r.cards.find((c) => c.id === "a")!.column).toBe("done") })
  it("drops on a card in another column", () => { const r = dropCard(cards, "a", "c", cols)!; expect(r.to).toBe("doing"); expect(r.cards.map((c) => c.id)).toEqual(["b", "a", "c"]) })
  it("drop on own column keeps the order", () => expect(dropCard(cards, "a", "todo", cols)!.cards).toBe(cards))
  it("unknown target returns null", () => expect(dropCard(cards, "a", "nope", cols)).toBeNull())
})
