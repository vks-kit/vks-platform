export interface GuardHit { rule: "direct-import" | "deep-import" | "raw-colour"; where: string; text: string; fix: string }
export function walk(dir: string, out?: string[]): string[]
export function scan(dir: string, opts?: { allow?: string[] }): GuardHit[]
