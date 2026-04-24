# CLAUDE.md — NextFlow Project Rules

## Source of Truth

**`docs/assignment.md` is the single source of truth.** All features, decisions, and priorities must trace back to it.

Secondary authority: `docs/galaxy-standards.md` (Galaxy.ai coding standards).

## Before Answering or Coding

1. **Read the assignment document** (`docs/assignment.md`).
2. **Compare with current implementation** — do not assume.
3. **Never invent requirements outside the document.**
4. **Always give phase-wise progress + explicit missing tasks.**

## Non-Negotiable Requirements (from assignment)

- **ALL node execution MUST use Trigger.dev tasks** (LLM, Crop, Extract Frame).
- **Exactly 6 node types in the sidebar** under Quick Access: Text, Upload Image, Upload Video, LLM, Crop Image, Extract Frame.
- **File uploads MUST go through Transloadit.**
- **LLM results display on the LLM node itself** — do NOT create a separate output node for LLM results.
- **Pulsating glow** on executing nodes.
- **Pre-built sample workflow** (Product Marketing Kit Generator) must be selectable.
- **Parallel execution** — independent branches run concurrently.
- **Node-level history expansion** when clicking a run entry.
- **TypeScript strict mode** everywhere.
- **Zod validation** on all API routes.

## Style / Tech

- TailwindCSS for styling.
- ShadCN for components where available.
- Zustand for state.
- Prisma + PostgreSQL (Neon).
- Next.js App Router.
- Clerk for auth — all workflow routes protected, data scoped to userId.

## Response Format for Progress Questions

When asked about status, always return:

1. **Phase-wise breakdown** with status: ✅ Done / 🟡 Partial / ❌ Missing / ⚠️ Deviation
2. **Deliverables checklist** matched against `docs/assignment.md`.
3. **Deviations from spec** called out explicitly (e.g., extra nodes not in spec, missing Trigger.dev integration, etc.).
4. **Exact implementation steps** for pending work.

## Do Not

- Add features, nodes, or abstractions beyond what the assignment requires.
- Assume a requirement exists because it "makes sense" — verify in the doc.
- Skip Trigger.dev for a node execution — spec says it's mandatory.
- Create an Output node for LLM results — spec forbids it.
