# NextFlow — Galaxy.ai Assignment (Source of Truth)

> This document is the **single source of truth** for the NextFlow project.
> All decisions, features, and implementations must be traced back to this spec.
> Reference: Krea.ai (https://www.krea.ai/nodes)

---

## Project Overview

Build **NextFlow** — a pixel-perfect UI/UX clone of **Krea.ai** workflow builder, focused exclusively on **LLM (Large Language Model) workflows**.

**Must use:**
- **React Flow** for the visual workflow canvas
- **Google Gemini API** for LLM execution
- **Trigger.dev** for ALL node execution (non-negotiable)
- Type-safe APIs, proper state management, authentication, seamless UX

---

## Functional Requirements

### Core Workflow Interface (UI/UX)

| Requirement | Description |
|-------------|-------------|
| Pixel-Perfect UI | Match Krea's UI exactly — background, layout, spacing, fonts, node designs, animations, scrolling |
| Left Sidebar | Collapsible with search and quick access section for node types |
| Right Sidebar | **Workflow History Panel** — shows list of all workflow runs with timestamps |
| Workflow Canvas | React Flow with dot-grid background, smooth pan/zoom, MiniMap |
| Responsive Design | Full responsiveness with proper overflow handling |

### Node Types (exactly 6 buttons under Quick Access)

1. **Text Node** — textarea input, output handle for text data
2. **Upload Image Node** — file upload via **Transloadit**, accepts jpg/jpeg/png/webp/gif, preview, output handle for image URL
3. **Upload Video Node** — file upload via **Transloadit**, accepts mp4/mov/webm/m4v, player preview, output handle for video URL
4. **Run Any LLM Node** — model selector, accepts system_prompt + user_message + images inputs, executes via **Trigger.dev task**
5. **Crop Image Node** — image input, x/y/width/height percent params, executes **FFmpeg on Trigger.dev**
6. **Extract Frame from Video Node** — video URL + timestamp, extracts single frame, executes **FFmpeg on Trigger.dev**

### Authentication (Clerk)

- Clerk for all auth
- Sign In / Sign Up — Clerk-hosted or embedded
- All workflow routes protected
- Workflows + history scoped to authenticated user

### LLM Integration (Google Gemini via Trigger.dev)

- Provider: Google Generative AI (free tier via Google AI Studio)
- Execution: **ALL LLM calls MUST run as Trigger.dev tasks**
- Models: https://ai.google.dev/gemini-api/docs/models
- Vision support (multimodal)
- Optional system prompts
- Input chaining — aggregate text/image inputs from connected nodes

### LLM Node Specification

**Input Handles (3):**
- `system_prompt` — from Text Node (optional)
- `user_message` — from Text Node (required)
- `images` — from Image Node(s) (optional, multiple)

**Output Handle (1):** `output` — Text response from LLM

**Result Display:** Results must display **directly on the LLM node itself** — do NOT create a separate output node.

### Crop Image Node Specification (FFmpeg on Trigger.dev)

**Input Handles (5):**
- `image_url` (required, image types)
- `x_percent`, `y_percent`, `width_percent`, `height_percent` (optional, 0–100)

**Output Handle (1):** `output` — Cropped image URL (uploaded via Transloadit)

### Extract Frame from Video Node Specification (FFmpeg on Trigger.dev)

**Input Handles (2):**
- `video_url` (required, video types)
- `timestamp` (optional, seconds or "50%")

**Output Handle (1):** `output` — Extracted frame image URL

### Workflow History (Right Sidebar)

| Requirement | Description |
|-------------|-------------|
| Run Entry | timestamp, status (success/failed/partial), duration, scope (full/partial/single) |
| Click to Expand | Shows node-level execution details |
| Node-Level History | status, inputs, outputs, execution time per node |
| Partial Runs | Show nodes that ran successfully even if workflow failed |
| Visual Indicators | Color-coded badges (green=success, red=failed, yellow=running) |
| Persistence | All history persists to PostgreSQL |

### Workflow Features

- Drag & Drop Nodes from sidebar
- Animated purple edges for connections
- Configurable inputs (via handle OR manual entry; connected handle disables manual)
- Type-safe connections (image can't connect to prompt, text can't connect to file)
- DAG validation (no cycles)
- Node deletion (menu button or Delete/Backspace)
- Canvas navigation (pan, zoom, fit)
- MiniMap (bottom-right)
- Undo/Redo
- Selective execution (single/selected/full — each creates a history entry)
- **Parallel execution** — independent branches run concurrently
- Workflow save/load to PostgreSQL

### UX Enhancements

- Graceful error display
- Loading states (spinner, disabled button)
- **Pulsating glow effect** on nodes currently executing

---

## Technical Stack (Required)

| Technology | Purpose |
|-----------|---------|
| Next.js | React framework with App Router |
| TypeScript | Type safety (strict mode) |
| PostgreSQL | Database (use Neon) |
| Prisma | ORM |
| Clerk | Authentication |
| React Flow | Visual workflow / node graph |
| **Trigger.dev** | **ALL node execution** |
| Transloadit | File uploads + media processing |
| FFmpeg | Image/video processing (via Trigger.dev) |
| Tailwind CSS | Styling (match Krea theme) |
| Zustand | State management |
| Zod | Schema validation |
| @google/generative-ai | Gemini SDK |
| Lucide React | Icons |

### Trigger.dev Task Mapping

| Node | Trigger.dev Task |
|------|-----------------|
| LLM Node | Task that calls Gemini API |
| Crop Image | Task running FFmpeg crop |
| Extract Frame | Task running FFmpeg frame extraction |

**Parallel execution rule:** Independent nodes (no dependencies between them) MUST be triggered concurrently. Tasks only await direct upstream dependencies.

---

## Required Sample Workflow — Product Marketing Kit Generator

Must include a **pre-built sample workflow** demonstrating all 6 node types, parallel execution, and input chaining.

### Branch A: Image Processing + Product Description
1. Upload Image Node → product photo
2. Crop Image Node → center crop 80%
3. Text Node #1 (system): *"You are a professional marketing copywriter..."*
4. Text Node #2 (product details): *"Product: Wireless Bluetooth Headphones..."*
5. LLM Node #1 → system_prompt + user_message + images (cropped)

### Branch B: Video Frame Extraction
1. Upload Video Node
2. Extract Frame from Video Node → timestamp "50%"

### Convergence Point: LLM Node #2 (waits for BOTH branches)
- `system_prompt` ← Text Node #3
- `user_message` ← LLM #1 output
- `images` ← cropped image + extracted video frame
- **Outputs:** Final marketing tweet/post inline on node

### Execution Timeline

| Phase | Branch A | Branch B | Convergence |
|-------|----------|----------|-------------|
| 1 | Upload Image + Text Nodes | Upload Video | — |
| 2 | Crop Image | Extract Frame | — |
| 3 | LLM Node #1 | (complete) | — |
| 4 | (complete) | (complete) | LLM Node #2 |

---

## Deliverables Checklist

- [ ] Pixel-perfect Krea clone UI
- [ ] Clerk authentication with protected routes
- [ ] Left sidebar with **exactly 6 buttons** (Text, Upload Image, Upload Video, LLM, Crop Image, Extract Frame)
- [ ] Right sidebar with workflow history panel
- [ ] Node-level execution history on click
- [ ] React Flow canvas with dot-grid background
- [ ] Functional Text Node
- [ ] Functional Upload Image Node (Transloadit + preview)
- [ ] Functional Upload Video Node (Transloadit + player)
- [ ] Functional LLM Node (model selector, prompts, run)
- [ ] Functional Crop Image Node (FFmpeg via Trigger.dev)
- [ ] Functional Extract Frame Node (FFmpeg via Trigger.dev)
- [ ] **ALL node executions via Trigger.dev tasks**
- [ ] Pulsating glow on executing nodes
- [ ] Pre-built sample workflow
- [ ] Animated purple edges
- [ ] API routes with Zod validation
- [ ] Gemini integration with vision support
- [ ] TypeScript strict mode
- [ ] PostgreSQL + Prisma
- [ ] Workflow save/load
- [ ] History persistence
- [ ] Workflow export/import as JSON
- [ ] Deployed on Vercel with env vars

---

## Submission Requirements

1. **GitHub Repo** — private, access granted to bluerocketinfo@gmail.com
2. **Vercel Deployment** — live demo URL
3. **Demo Video** (3–5 min) covering:
   - Auth flow
   - Create workflow with all 6 node types
   - File uploads via Transloadit
   - Run full workflow (see pulsating glow)
   - Run single node + selected nodes
   - View history in right sidebar
   - Click run → node-level details
   - Export/import JSON

---

## Resources

- Krea.ai — https://www.krea.ai/nodes (reference)
- React Flow — https://reactflow.dev/docs/introduction/
- Trigger.dev — https://trigger.dev/docs
- Clerk — https://clerk.com/docs
- Transloadit — https://transloadit.com/docs/
- Prisma — https://www.prisma.io/docs
- Google AI Studio — https://makersuite.google.com/
- Gemini API — https://ai.google.dev/docs
- Zustand — https://docs.pmnd.rs/zustand/getting-started/introduction
- Zod — https://zod.dev/
- FFmpeg — https://ffmpeg.org/documentation.html

---

## Guardrails

- Do NOT copy Krea trademarks, logos, or proprietary assets
- "Inspired by" UX patterns only — use own brand language for assets
