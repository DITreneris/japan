# Changelog

Visi reikšmingi projekto pakeitimai dokumentuojami šiame faile.

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Unreleased]

Kolonėlės (Prideta / Pakeista / …) pildomos iki kito semver release; paskutinis release – **[1.2.0]**.

### Pakeista

- UI/UX: kalbų jungikliuose (biblioteka + privatumas) vartotojui matomos tik **EN** ir **JA** (LT/ET/LV URL lieka, bet nerodomi switcher’iuose).
- Root `/` redirect: numatytas nukreipimas į `/ja/`; jei `localStorage.lang` yra `lt|et|lv` – map’inama į `/en/`.
- Generatorius: `npm run generate:et-lv` atnaujintas, kad ET/LV/JA puslapiuose nav nebeįrašytų LT/ET/LV kalbų į switcher.
- Testai: struktūriniai testai pritaikyti EN+JA-only switcheriams (root manual links ir privacy lang-link lūkesčiai).
- Bendruomenės CTA: **WhatsApp** nuoroda pakeista į **Telegram** kanalą `https://t.me/prompt_anatomy` visose bibliotekos `index.html` versijose (`en` / `et` / `lv` / `lt` / `ja`) ir atitinkamai atnaujinti matomi tekstai bei `aria-label`.
- JA: `ja/index.html` viešas UI (hero, „prieš naudojant“, info dėžutės, next-steps, community, footer, `aria-label`) suvienodintas japonų kalba (kad `/ja/` nebekeltų „pusiau EN“ įspūdžio).
- JA privatumas: `ja/privacy.html` – išorinių paslaugų paminėjimas atnaujintas nuo WhatsApp į Telegram (kartu su bendru CTA pakeitimu).
- Dokumentacija: `STYLEGUIDE.md` ir `docs/MICROCOPY_AUDIT_EN.md` – bendruomenės CTA aprašymai suderinti su Telegram.

---

## [1.2.0] - 2026-04-14

### Prideta

- Japonų (JA, `ja`) pilotinė lokalizacija: `/ja/` (`ja/index.html`) ir `/ja/privacy.html`.
- Generatorius papildytas `ja` išvestimis: `ja/index.html` ir `js/library.ja.js` (`npm run generate:et-lv`), nauji promptų tekstai `scripts/prompt-bodies-ja.cjs`.

### Pakeista

- Root redirect ir kalbų jungikliai: pridėta **日本語**, `localStorage.lang='ja'` ir `navigator.language` `ja*` nukreipimas.
- `hreflang`: pridėtas `hreflang-ja` visuose puslapiuose; `js/hreflang.js` bazės kelio regex papildytas `ja`.
- QA/CI vartai: struktūriniai testai papildyti `ja`, ESLint globalai papildyti `js/library.ja.js`, CI `git diff --exit-code` įtrauktas `ja/index.html` ir `js/library.ja.js`.
- Dokumentacija: `docs/MULTILINGUAL_STRUCTURE.md` papildyta `ja` maršrutais ir `hreflang` taisyklėmis.
- JA UX: išjungtas `tap-to-copy` ant `.code-block` (paritetas su EN/LT/ET/LV – click/tap tik pažymi tekstą; kopijavimas per mygtuką / `Ctrl+C` / `Cmd+C`).
- JA mikrotekstas: progreso indikatorius `使用済み：X / 8` → `進捗：X / 8`.
- LT privatumas: suvienodintas apatinis grįžimo linkas „← Grįžti į biblioteką“ (`lt/privatumas.html`).

---

## [1.1.0] - 2026-03-29

Versija atitinka [package.json](package.json) `1.1.0` (minor: toolchain, daugiakalbystė, CI, turinio sinchronizacija nuo 1.0.0).

### Prideta

