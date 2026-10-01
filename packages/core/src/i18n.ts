/**
 * Bilingual text, same call shape as the old apps: t("Save", "ບັນທຶກ").
 * Lao is the default. Change with setLang("en"). Subscribe to re-render.
 */
export type Lang = "lo" | "en"
let lang: Lang = "lo"
const subs = new Set<() => void>()
export const getLang = () => lang
export function setLang(l: Lang) { if (l === lang) return; lang = l; try { localStorage.setItem("vks-lang", l) } catch {} subs.forEach((f) => f()) }
export function initLang() { try { const s = localStorage.getItem("vks-lang"); if (s === "en" || s === "lo") lang = s } catch {} }
export const subscribeLang = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }
export const t = (en: string, lo: string) => (lang === "lo" ? lo || en : en)
