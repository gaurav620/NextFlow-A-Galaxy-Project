# NextFlow Workflow Parity Plan (Krea Nodes Inspired)

## Goal
Build a production-grade NextFlow Node Editor experience inspired by Krea Nodes, while keeping NextFlow branding, naming, and product identity.

Important guardrail:
- Do not copy Krea trademark assets, logo, or proprietary media/text.
- Keep "inspired by" UX patterns, but implement with your own brand language and assets.

## Current State (Code Audit Summary)

### What already exists
- Node editor route and canvas: `app/dashboard/workflows/[id]/page.tsx`, `components/workflow-canvas.tsx`.
- Custom nodes implemented: text, image upload, video upload, LLM, crop, extract frame, image generation.
- Persistence and run history:
  - Workflow CRUD: `app/api/workflow/route.ts`, `app/api/workflow/[id]/route.ts`
  - Run history: `app/api/workflow/[id]/runs/route.ts`
  - Server runner: `app/api/workflow/[id]/run/route.ts`
  - History sidebar: `components/history-sidebar.tsx`
- DAG execution utilities: `lib/dag.ts`, `lib/workflowExecutor.ts`
- Prisma schema for workflows/runs: `prisma/schema.prisma`

### Main gaps blocking "real" parity
- `Projects` uses DB data, but `Apps`, `Examples`, `Templates` are mock arrays in `app/dashboard/workflows/page.tsx`.
- Execution logic is duplicated in client and server (`lib/workflowExecutor.ts` and `app/api/workflow/[id]/run/route.ts`), increasing drift risk.
- Node connection state (for linked inputs) is partially inferred and not fully reactive in some nodes.
- Some editor toolbar actions are UI-only (group/link/cut behavior not fully implemented).
- Branding is mixed (`krea-*` component names and legacy text references across project).
- Authz checks are weak in some write routes (workflow update/delete should enforce owner checks in query conditions).

## Environment Checklist (.env.local)

