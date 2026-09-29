# Germany Apartment Cooling Solver — Beta: V1 specification

Status: implementation specification; 2026-09-29. This is the single product specification for this increment.

## Existing project inspection

- Existing checkout: E:\Knowledge OS\Projects\Visual_Job_Solver. Origin: deguanggao8-gif/visual-job-solver, master baseline f54aef7. Working tree clean at inspection.
- Next.js 15.5 / React 19 / strict TypeScript, App Router. Plain CSS variables and shared Header/Footer, buttons, cards, breadcrumbs and callouts; light/dark themes.
- Static export (`output: export`, trailingSlash); deployment configuration remains unchanged. Build requires NEXT_PUBLIC_SITE_URL. Provider is not established by the repository; no provider change or production deployment in this task.
- Existing routes: home, about, contact, two drilling guides, drilling job and drilling selector. Frozen drilling evidence is checked by scripts/verify-frozen.mjs on build.
- Existing tests: Node test runner + tsx; lint: ESLint; typecheck: tsc. Dependencies already installed. No new runtime dependencies required.
- No analytics provider, API, database or uploaded-file storage. Contact uses contact@visualjobsolver.com with a mailto draft. Reuse that actual address and mechanism.

## Goal / scope

Job → Constraints → Options → Trade-offs → Solution. Add a second solver without deleting, refactoring or changing drilling logic, evidence, guides, routing or deployment configuration.

Germany only (country: DE retained). English mobile-first landing → eight-step conditional questionnaire → pure rules → results → setup review email-draft form. No brands, rankings, accounts, payments, AI/image recognition, price APIs, installer marketplace, CRM, country expansion, exact load calculation or new backend.

Route: /cooling/germany-apartment. Landing and all steps/results are states of one accessible client flow inside a metadata-bearing server page. Minimal homepage card, navigation link and sitemap entry; old links remain.

## Questionnaire contract

Answers are typed and configuration-driven. Single-select fields start unanswered (null), not preselected. Explicit unknown is a valid answer. Usage must contain at least one choice. Eight numbered main steps; conditional followups stay within their parent step.

1. housing: rent / own / unknown.
2. permanent_installation: yes / no / unknown. Rent alone never blocks fixed split.
3. window_type: tilt_turn / casement / sliding / balcony_door / fixed / unknown.
4. outdoor_space: yes / no / unknown. If yes, require outdoor_unit_possible: yes / no / unknown. Clear this dependent answer when outdoor_space changes away from yes. Canonical yes/no values resolve the original example's ambiguous `balcony` value; a balcony is one example of yes.
5. exterior_restrictions: none / restricted / unknown. `restricted` means some restrictions, NOT an outright ban. A narrow conditional followup exterior_prohibition: yes / no / unknown asks whether outdoor AC equipment is explicitly prohibited. Clear when restrictions change. This is needed to implement the supplied prohibition rule without inventing permission.
6. room_size_m2: under_15 / 15_25 / 25_40 / 40_60 / over_60 / unknown. Context only, never BTU or capacity calculation.
7. usage: sleep / work / daytime / heatwaves / summer (multi-select). Sleep adds indoor_noise_consideration; does not block any category.
8. budget_eur: under_300 / 300_700 / 700_1500 / 1500_plus / unknown. Affects practical_fit only.

Back/Next and edit answers retain state. Save only questionnaire state in versioned sessionStorage, with validation on restore; never persist email/notes or include them in analytics. Storage failure must not stop the flow. Reset explicitly clears saved answers. Reload restores progress or results. No forced animation or auto-advance on selection.

## Rule engine / evidence

Separate modules: types, questions, evidence metadata, engine, session persistence, review-draft generation and analytics. Every decision records applicable rule IDs. Metadata includes country, category, confidence, source_type, source_name, source_url, last_verified, and scope note. Sources fetched during this task: Verbraucherzentrale cooling installation guide and Midea PortaSplit installation page. A manufacturer example cannot establish compatibility for all portable split equipment. Unverified thresholds / product policies use confidence: needs_verification, source_url: null, last_verified: null; never fake sources.

Technical fit: suitable / possible / poor_fit / blocked / review. Practical fit: good / tradeoffs / budget_mismatch / unknown. Return three category cards plus a separate Needs Review outcome/banner when unresolved routes/conflicts exist; review is an action, not a fourth appliance.

Priority: explicit prohibition beats unknown; missing data requests review; budgets and housing never override technical feasibility.

