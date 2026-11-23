import * as React from "react"
import { SortableList } from "@vks-kit/ui/kanban"

const PTS = [{ id: "a", name: "ປະຕູໜ້າ", code: "CP-01" }, { id: "b", name: "ບ່ອນຈອດລົດ B1", code: "CP-02" }, { id: "c", name: "ຄັງສິນຄ້າ B", code: "CP-03" }, { id: "d", name: "ຫຼັງຄາ / ຖັງນ້ຳ", code: "CP-04" }]
export function SortDemo() {
  const [pts, setPts] = React.useState(PTS)
  return (
    <div className="w-full max-w-sm">
      <SortableList items={pts} getId={(p) => p.id} onChange={setPts}
        render={(p, i) => <><b className="tabular-nums">{i + 1}. {p.name}</b><div className="text-xs text-muted-foreground">{p.code}</div></>} />
    </div>
  )
}
