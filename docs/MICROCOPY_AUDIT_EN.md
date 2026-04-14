# Microcopy audit – English UI/UX

**Scope:** English version (`en/index.html`, `en/privacy.html`, root `index.html`, dynamic JS strings)  
**Date:** 2026-03-06  
**Focus:** Clarity, consistency, tone, actionability, accessibility (aria-labels), errors, CTAs.

---

## 1. Inventory of user-facing copy

### 1.1 Page titles & meta

| Location | Current copy | Note |
|----------|--------------|------|
| `en/index.html` `<title>` | Let AI do 30–50% of your daily tasks – Prompt Anatomy | Strong value prop; long for tab. |
| `en/privacy.html` `<title>` | Privacy policy – Prompt Anatomy | Clear; brand aligned. |
| Root `index.html` `<title>` | Redirect – Prompt Anatomy | OK for redirect; brand aligned. |

### 1.2 Skip link & navigation

| Location | Current copy |
|----------|--------------|
| Skip link | Skip to content |
| Lang switcher (visible) | English / Lietuvių |
| Badge (link) | Prompt Anatomy |
| Badge (status) | Spin-off No. 1 |

### 1.3 Hero

| Element | Current copy |
|---------|--------------|
| H1 | Let AI do 30–50% of your daily tasks |
| Subline | 8 exercises with ready-made templates – results in minutes. |
| Meta (who it’s for) | Who it's for: Managers, specialists, consultants, freelancers. (LT: „Kam skirta: …“.) |
| CTA primary | Start for free |
| CTA secondary | Join the community |

### 1.4 Objectives section

| Element | Current copy |
|---------|--------------|
| H2 | What you get |
| Intro | In 30 minutes you’ll have a basic AI workflow: |
| Bullets | 3–5 hours saved per week; Up to 6× lower error risk; 8 standardized templates; Clear automation logic instead of chaotic prompts |

### 1.5 Instructions

| Element | Current copy |
|---------|--------------|
| H2 | How to use this library |
| Time hint | ~3–5 min per step |
| Steps 1–4 | (see full text in HTML) |

### 1.6 Progress

| Element | Current copy |
|---------|--------------|
| Default | You've used 0 of 8 prompts |
| Complete | Great – you've used all 8. |
| Dynamic | You've used X of 8 prompts. |

### 1.7 Code block (CSS ::before)

| Element | Current copy |
|---------|--------------|
| Tooltip (hover/focus) | Select and copy (`:root { --codeblock-copy-hint }`, žr. `en/index.html`) |

### 1.8 Prompt cards (repeated pattern)

- **Categories:** Foundation, Analysis, Role, Document, Processes, AI Integration, Library, Simulation.
- **Titles:** e.g. AI Context Check, Organization Portrait, My Role in the Organization, etc.
- **Descriptions:** One line per prompt.
- **“Before using”:** Use when / Replace before using / What to do.
- **Info box titles:** Why it matters, Application, Result, Practical value, Optimization, Real impact, Daily improvement, Readiness.
- **Button:** Copy prompt
- **Checkbox label:** Mark as done

### 1.9 Next steps

| Element | Current copy |
|---------|--------------|
| H2 | What’s next? |
| Intro | Best to go in order from 1 to 8. Click a link to jump to that prompt. |
| Links | 1. Context check, 2. Organization portrait, … 8. Critical situation simulation |

### 1.10 Community & footer