- Fixed split: permanent no → blocked; explicit outdoor equipment ban → blocked; permanent unknown → possible + approval_required; permanent yes with no explicit ban → candidate, with installation/professional checks. Good physical answers and no known restrictions can mark suitable for investigation, never approval. Missing outdoor information does not establish impossibility.
- Portable split: explicit ban → blocked; outdoor yes + potential placement yes + no restrictions + an opening window → suitable candidate with placement/connection checks. Unknown/restricted permissions → possible + approval_check. Outdoor no/unknown → review, not impossible. Outdoor yes + placement no → poor_fit for the stated location, alternative placement requires review. Fixed/unknown window → review of connecting-line route even when a balcony exists.
- Monoblock: tilt_turn/casement/sliding/balcony_door → exhaust_path possible + required sealing check → technical possible. Fixed/unknown window → exhaust_path unknown + photo review → review. Pure derivation supports yes/no/unknown/possible; no current questionnaire response proves an exhaust path yes or no. If a future confirmed path is no, block; do not infer it from a fixed window. Sleep adds compressor-noise tradeoff.
- Conflict: permanent no + outdoor no + fixed window (and any equivalent lack of a confirmed standard route) yields “Your setup has important constraints” and no winner/recommendation. State each contributing constraint and route to setup review.
- Budget screening is indicative, not a price estimate: under_300 flags budget_mismatch across categories; fixed split also flags 300_700. Explain need for complete equipment/installation/accessory quote. These thresholds are product assumptions, needs_verification. Larger budgets never guarantee affordability. Unknown budget → practical unknown. Other known budgets → tradeoffs, or good for a suitable candidate with no usage/size flags.
- Unknown/large room size triggers capacity/professional review reminders, never numeric output or automatic blocking. No automatic legal, structural, mounting, electrical, price or design approval.

## Results and content

Landing title: “What cooling solution will actually work in your German apartment?”
Subtitle: “Check your installation options before buying an AC. Takes about 2 minutes.”
CTA: Start My Check. No brand promotion. No purchase required.

Results: “Your Cooling Options”; all three categories visible, no ranking/winner. Each shows technical status and separate practical assessment, 2–4 answer-specific reasons, checks, tradeoffs. Labels: Good fit / Possible with checks / Possible with trade-offs / Not currently practical / Needs more information. Even good fit is explicitly a category to investigate, not installation approval.

Setup Review: “Still unsure whether it will work?” / “Show us the actual room.” Check My Setup / Show us your setup scroll to the review form. Form asks reply email and notes; prepares a local draft including readable answers. User opens their email app and attaches photos there. Visible copyable draft is a fallback. No upload control, no backend, no false sent/received confirmation; do not claim mailbox delivery or service response time was tested.

## Analytics

Unified local CustomEvent hook `vjs:analytics`, no network transport/provider. Known events: solver_started, question_reached, solver_completed, result_fixed_split, result_portable_split, result_monoblock, constraint_conflict, setup_review_clicked, lead_submitted. Emit safe step/category/status metadata only, no email, notes, photos, full answers or identifiers. Reserve lead_submitted for an eventual confirmed receiving endpoint; static mailto cannot truthfully emit it. Use lead_draft_prepared / lead_email_opened for this V1. Integration errors must not interrupt the user.

## Acceptance / validation

- Eight-step mobile flow, conditional validation, backwards navigation, edit/recompute, reload and reset, keyboard focus, 320px+ layout and dark mode.
- Scenario tests for supplied example, rent+permission yes, unknown permission, restricted vs prohibited, no balcony, fixed window, sleep, budgets, conflict and malformed saved state.
- Invariant sweeps: budget/housing/usage do not change technical fit; unknown is not blocked by itself; every applied rule has metadata.
- Run existing and new node tests, frozen verification, lint, typecheck and production static build with NEXT_PUBLIC_SITE_URL=https://visualjobsolver.com.
- Exercise browser desktop/mobile flows and mailto generation without sending email. Check original drilling route and guide routes and frozen files.
- Record measured automated flow time only as test timing, not a proven human two-minute usability claim.
- No production publishing, no next-phase work. Final report covers stack/path, changed files, behavior, validation, preserved drilling content, actual limitations and at most three next steps.

## Future Improvements (not implemented)

Confirmed lead endpoint and delivery monitoring; photo storage/consent flow; real analytics provider; user-tested completion timing; professional rule review; broader country/model-specific evidence. None are prerequisites added to this MVP.
