export declare const SIZES: { name: string; width: number; height: number; mobile: boolean }[]
export declare const MIN_TAP: number
export type Measure = {
  wide: string[]; small: string[]; stuck: string[]; docW: number; vw: number
  /** 0.6.2 layout rules (optional so older measurements still report). */
  offCentre?: string[]; wrapped?: string[]; unnamed?: string[]; topbar?: string[]
}
export declare function measure(o: { minTap: number; width?: number; height?: number }): Measure
export declare function report(size: { name: string; width: number; height: number; mobile: boolean }, page: string, m: Measure, errors?: string[]): string[]