Detected env usage:
- `DATABASE_URL`
- `DIRECT_URL`
- `GEMINI_API_KEY`
- `TRIGGER_SECRET_KEY`
- `TRANSLOADIT_AUTH_KEY`
- `TRANSLOADIT_AUTH_SECRET`
- `TRANSLOADIT_IMAGE_TEMPLATE_ID`
- `TRANSLOADIT_VIDEO_TEMPLATE_ID`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXTFLOW_KEY` (legacy naming still referenced)

Also required by Clerk setup:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- Any Clerk redirect URL vars used in your dashboard/auth deployment setup

## Phase-by-Phase Plan

## Phase 0: Stabilize Baseline (1 day)
Objective:
- Freeze current behavior and create a clean baseline for safe iteration.

Tasks:
- Confirm local run: install, migrate, seed, and run app.
- Recreate and keep ` .env.example ` in repo with all required keys and comments.
- Add one command script for local verification (`lint`, `build`, optional smoke checks).

Deliverables:
- Verified local environment setup.
- Baseline build passes.

Acceptance criteria:
- `npm run build` succeeds.
- Workflow editor opens and can create/save workflow.

## Phase 1: Branding and Naming Cleanup (1-2 days)
Objective:
- Make app identity consistently NextFlow and remove mixed naming.

Tasks:
- Replace visible Krea references in user-facing text.
- Rename legacy `krea-*` component file names to neutral/NextFlow names (safe refactor pass).
- Normalize model labels and IDs where product copy is inconsistent.

Primary file groups:
- `components/krea-navbar.tsx`, `components/krea-footer.tsx`, `components/krea-hero.tsx`, `components/krea-pricing.tsx`
- `app/layout.tsx`, `app/page.tsx`, `app/dashboard/layout.tsx`
- `app/dashboard/workflows/page.tsx`

Deliverables:
- Consistent NextFlow naming in UI and code.

Acceptance criteria:
- Global search for "Krea" in user-facing text returns only approved references (if any).

## Phase 2: Workflow Data and API Hardening (2 days)
Objective:
- Make workflow persistence and execution APIs secure and reliable.

Tasks:
- Enforce ownership checks on update/delete routes:
  - `app/api/workflow/[id]/route.ts`
  - `app/api/workflow/[id]/runs/route.ts`
- Add strict validation schemas (zod) for workflow payloads:
  - `app/api/workflow/route.ts`
  - `app/api/workflow/import/route.ts`
- Ensure run status updates validate `runId` ownership.
- Add server-side cycle validation before execution.

Deliverables:
- Hardened API contracts and authz.

Acceptance criteria:
- Unauthorized user cannot mutate another user workflow/run.
- Invalid graph payload returns 4xx with meaningful error.

## Phase 3: Node Editor Behavior Parity (3-4 days)
Objective:
- Upgrade workflow editor interactions to feel close to Krea-style node workflow quality.

Tasks:
- Implement real behaviors for toolbar actions currently UI-only:
  - selection/group/cut/link interaction state
- Make handle connection indicators fully reactive to edge changes in node components.
- Improve connection validation rules and consistent handle ID usage.
- Add robust multi-file drag/drop behavior and avoid stale state updates.
- Improve autosave strategy to avoid noisy writes and race conditions.

Primary file groups:
- `components/workflow-canvas.tsx`
- `components/nodes/*.tsx`
- `store/workflowStore.ts`

Deliverables:
- Reliable canvas interactions with predictable editing behavior.

Acceptance criteria:
- Users can create/edit larger graphs without broken links or desynced node inputs.
- Undo/redo, selection, and run interactions are consistent.

## Phase 4: Replace Mock Ecosystem Tabs with Real Content (2-3 days)
Objective:
- Convert Apps/Examples/Templates from static mocks to real data sources.

Tasks:
- Add template source model or static JSON registry with API endpoint.
- Build real create-from-template flow and analytics fields (uses, complexity, tags).
- Add "featured templates" and search/filter behavior.

Primary targets:
- `app/dashboard/workflows/page.tsx`
- new API route: `app/api/workflow/templates/route.ts` (recommended)
- optional seed data in `prisma/seed.ts`

Deliverables:
- Production-like template/app/example ecosystem.

Acceptance criteria:
- No hardcoded mock arrays in workflow landing page.

## Phase 5: Unify Execution Engine (2 days)
Objective:
- Remove duplicated orchestration logic and use one canonical execution path.

Tasks:
- Make server runner the source of truth for full and partial runs.
- Keep client runner only for UI preview/testing or remove it entirely.
- Standardize node input/output contract across all node types.
- Add retry and structured node error metadata.

Primary targets:
- `lib/workflowExecutor.ts`
- `app/api/workflow/[id]/run/route.ts`
- `app/api/execute/*/route.ts`

Deliverables:
- Single reliable execution pathway.

Acceptance criteria:
- Same graph produces same outputs whether launched from Run All or Run Selected.

## Phase 6: Quality Gates, Perf, and Accessibility (2 days)
Objective:
- Make editor stable for real usage and deployment.

Tasks:
- Add integration tests for API routes and graph execution.
- Add e2e smoke flow (create workflow -> run -> inspect history).
- Optimize heavy UI paths (memoization, minimized rerenders).
- Keyboard navigation and aria labels for critical controls.

Deliverables:
- CI-ready quality gate and measurable stability.

Acceptance criteria:
- Build + tests pass in CI.
- Editor remains responsive with medium-size node graphs.

## Phase 7: Deploy, Verify, Push to Main (1 day)
Objective:
- Ship safely with rollback confidence.

Tasks:
- Stage branch-based rollout:
  - `feat/workflow-phase-1-branding`
  - `feat/workflow-phase-2-api-hardening`
  - ...
- Run pre-push checks:
  - lint/build/tests
  - smoke on Vercel preview
- Merge to `main` after validation.

Recommended command flow:
1. `npm install`
2. `npm run lint`
3. `npm run build`
4. `git checkout -b feat/workflow-phase-x`
5. `git add -A && git commit -m "phase-x: ..."`
6. `git push -u origin feat/workflow-phase-x`
7. Open PR and merge to `main`

## Suggested Execution Order (Practical)
1. Phase 0
2. Phase 2 (security + API safety first)
3. Phase 3 (editor behavior)
4. Phase 4 (replace mock tabs)
5. Phase 5 (execution unification)
6. Phase 1 (remaining naming cleanup if not done early)
7. Phase 6
8. Phase 7

## High Priority Fixes (Do First)
- Enforce ownership checks in write routes.
- Remove/replace mock data in workflow tabs.
- Resolve node input-connection reactivity and stale state updates.
- Establish single source of truth for execution orchestration.

## Definition of Done (Workflow Parity)
- Node Editor landing page tabs are real (not mocked).
- Workflow creation/editing/running/history are reliable under auth.
- Canvas behavior is consistent for power users (keyboard + mouse).
- Branding and naming are fully NextFlow.
- Deployment to Vercel works with documented env setup.
- Changes merged to `main` with passing checks.