- Lokali HTML validacija: `html-validate` (preset `document`, [`.htmlvalidate.json`](.htmlvalidate.json)), [scripts/lint-html.mjs](scripts/lint-html.mjs); pašalintas `html-validator-cli` (W3C API / 403 rizika).
- Bendras [css/library.css](css/library.css); bibliotekos `index.html` naudoja `:root { --codeblock-copy-hint }` + `link` į `library.css`.
- Išoriniai skriptai: kanoninis [js/library.js](js/library.js) (EN); [js/library.lt.js](js/library.lt.js), [js/library.et.js](js/library.et.js), [js/library.lv.js](js/library.lv.js) generuojami per `npm run generate:et-lv` (`LT_JS_PAIRS` / `ET_JS_PAIRS` / `LV_JS_PAIRS` [scripts/generate-et-lv-pages.cjs](scripts/generate-et-lv-pages.cjs)).
- [.github/dependabot.yml](.github/dependabot.yml) (npm + github-actions); GitHub Actions žingsniai su prisegtu commit SHA ([ci.yml](.github/workflows/ci.yml), [deploy.yml](.github/workflows/deploy.yml)).
- CI / deploy: po `generate:et-lv` – `git diff --exit-code` (`et/index.html`, `lv/index.html`, `js/library.et.js`, `js/library.lv.js`, `js/library.lt.js`); pa11y per [scripts/pa11y-pages.cjs](scripts/pa11y-pages.cjs) (įskaitant root `/`).
- [.gitattributes](.gitattributes): `eol=lf` HTML/JS/CSS ir kt.; generatorius rašo LF (`writeUtf8Lf`) – vienodas `git diff` Windows / Ubuntu CI.
- Kanoninis GitHub repozitorijas: [DITreneris/automation](https://github.com/DITreneris/automation). Production URL dokumentacijoje: `https://DITreneris.github.io/automation/` (README, DEPLOYMENT, TESTAVIMAS, MULTILINGUAL_STRUCTURE).
- Daugiakalbiška statinė biblioteka (LT / EN / ET / LV): katalogai `/lt/`, `/en/`, `/et/`, `/lv/`; LT privatumas `lt/privatumas.html`, kitos kalbos – `privacy.html`; root redirect ir `localStorage` (`lt` \| `en` \| `et` \| `lv`), naršyklės kalba (`et` / `ee` / `lv`), keturiakalbis jungiklis ir `hreflang` visuose aštuoniuose puslapiuose, `x-default` → EN. ET/LV bibliotekos HTML generuojamos iš EN (`scripts/generate-et-lv-pages.cjs`, `scripts/prompt-bodies-et-lv.cjs`); struktūriniai testai ir `lint:html` apima ET/LV. Žr. [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md), MUST_TODO.md skyrių „Multilingual“.
- Mikroteksto auditas EN UI: [docs/MICROCOPY_AUDIT_EN.md](docs/MICROCOPY_AUDIT_EN.md) (inventorius ir istorija). Vidutinės / žemos prioriteto rekomendacijos įgyvendintos – žr. toliau „Pakeista“ ir MICROCOPY 7 skyrių. EN sinchronizacija su kitomis kalbomis – [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) (turinio sinchronizacija: LT rankiniu, ET/LV per `npm run generate:et-lv`).
- Bullet-proof promptų standartas: docs/BULLET_PROOF_PROMPTS.md (META/INPUT/OUTPUT struktūra, reikalavimai, „Naudok kai“ taksonomija). Dokumentų inventoriuje – docs/DOCUMENTATION.md.
- Kiekviename prompte: META/INPUT/OUTPUT blokai, „Pakeisk prieš naudodamas:“, „Rezultatas:“, „Naudok kai:“. Pirmame prompte – „Tai nėra klausimynas. Nukopijuok šį tekstą ir įklijuok į ChatGPT arba Claude.“
- Kortelėse: „Naudok kai“ eilutė po kiekvieno prompto aprašymo (CSS .prompt-when). Gyvo testavimo checklist: „Turinio / bullet-proof“ skyrius docs/TESTAVIMAS.md.
- QA ir dokumentų valdymo procesas: CHANGELOG.md, docs/DOCUMENTATION.md, integracija su AGENTS.md ir .cursorrules.
- Deploy: GitHub Pages workflow (.github/workflows/deploy.yml), DEPLOYMENT.md.
- QA standartas: docs/QA_STANDARTAS.md su nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01).
- Gyvo testavimo dokumentacija: docs/TESTAVIMAS.md (scenarijai ir žurnalas).
- Ryšys su pagrindiniu produktu: badge ir nuorodos į [Prompt Anatomy](https://www.promptanatomy.app/en) (kanonas: kelias `/en`; LT etiketė „Promptų anatomija“), community ir footer. Senasis hostingas `ditreneris.github.io/anatomija` – nebenaudoti (istorija – žr. „Pakeista“).
- Favicon: favicon.svg (SVG, „P“ ant teal fono), nuorodos index.html ir privatumas.html.
- `.nojekyll` root’e – GitHub Pages naudoja statinius failus be Jekyll.
- Bendras [js/hreflang.js](js/hreflang.js): `hreflang` nuorodos užpildomos pagal `<html data-hreflang-suite="library"|"privacy">`; vienas regex bazės keliui (įskaitant `/repo/lt` be trailing slash po locale).
- Struktūriniai testai papildyti: `data-hreflang-suite`, išorinis `hreflang.js`, `lang-switcher-list`, privatumo `lang-link`, root rankinių nuorodų `localStorage`.
- CI (pa11y): papildomai ET ir LV biblioteka (`/et/`, `/lv/`) ir jų privatumo puslapiai.
- PR šablonas: sekcija „Daugiakalbystė (kai liečia EN)“ – `generate:et-lv` ir ET/LV peržiūra; papildomas punktas dėl EN inline JS / mikroteksto ir `lt/index.html` sinchronizacijos.
- Dokumentacija: [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) (3b: vartotojo žymekliai ir 7-o prompto lentelės stulpelių antraštės visoms kalboms LT / EN / ET / LV).

### Pakeista

- CI: pašalintas `dependency-review-action` job – GitHub grąžina „Dependency review is not supported“, kol repozitorijoje neįjungtas **Dependency graph** ([Security analysis](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph#enabling-the-dependency-graph)). Likęs CI: `lint-and-test` (generatoriaus diff, `npm test`, pa11y).
- **ESLint** `8.x` → `10.x` su flat config ([eslint.config.js](eslint.config.js), `@eslint/js`, `globals`); pašalintas [.eslintrc.json](.eslintrc.json); `lint:js` → `eslint .`.
- **wait-on** `8.x` → `9.x` (CI `wait-on` žingsnis).
- **GitHub Actions:** `actions/checkout` v6.0.2, `actions/setup-node` v6.3.0, **Node.js 22** CI/deploy (ESLint 10 reikalavimas); `deploy-pages` v5.0.0. **`upload-pages-artifact` lieka v3.0.1** – v4 neįtraukia dotfailų (`.nojekyll`), kas sulaužytų statinį Pages; [Dependabot](.github/dependabot.yml) ignoruoja šio veiksmo major atnaujinimus.
- **pa11y** dev priklausomybė `6.x` → `9.1.1` ([migracija](https://github.com/pa11y/pa11y/blob/main/MIGRATION.md): Node.js ≥ 20, atnaujintas Puppeteer / axe). [scripts/pa11y-pages.cjs](scripts/pa11y-pages.cjs) ir CI a11y žingsnis lieka tie patys CLI argumentai (`--standard WCAG2AA`, `--ignore warning`, `--reporter cli`, `--no-sandbox`).
- Kanoninė **Prompt Anatomy** nuoroda visoje bibliotekoje ir agentų taisyklėse: **`https://www.promptanatomy.app/en`** (produkto anglų įėjimas); atnaujinta [en/index.html](en/index.html), [lt/index.html](lt/index.html), generatorius [scripts/generate-et-lv-pages.cjs](scripts/generate-et-lv-pages.cjs), regeneruoti ET/LV; [AGENTS.md](AGENTS.md), [.cursorrules](.cursorrules), [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md).
- Estų (ET) bibliotekos UI / mikrotekstas: [scripts/prompt-bodies-et-lv.cjs](scripts/prompt-bodies-et-lv.cjs) – pataisyta klaidinga forma „tehisintelligendiga“ → „tehisintellektiga“ (8-o prompto OUTPUT); OUTPUT eilutėse nuosekliau skaitytojui („näete“, „saate“, „kasutage seda“). [scripts/generate-et-lv-pages.cjs](scripts/generate-et-lv-pages.cjs) – `ET_PAIRS`: vieningas mandagaus („teie“) adresavimas ir daugiskaitos imperatyvai (Kasutage, kui / Valige / Kopeerige prompt / Märkige / asendage ir pan.); `ET_JS_PAIRS`: progreso tekstas suderintas su HTML („Olete kasutanud …“, užbaigimas „… kõiki kaheksat prompti“), klaidų pranešimai „Proovige“ / „Valige“. [et/privacy.html](et/privacy.html) – aiškesnis sakinys apie `localStorage`. [tests/structure.test.js](tests/structure.test.js) – ET mygtukų tekstas „Kopeerige prompt“. Po `npm run generate:et-lv` atnaujinti `et/index.html`, `js/library.et.js` (ir LV/LT generuojami failai pagal generatorių).
- Dokumentų valdymas: [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) §1 papildytas (VARIANTU_PALYGINIMAS, MICROCOPY_AUDIT_EN, STYLEGUIDE, KODO_BAZES_ANALIZE); §2 – PR dokumentacijos Definition of Done. [README.md](README.md) – `docs/` medis (BULLET_PROOF, MICROCOPY) ir nuoroda į pilną inventorių §1. [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) §4 – `lint:html` (9 HTML), a11y lokaliai kaip [AGENTS.md](AGENTS.md) §6 / [scripts/pa11y-pages.cjs](scripts/pa11y-pages.cjs). [.cursorrules](.cursorrules) – nuoroda į DOCUMENTATION §1 kaip kanoninį indeksą.
- Dokumentacija ir agentų taisyklės suderintos su daugiakalbe statine architektūra (horizontalūs / vertikalūs vartai): [AGENTS.md](AGENTS.md) – meta (dokumentacija LT, UI lt/en/et/lv), išplėstos Content/Curriculum/UI/QA/Orchestrator rolės, **§3 workflow** – žingsnis „Daugiakalbystės vartai“, §8 – [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) po [.cursorrules](.cursorrules), §6 – komandos (`npm test`, `npm run generate:et-lv`, pa11y per `wait-on` + `PA11Y_BASE`); [.cursorrules](.cursorrules) – daugiakalbė apžvalga, LT tonas tik `lt/`, `lang` per locale, Google forma / GDPR sąlygiškai aktyviai formai, **CODE REVIEW CHECKLIST** – punktai sutampa su [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) „Daugiakalbystė“; [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) – kryžminės nuorodos AGENTS ↔ MULTILINGUAL (operacinė seka §3).
- `npm run lint:html` → `node scripts/lint-html.mjs`. Struktūriniai testai: `library.css`, locale JS failai.
- ET / LV: vartotojo užpildomi žymekliai promptuose lokalizuoti (paritetas su LT): `scripts/prompt-bodies-et-lv.cjs` ir `scripts/generate-et-lv-pages.cjs` (instrukcijos, „Kasuta kui“ / „Lietojiet, kad“, footer); regeneruoti `et/index.html`, `lv/index.html`. ET: `[ETTEVÕTE]`, `[MINU ROLL]`, 7-ame prompte `[KÜSITIS]` \| `[MILLAL KASUTAN]` \| `[MILLISE PROBLEEMI LAHENDAB]`. LV: `[UZŅĒMUMS]`, `[MANA LOMA]`, `[PROMPTTEKSTS]` \| `[KAD LIETOJU]` \| `[KĀDU PROBLĒMU RISINA]`. EN: `[COMPANY]` / `[MY ROLE]` be pakeitimų. Žr. §3b.
- LV mikrokopija ir generatorius: [scripts/generate-et-lv-pages.cjs](scripts/generate-et-lv-pages.cjs) – į `LV_PAIRS` pridėta antroji „What to do“ pora (trumpasis „Copy the text below…“ → „Ko darīt: Kopējiet…“), kaip jau buvo `ET_PAIRS`; po `npm run generate:et-lv` 2–8 promptuose nebelieka anglų bloko. [scripts/prompt-bodies-et-lv.cjs](scripts/prompt-bodies-et-lv.cjs) – `LV_PROMPTS`: META (prompt 1) „nepieciešama precizēšana“, META (prompt 5) „kur tiek tērēts laiks un enerģija“ (vietoj netinkamos formuluotės), INPUT (prompt 6) „saprotami lietotājam bez tehniskām zināšanām“. `LV_JS_PAIRS`: klaidos tekstas „Kaut kas nogāja nepareizi“ (vietoj „greizi“). Regeneruoti `lv/index.html`, `js/library.lv.js`.
- LT: kopijavimo `copyPrompt` / `fallbackCopy` / `showError` – tie patys vartotojiški pranešimai kaip EN (be techninių „Promptas nerastas“ ir pan.); numatytasis klaidos tekstas ir `aria-label` be „Klaida:“ prefikso.
- Keturių kalbų UI/UX paritetas (statinė biblioteka): EN + sinchronizuota LT + regeneruota ET/LV (`npm run generate:et-lv`) pagal docs/MICROCOPY_AUDIT_EN.md §7 – code-block „Select and copy“ (ET „Vali ja kopeeri“, LV „Atlasiet un kopējiet“, LT „Pažymėk ir nukopijuok“), antraštė „What you get“ / „Mida saate“ / „Ko iegūstat“ / „Ką gausite“, footer „Good luck with your prompts“ / atitikmenys, suvienodinti „Copied“ toast ir mygtuke (be šauktuko / taško). [scripts/generate-et-lv-pages.cjs](scripts/generate-et-lv-pages.cjs): `Copied` porų tvarka – pirmiau `button.innerHTML`, tada toast `<span>Copied</span>`, kad `applyPairs` nesulaužytų JS eilutės.
- [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md): checkbox EN bibliotekos inline JS / mikrotekstui – atnaujinti LT ir paleisti `generate:et-lv`.
- Prompt Anatomy produkto URL: senasis `https://ditreneris.github.io/anatomija/` pakeistas į `https://www.promptanatomy.app/en` (ne domeno šaknis be `/en`); badge, community, footer visose kalbose; ET/LV per generatorių.
- EN mikrotekstas (aukšta prioritetas): hero „For?“ → „Who it's for:“; LT hero „Kam?“ → „Kam skirta:“ (paritetas su EN). Visos JS klaidos pakeistos vartotojui suprantamu tekstu („Something went wrong. Try copying again.“, manual copy hint kai clipboard nepavyksta); vardas vienodas – „Prompt Anatomy“ (privacy title, root redirect title, privacy „Back to library“).
- Root redirect: base path išvedamas iš `location.pathname`, kai meta `base-path` tuščias – veikia GitHub Pages project site (`https://DITreneris.github.io/automation/`). DEPLOYMENT.md – nurodytas production URL.
- README.md „Kaip naudoti“: žingsnis 5 – žymekliai visoms kalboms (LT, EN, ET, LV) ir nuoroda į §3b; footer instrukcijos – DI rolės keisti nereikia.
- Visi 8 promptai perrašyti į META/INPUT/OUTPUT struktūrą; „Rolė – X“ pakeista į „Tu esi X“ (META). DI rolė atskirta nuo vartotojo rolės [MANO ROLĖ].
- Copyable promptas: į mainų atmintinę kopijuojamas tik META+INPUT+OUTPUT. Instrukcijos (Naudok kai, Pakeisk prieš naudodamas, Ką daryti) perkeltos į atskirą bloką „Prieš naudojant“ tarp code-block ir „Kodėl tai svarbu“; „Naudok kai“ pašalintas iš prompt-header.
- Community sekcija: hierarchija ir UX – vienas pagrindinis CTA (brand green #0E7A33, be glow, subtilus shadow), antrinis outline („Promptų anatomija“). Trumpesnė antraštė dviem eilutėm, vertikalūs tarpai (16px / 24px / 16px), kortelė 1px border ir 16px radius. Emoji pašalintas iš CTA. STYLEGUIDE 4.7 atnaujintas.
- Kalbos jungiklis visuose 8 puslapiuose: semantika `<nav><ul class="lang-switcher-list"><li>…`, dabartinei kalbai `aria-current="page"` (WAI); privatumo puslapiai sutapatinti su biblioteka (`class="lang-link"`, `data-lang`, fokuso stiliai).
- Root `index.html`: rankinės nuorodos į `lt/` / `en/` / `et/` / `lv/` taip pat kviečia `localStorage.setItem('lang', …)`.
- `hreflang`: inline skriptai aštuoniuose HTML pakeisti išoriniu `../js/hreflang.js`.
- `scripts/generate-et-lv-pages.cjs`: `ET_NAV` / `LV_NAV` su nauja nav struktūra; `<html>` poros atnaujintos su `data-hreflang-suite="library"`.
- [TODO.md](TODO.md) (P1–P2 uždaryti) ir [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) suderinti su įgyvendinimu (§3 `hreflang.js`, §6 testai / CI).

### Taisyta

- [js/library.js](js/library.js) (ir per generatorių – `library.lt.js` / `library.et.js` / `library.lv.js`): `fallbackCopy` po `execCommand` vėl įdeda `hiddenTextarea` į buvusią DOM vietą (`insertBefore` / `appendChild`); kitaip pakartotinis fallback kopijavimas neberasdavo `#hiddenTextarea`. Atskiri debounce timeriai `selectText` ir `copyPrompt` (`createDebounce`).
- [css/library.css](css/library.css): prie `prefers-reduced-motion: reduce` pridėta `html { scroll-behavior: auto; }` (ne tik trumpinamos animacijos / perėjimai).
- [scripts/pa11y-pages.cjs](scripts/pa11y-pages.cjs): Windows – `npx.cmd` ir `shell: false`, kad `pa11y` gautų teisingus argumentus (anksčiau `shell: true` laužė argv).
- DEPLOYMENT.md: GitHub Pages pirmas įjungimas (šaltinis **GitHub Actions**) ir troubleshooting eilutė klaidai `Failed to create deployment (404)` / `deploy-pages` Not Found; `.github/workflows/deploy.yml` – priminimas komentare.
- Badge „Promptų anatomija“: paspaudimo zona (min-height/min-width 44px), z-index ir cursor, kad nuoroda būtų aiškiai paspaudžiama.
- A11y WCAG2AA: community skyriaus nuorodos „Promptų anatomija“ kontrastas (teksto spalva #040404).
- Hreflang skriptas (lt/en index + privatumas/privacy): null patikros prieš `getElementById(...).href`, kad nebūtų klaidos, jei elemento nėra.
- Hreflang bazės kelias: ankstesnis inline `pathname.replace(/\/(lt|en|et|lv)\/.*/, …)` neteisingas, kai po locale nėra papildomo `/` (pvz. `/repo/lt`); dabar centralizuotas skaičiavimas `js/hreflang.js`.
- Hreflang `<link>`: pradinis `href=""` pakeistas į `href="#"` – HTML validatoriumi leidžiama, skriptas vėliau nustato tikrus URL.
- package.json: „serve“ įtrauka sutvarkyta; `lint:js` – `eslint .` (vietinis ESLint iš `devDependencies`, flat config).

### Pašalinta

- CI: `dependency-review-action` job (žr. „Pakeista“ – reikalauja Dependency graph).
- [.eslintrc.json](.eslintrc.json) – pakeistas flat [eslint.config.js](eslint.config.js) (ESLint 10).
- Root `privatumas.html`: nenaudojamas (kanoniniai puslapiai – `lt/privatumas.html`, `en/privacy.html`). docs/DOCUMENTATION.md inventoriuje atnaujinta nuoroda į lt/privatumas.html ir en/privacy.html.

### Deprecated

- (tuščia)

### Saugumas

- (tuščia)

---

## [1.0.0] - 2026-02-18

### Prideta

- Pradinė DI Promptų Biblioteka: 8 promptai, interaktyvus dizainas, kopijavimo funkcija.
- Dokumentacija: README.md, INTEGRACIJA.md, AGENTS.md, .cursorrules, feedback-schema.md.
- CI: lint, testai, a11y (pa11y) per .github/workflows/ci.yml.
- PR šablonas ir agentų commit prefiksai.

### Pakeista

- (pirmas release – nėra ankstesnių pakeitimų)

### Taisyta

- (nėra)
