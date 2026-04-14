# TODO – prioritetai (backlog)

**Paskirtis:** Prioritetizuotos užduotys, kurios nėra P0 MVP bloke ([MUST_TODO.md](MUST_TODO.md)), bet pagerina UX, a11y ar priežiūrą.  
**Atnaujinta:** 2026-03-29

**Daugiakalbystės P1–P2 (2026-03-29):** įgyvendinta – bendras [js/hreflang.js](js/hreflang.js), root `localStorage` ant rankinių nuorodų, privatumo kalbos jungiklis sutapatintas su biblioteka (`lang-link`, `<ul class="lang-switcher-list">`, `aria-current="page"`), PR šablono checkbox EN → `generate:et-lv`, CI pa11y ET/LV, struktūriniai testai. Išsamiai: [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md).

---

## P1 – verta padaryti netrukus

- [x] **Root `index.html` rankinės nuorodos** – `localStorage.setItem('lang', …)` ant `lt/`, `en/`, `et/`, `lv/` nuorodų.
- [x] **Privatumo puslapių kalbos jungiklis** – suvienodinta su biblioteka (`lang-link`, struktūra, fokusas).
- [x] **Procesas po EN pakeitimų** – [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) sekcija „Daugiakalbystė (kai liečia EN)“.

---

## P2 – pagerinimai (a11y / SEO kraštutiniai atvejai)

- [x] **Kalbos jungiklis** – `aria-current="page"` dabartinei kalbai.
- [x] **Semantika** – `<nav class="lang-switcher"><ul class="lang-switcher-list"><li>…` visuose 8 puslapiuose.
- [x] **`hreflang` bazės skaičiavimas** – centralizuota [js/hreflang.js](js/hreflang.js) (regex nuima `/(lt|en|et|lv)` ir viską po juo, įskaitant kelią be trailing slash).
- [x] **Bendras `js/hreflang.js`** – vienas failas, `data-hreflang-suite="library"` arba `"privacy"` ant `<html>`.

---

## P3 – turinys / kokybė

- [ ] **ET mikrotekstas** – peržiūrėti badge `aria-label` ir panašius tekstus (pvz. formuluočių natūralumas estiškai).
- [ ] **ET/LV privatumo politika** – juridinė / redaktoriaus peržiūra prieš oficialų release ne LT/EN rinkoms.

---

## Nuorodos

- Kritinės MVP užduotys: [MUST_TODO.md](MUST_TODO.md)
- Keliai ir sinchronizacija: [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md)
