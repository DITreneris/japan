# QA standartas – DI Promptų Biblioteka

**Kanoninis repozitorijas organizacijos QA procesui:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

Šis dokumentas aprašo įvestą kokybės tikrinimo (QA) standartą ir jo ryšį su spinoff01 repozitorija.

---

## 1. Tikslas

- Vienoda QA praktika visuose susijusiuose projektuose.
- Aiškūs kriterijai prieš merge ir release.
- Dokumentuotas gyvas testavimas po deploy.

---

## 2. Nuoroda į spinoff01

- **Repozitorija:** https://github.com/DITreneris/spinoff01  
- **Paskirtis:** Organizacijos QA standarto ir šablonų repozitorijas (checklistai, workflow šablonai, testavimo šablonai).  
- **Šiame projekte:** Laikomės šio dokumento ir [AGENTS.md](../AGENTS.md) QA Agent aprašymo; bendri standartai ir atnaujinimai – spinoff01.

---

## 3. QA kriterijai (šis projektas)

### Prieš kiekvieną merge / PR

- [ ] `npm test` praeina (struktūra + `lint:html` + `lint:js`).
- [ ] CI (`.github/workflows/ci.yml`) praeina – lint, testai, pa11y (WCAG2AA).
- [ ] Pakeitimams atitinka dokumentacijos atnaujinimai ([docs/DOCUMENTATION.md](DOCUMENTATION.md)).

### Prieš release

- [ ] CHANGELOG.md atnaujintas (SemVer).
- [ ] Versija atitinka pakeitimus.
- [ ] Rankinis QA: naršyklė, mobilus, kopijavimas, a11y (pagal [docs/TESTAVIMAS.md](TESTAVIMAS.md)).

### Po deploy (gyvas testavimas)

- [ ] Atliktas gyvas testavimas pagal [docs/TESTAVIMAS.md](TESTAVIMAS.md).
- [ ] Rezultatai įrašyti į testavimo žurnalą.

---

## 4. Komandos

| Komanda | Paskirtis |
|---------|-----------|
| `npm test` | Struktūros testai + HTML/JS lint |
| `npm run lint:html` | HTML validacija: **9 statiniai HTML** per `html-validate` ([scripts/lint-html.mjs](../scripts/lint-html.mjs)) |
| `npm run lint:js` | ESLint |
| A11y lokaliai | `npx serve -s . -l 3000`, `npx wait-on http://127.0.0.1:3000/`, tada `PA11Y_BASE=http://127.0.0.1:3000 node scripts/pa11y-pages.cjs` (keli URL, įskaitant root `/`; sąrašas – [scripts/pa11y-pages.cjs](../scripts/pa11y-pages.cjs)). Žr. [AGENTS.md](../AGENTS.md) §6. |

---

## 5. Susiję dokumentai

- [AGENTS.md](../AGENTS.md) – QA Agent rolė ir release seka  
- [docs/DOCUMENTATION.md](DOCUMENTATION.md) – dokumentų valdymas ir QA checklist  
- [docs/TESTAVIMAS.md](TESTAVIMAS.md) – gyvo testavimo scenarijai ir žurnalas  
- [DEPLOYMENT.md](../DEPLOYMENT.md) – deploy ir testavimas po deploy  

**Paskutinis atnaujinimas:** 2026-03-29
