# Daugiakalbiška struktūra (LT / EN / ET / LV / JA)

**Atsakingas:** Curriculum Agent  
**Tikslas:** Path atitikmenys ir routing taisyklės – vienas šaltinis tiesiai UI/UX ir Content.

**Pagrindinio produkto nuoroda (Prompt Anatomy / Promptų anatomija):** visur naudoti **`https://www.promptanatomy.app/en`** (ne `https://www.promptanatomy.app/` be kelio, ne senasis GitHub Pages `ditreneris.github.io/anatomija`). Tas pats badge, footer, community ir dokumentacijoje – žr. [AGENTS.md](../AGENTS.md) (golden rule).

---

## 1. Puslapių atitikmenys

| Kalba | Biblioteka | Privatumas |
|--------|------------|------------|
| LT | `/lt/` (`lt/index.html`) | `/lt/privatumas.html` |
| EN | `/en/` (`en/index.html`) | `/en/privacy.html` |
| ET | `/et/` (`et/index.html`) | `/et/privacy.html` |
| LV | `/lv/` (`lv/index.html`) | `/lv/privacy.html` |
| JA | `/ja/` (`ja/index.html`) | `/ja/privacy.html` |

ET ir LV naudoja tuos pačius failų pavadinimus kaip EN (`index.html`, `privacy.html`). LT išlaiko `privatumas.html`.

---

## 2. Routing taisyklės

### Root `/`

- Vienintelis failas: `index.html` (redirect puslapis).
- Logika: nustatyti kalbą; tada `window.location.replace` į `base + '/lt/'`, `'/en/'`, `'/et/'`, `'/lv/'` arba `'/ja/'`.
- Kalbos nustatymas (prioritetas):
  1. `localStorage.getItem('lang')` – jei reikšmė `lt`, `en`, `et`, `lv` arba `ja`.
  2. `navigator.language` (žemiau): jei prasideda `lt` → `/lt/`; `et` arba `ee` → `/et/`; `lv` → `/lv/`; kitaip fallback `/en/`.
- **Base path:** Jei GitHub Pages project site (pvz. repo `automation`), base = `/automation`. Root user site – base = `''`. Pathname normalizavimas root redirect skripte: žr. `index.html`.
- **Rankinės nuorodos** („Lietuvių“, „English“ ir t. t.) taip pat kviečia `localStorage.setItem('lang', …)`, kad elgsena sutaptų su kalbos jungikliu viduje locale.

### Kalbos jungiklis

- Visuose bibliotekos ir privatumo puslapiuose: penkios kalbos, struktūra  
  `<nav class="lang-switcher" aria-label="…"><ul class="lang-switcher-list"><li>…</li></ul></nav>`.
- Dabartinė kalba: `<span class="lang-current" aria-current="page">`; kitos – `<a class="lang-link" data-lang="…" href="…" onclick="…localStorage.setItem('lang',…)">`.
- Etiketės gimąja kalba: **Lietuvių**, **English**, **Eesti**, **Latviešu**, **日本語** (be vėliavų).
- **Privatumas:** tie patys komponentai ir stiliai kaip bibliotekoje (`lang-link`, 44px touch, fokusas), spalvos – privacy puslapio tema.
- **Privatumo keliai:** `lt/privatumas.html` ↔ `en|et|lv/privacy.html`.

---

## 3. SEO (`hreflang`)

- Kiekvienas puslapis: `hreflang` `lt`, `en`, `et`, `lv` ir `x-default` (`<link rel="alternate" … id="hreflang-lt">` … `id="hreflang-default">`).
- **`x-default`:** anglų versija (`/en/` arba `/en/privacy.html`).
- **Įgyvendinimas:** [js/hreflang.js](../js/hreflang.js) (kelias iš poaplankių: `../js/hreflang.js`). Ant `<html>`: `data-hreflang-suite="library"` (biblioteka) arba `"privacy"` (privatumo puslapiai). Skriptas užpildo absoliučius `href` iš `location.origin` + bazės kelio; bazė = `pathname` po pakeitimo regex  
  `/\/(lt|en|et|lv|ja)(\/.*|$)/i` → `''` (tai nuima locale segmentą ir viską po juo, įskaitant atvejus be trailing slash, pvz. `/repo/lt`).

---

## 3b. Vartotojo užpildomi žymekliai (promptuose)

Vienoda logika kaip LT: **tokenai atitinka kalbą**, EN lieka tarptautiniu šablonu `[COMPANY]` / `[MY ROLE]`.

