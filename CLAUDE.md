# CLAUDE.md

Read **AGENTS.md** in this folder first — it is the rulebook for this repo (house rules, how to search the UI catalogue, the step-by-step for adding a new UI feature, and the check commands).

Short version:
- Search `llms.txt` → `docs/ai/<slug>.md` before building UI. Reuse, then extend, then add.
- New part = packages/ui (+ house-form doc comment) + gallery demo + docs entry + `npm run ai:index`.
- Done = `npm test`, `npm run typecheck`, `npm run build`, `npm run build:docs` all green.