| Element | Current copy |
|---------|--------------|
| Community H2 | Want more? Join the WhatsApp group. |
| Subline | Shared discussions, tips and news about prompts and AI. |
| Primary CTA | Join WhatsApp group |
| Secondary CTA | Prompt Anatomy → |
| Footer H3 | Good luck with your prompts |
| Footer reminder | If the prompt has [COMPANY] or [MY ROLE] – replace with your details. The AI role (e.g. “critical analyst”) is already set – no need to change it. |
| Product link | This is **Spin-off No. 1** from “Prompt Anatomy”. Full interactive course and more: canonical link [promptanatomy.app/en](https://www.promptanatomy.app/en) |
| Tags | AI-optimized, 8 prompts, Quick start, Results |
| Copyright | © 2026 Tomas Staniulis. Training material. All rights reserved. Privacy |

### 1.11 Toast & dynamic (JS)

| Context | Current copy |
|---------|--------------|
| Toast (success) | Copied (no period; aligned with button) |
| Button after copy | Copied |
| Generic error | Something went wrong. Try copying again. |
| Clipboard / manual path | Copy didn't work. Select the text and use Ctrl+C (or Cmd+C). |
| Fallback button label | Select text |

### 1.12 Privacy page

| Element | Current copy |
|---------|--------------|
| Back link | ← Back to library |
| H1 | Privacy policy |
| Intro | **Prompt Anatomy** – minimal app. A brief note about your data. |
| H2 | Do we collect your data? / What happens on your device? / If we add a form later |
| Body | (see privacy.html) |
| Bottom link | ← Back to library |

### 1.13 Root redirect

| Element | Current copy |
|---------|--------------|
| Visible text | Redirecting… Lietuvių \| English \| Eesti \| Latviešu |

---

## 2. UX & microcopy audit

### 2.1 Strengths

- **Value-first hero:** “Let AI do 30–50% of your daily tasks” is clear and benefit-led.
- **Scannable structure:** Sections (What you get, How to use, prompts, What’s next) are easy to scan.
- **Consistent pattern:** Each prompt card uses the same “Before using” / “What to do” structure.
- **Action-oriented CTAs:** “Start for free”, “Copy prompt”, “Join WhatsApp group” state the action.
- **Time framing:** “~3–5 min per step” and “In 30 minutes” set expectations.
- **Progress copy:** “You’ve used X of 8 prompts” and “Great – you’ve used all 8” support motivation.

### 2.2 Issues and recommendations

#### A. Clarity and consistency

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“For?”** (header-meta) | “For?” alone is cryptic; “Who it’s for” is in aria-label only. | Use visible copy: “For: Managers, specialists, consultants, freelancers.” or “Who it’s for: Managers, specialists, consultants, freelancers.” |
| **“Click here and copy”** (code-block) | “Here” is vague for screen readers; “copy” could mean “duplicate” or “copy to clipboard”. | Prefer: “Click to select, then copy” or “Select and copy prompt” (align with aria-label). |
| **“Select text”** (error fallback) | Shown when no specific error is passed; generic. | Keep as last-resort; consider “Copy didn’t work. Select the text and press Ctrl+C.” for fallback path. |

#### B. Tone and wording

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“What you actually get”** | “Actually” can sound defensive. | “What you get” or “What’s included” is neutral and clear. |
| **“chaotic prompts”** (objectives) | Slightly negative. | “Clear automation logic instead of ad‑hoc prompts” or “structured workflows instead of one-off prompts”. |
| **“Good luck with your analysis”** | Generic; “analysis” may not match all use cases. | “Good luck with your prompts” or “Good luck putting this into practice” to match the product. |

#### C. Errors and edge cases (JS)

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“Error: missing parameters”** | Technical; users never “pass parameters”. | Don’t show this to users (handle in code). If something fails, show: “Something went wrong. Try copying again.” |
| **“Prompt not found”** | Technical. | Same as above; generic recovery message is better. |
| **“Prompt is empty”** | Technical. | Same; generic message. |
| **“Copy failed”** | Clear but no next step. | “Copy failed. Try selecting the text and pressing Ctrl+C (or Cmd+C).” |
| **“Failed. Select the text manually and copy.”** | Good direction; “Failed” is abrupt. | “Copy didn’t work. Select the text and copy with Ctrl+C (or Cmd+C).” |
| **Toast “Copied.” vs button “Copied!”** | Inconsistent punctuation. | Use one style: e.g. “Copied” everywhere (or “Copied!” everywhere). |

#### D. Accessibility (aria-labels)

| Item | Current | Recommendation |
|------|---------|----------------|
| Code block | “Select and copy prompt N” | Good. |
| Copy button | “Copy prompt N to clipboard” | Good. |
| Success | “Prompt copied successfully” | Good. |
| Community primary CTA | “Open Prompt Anatomy WhatsApp group in new tab” | Slightly wrong (it’s “Prompt Anatomy” product but the group may have another name). Consider: “Join Prompt Anatomy WhatsApp group (opens in new tab)”. |
| Progress bar | `aria-label="Progress"` | Optional: “Progress: X of 8 prompts used” for more context. |

#### E. Consistency with product naming

| Item | Note |
|------|------|
| **“DI Prompt Library”** (privacy, footer) vs **“Prompt Anatomy”** (badge, product link) | Decide: is the product “Prompt Anatomy” and this the “DI Prompt Library” spin-off, or one name for the app? Ensure privacy and footer use the chosen naming. |
| **“Spin-off No. 1”** | Clear; keep as is if that’s the brand. |

#### F. Privacy page

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“← Back to library”** vs **“← Back to DI Prompt Library”** | Two different link texts at top and bottom. | Use one: e.g. “← Back to library” in both places, or “Back to DI Prompt Library” if you want the full name. |
| **“We do not collect any personal data at this time.”** | Clear. | Optional: “We don’t collect personal data.” for a slightly friendlier tone. |

#### G. Instructions (step 4)

| Item | Current (condensed) | Note |
|------|----------------------|------|
| Placeholders | “[COMPANY]”, “[MY ROLE]”; “replace with your or your client’s company” | Clear. “The AI role … is already in the prompt – no need to change it” is good. Consider one short sentence: “Replace only [COMPANY] and [MY ROLE]; leave the AI role as is.” |

---

## 3. Summary table – priority

| Priority | Area | Action |
|----------|------|--------|
| **High** | Hero “For?” | Replace with “Who it’s for:” or “For:” + list so it’s clear without aria. |
| **High** | JS errors | Replace technical messages (“missing parameters”, “Prompt not found”, “Prompt is empty”) with a single user-facing message; improve “Copy failed” / fallback with next step (Ctrl+C). |
| **Medium** | “Click here and copy” | Change to “Select and copy” or “Click to select, then copy”. |
| **Medium** | Toast vs button | Unify “Copied” / “Copied!”. |
| **Medium** | “What you actually get” | Consider “What you get” or “What’s included”. |
| **Low** | “Good luck with your analysis” | Consider “Good luck with your prompts” or similar. |
| **Low** | Privacy back link | Use same label at top and bottom. |
| **Low** | Progress `aria-label` | Optionally make dynamic (“Progress: X of 8 prompts used”). |

---

## 4. Questions for product / content (decisions 2026-03-06)

1. **Product name in UI:** Use “Prompt Anatomy” as main brand; “DI Prompt Library” only as secondary descriptor where useful. *Applied in privacy title, back link, root redirect.*
2. **Audience:** “Managers, specialists, consultants, freelancers” kept in hero as “Who it’s for:”.
3. **Error handling:** No technical errors in UI; user-facing messages only; manual copy hint when clipboard fails. *Applied in JS.*
4. **Tone:** (Privacy “We do not collect” vs “We don’t collect”) – left for later; backlog optional.
5. **Localization:** EN string sync note added to MULTILINGUAL_STRUCTURE.md (turinio sinchronizacija) so LT stays aligned when EN changes.

---

## 5. Files to update (when implementing)

- **`en/index.html`** – hero meta, instructions, code-block ::before, next steps, community, footer, progress text; all JS error/success strings and aria-labels.
- **`en/privacy.html`** – back link(s), optional tone tweaks.
- **Root `index.html`** – only if redirect or product name copy is changed.

---

## 6. High-priority changes applied (2026-03-06)

- **Hero:** “For?” → “Who it's for:” (visible and aria).
- **JS errors:** All technical messages replaced with user-facing copy:
  - Generic: “Something went wrong. Try copying again.”
  - When clipboard/manual copy needed: “Copy didn't work. Select the text and use Ctrl+C (or Cmd+C).” or same with “Select the text and use Ctrl+C (or Cmd+C).” where relevant.
  - `aria-label` on error: no longer prefixed with “Error:”.
- **Product naming:** “Prompt Anatomy” as primary brand:
  - `en/privacy.html`: title “Privacy policy – Prompt Anatomy”; bottom link “← Back to library”.
  - Root `index.html`: title “Redirect – Prompt Anatomy”.
- **LT sync:** EN string sync note added to [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) (turinio sinchronizacija).

---

## 7. Medium / low priority – implemented

Šie punktai įgyvendinti bibliotekoje (EN šaltinis, LT rankiniu, ET/LV per `npm run generate:et-lv` kur taikoma); detalės – [CHANGELOG.md](../CHANGELOG.md) sekcija `[Unreleased]` / „Pakeista“.

| Ref | Change |
|-----|--------|
| 7.1 | Code-block hint: „Select and copy“ (CSS kintamasis ir lokalizuoti atitikmenys). |
| 7.2 | Toast ir mygtukas: „Copied“ be šauktuko / taško. |
| 7.3 | Antraštė „What you get“ (ir lokalizuoti atitikmenys). |
| 7.4 | Footer „Good luck with your prompts“ (ir lokalizuoti atitikmenys). |
| 7.6 | Privatumas: viršus ir apačia – „← Back to library“. |

**7.5 (optional, dar neprivaloma):** progress bar `aria-label` vis dar statinis „Progress“; galima vėliau dinamiškai atnaujinti JS (pvz. „Progress: X of 8 prompts used“).