| Kalba | Įmonė / organizacija | Rolė / pareigos | 7-o prompto lentelė (stulpelių antraštės) |
|--------|----------------------|-----------------|-------------------------------------------|
| LT | `[ĮMONĖ]` | `[MANO ROLĖ]` | `[PROMPTAS]` \| `[KADA NAUDOJU]` \| `[KOKIĄ PROBLEMĄ SPRENDŽIA]` |
| EN | `[COMPANY]` | `[MY ROLE]` | `[PROMPT]` \| `[WHEN I USE IT]` \| `[PROBLEM IT SOLVES]` |
| ET | `[ETTEVÕTE]` | `[MINU ROLL]` | `[KÜSITIS]` \| `[MILLAL KASUTAN]` \| `[MILLISE PROBLEEMI LAHENDAB]` |
| LV | `[UZŅĒMUMS]` | `[MANA LOMA]` | `[PROMPTTEKSTS]` \| `[KAD LIETOJU]` \| `[KĀDU PROBLĒMU RISINA]` |

ET/LV tekstai: `scripts/prompt-bodies-et-lv.cjs`; po EN pakeitimų – `npm run generate:et-lv`.

---

## 4. Turinio sinchronizacija

Kai keičiami **anglų (EN)** UI arba struktūriniai tekstai (`en/index.html`, `en/privacy.html`), reikia išlyginti:

- **LT:** `lt/index.html`, `lt/privatumas.html`
- **ET / LV:** regeneruoti iš EN naudojant `npm run generate:et-lv` (`node scripts/generate-et-lv-pages.cjs`; žr. `scripts/prompt-bodies-et-lv.cjs` promptų tekstams) ir rankiniu būdu patikrinti / atnaujinti `et/privacy.html`, `lv/privacy.html`, jei privatumo tekstas keičiasi ne per generatorių.

**Bendri ištekliai (biblioteka):** [css/library.css](../css/library.css) – vienas stilių failas visoms kalboms; lokalizuotas code-block užrašas – trumpas inline `<style>:root { --codeblock-copy-hint: '…' }</style>` prieš `link` į `library.css`. **JavaScript:** kanonas – [js/library.js](../js/library.js) (EN); LT – [js/library.lt.js](../js/library.lt.js) (sinchronizuoti ranka su LT); ET/LV – [js/library.et.js](../js/library.et.js) ir [js/library.lv.js](../js/library.lv.js) generuojami tuo pačiu `generate:et-lv` (poros `ET_JS_PAIRS` / `LV_JS_PAIRS` faile generatoriaus). CI tikrina, kad po `generate:et-lv` nebūtų `git diff` šiuose failuose.

- **PR:** [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) – checkbox „Daugiakalbystė (kai liečia EN)“.
- **Pagrindinės vietos:** hero, instrukcijos, progress, mygtukai, JS pranešimai, code-block `::before`, footer, privatumas.
- **Nuoroda:** EN mikrotekstas – [docs/MICROCOPY_AUDIT_EN.md](MICROCOPY_AUDIT_EN.md).

---

## 5. Path → counterpart (santrauka)

```
Biblioteka: /lt/ | /en/ | /et/ | /lv/ | /ja/  (kiekviena su index.html)
Privatumas: /lt/privatumas.html ↔ /en/privacy.html ↔ /et/privacy.html ↔ /lv/privacy.html ↔ /ja/privacy.html
```

Naudoti santykinius kelius (pvz. `../et/`, `../lt/privatumas.html`) arba base path pagal deploy.

---

## 6. Testai ir CI

- Struktūriniai testai: [tests/structure.test.js](../tests/structure.test.js) – `data-hreflang-suite`, `hreflang.js`, `lang-switcher-list`, privatumo `lang-link`, root `localStorage`, `library.css` / locale `library*.js`.
- GitHub Actions: [.github/workflows/ci.yml](../.github/workflows/ci.yml) – `npm install`, `npm run generate:et-lv` ir `git diff --exit-code` (`et/index.html`, `lv/index.html`, `ja/index.html`, `js/library.et.js`, `js/library.lv.js`, `js/library.lt.js`, `js/library.ja.js`), `npm test`, pa11y (per [scripts/pa11y-pages.cjs](../scripts/pa11y-pages.cjs)). Actions versijos prisegtos prie commit SHA. Dependabot: [.github/dependabot.yml](../.github/dependabot.yml) (npm + GitHub Actions). (Dependency review žingsnis neįtrauktas, kol repozitorijoje neįjungtas Dependency graph.)
