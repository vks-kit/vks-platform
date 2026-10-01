import { LO } from "./lo"
import { LO_G } from "./lo-guides"

/** Docs chrome that is not in the content dictionary (group names, section headings, table headers). */
export const CHROME: Record<string, string> = {
  "Getting Started": "ເລີ່ມຕົ້ນ", "Foundations": "ພື້ນຖານ", "Actions": "ການກະທຳ", "Form": "ແບບຟອມ", "Dates": "ວັນທີ", "Feedback": "ການແຈ້ງຜົນ",
  "Overlays": "ຊັ້ນຊ້ອນ", "Data display": "ສະແດງຂໍ້ມູນ", "Layout & navigation": "ໂຄງຮ່າງ ແລະ ການນຳທາງ", "Mobile & touch": "ມືຖື ແລະ ການສຳຜັດ", "Heavy (lazy)": "ອົງປະກອບໜັກ (ໂຫຼດເມື່ອໃຊ້)",
  "New": "ໃໝ່", "Mobile": "ມືຖື", "Lazy": "ໂຫຼດຊ້າ", "Stable": "ໝັ້ນຄົງ",
  "Docs": "ເອກະສານ", "Components": "ອົງປະກອບ", "Installation": "ການຕິດຕັ້ງ", "Usage": "ການນຳໃຊ້", "Examples": "ຕົວຢ່າງ", "Notes": "ໝາຍເຫດ", "API reference": "ເອກະສານ API",
  "Prop": "Prop", "Type": "ປະເພດ", "Default": "ຄ່າເລີ່ມຕົ້ນ", "Description": "ຄຳອະທິບາຍ", "Command": "ຄຳສັ່ງ", "Manual": "ດ້ວຍມື",
  "Replay demo": "ຫຼິ້ນຄືນ", "Desktop": "ຄອມພິວເຕີ", "Phone": "ໂທລະສັບ", "Both": "ທັງສອງ", "Desktop only": "ສະເພາະຄອມພິວເຕີ", "Phone only": "ສະເພາະໂທລະສັບ",
  "Introduction": "ແນະນຳ", "Mobile rules": "ກົດສຳລັບມືຖື", "Layout rules": "ກົດການຈັດໜ້າ", "Desktop ↔ Mobile": "ຄອມພິວເຕີ ↔ ມືຖື", "Changelog": "ບັນທຶກການປ່ຽນແປງ",
  "Theming": "ຮູບແບບສີ", "Typography & Lao": "ຕົວອັກສອນ ແລະ ພາສາລາວ", "Motion": "ການເຄື່ອນໄຫວ", "Logo": "ໂລໂກ້", "Performance tiers": "ລະດັບປະສິດທິພາບ", "Hover effects": "ຜົນຕອນຊີ້ເມົ້າສ໌",
  "Loading…": "ກຳລັງໂຫຼດ…",
}
/** Translate a content/chrome string to Lao; unknown strings fall back to the English original. */
export const toLo = (s: string): string => LO[s] ?? LO_G[s] ?? CHROME[s] ?? s