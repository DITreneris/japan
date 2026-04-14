# Deployment – DI Promptų Biblioteka

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

---

## 1. GitHub Pages (rekomenduojama)

### Pirmą kartą

**Svarbu:** žingsniai 1–2 turi būti atlikti **prieš** pirmą sėkmingą deploy (arba iškart po jo). Jei `push` paleidžia workflow anksčiau, nei Pages įjungtas su šaltiniu **GitHub Actions**, job **deploy** gali baigtis klaida `Failed to create deployment (status: 404)` / `HttpError: Not Found` – tai normalu, kol nustatymai neištaisyti.

1. Atidaryti repozitorijos **Settings** → **Pages** (pvz. [automation/settings/pages](https://github.com/DITreneris/automation/settings/pages)).
2. Skiltyje **Build and deployment** pasirinkti **GitHub Actions** (ne „Deploy from a branch“).
3. Išsaugoti / patvirtinti (jei GitHub prašo – vieną kartą patvirtinti `github-pages` aplinką: **Settings** → **Environments** → **github-pages**).
4. Po to **Actions** → **Deploy to GitHub Pages** → **Re-run failed jobs** (arba tuščias commit / `workflow_dispatch`).

Po `push` į `main` paleidžiamas workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml): `npm test`, tada deploy į GitHub Pages.

### URL

- Svetainė: `https://<org-or-username>.github.io/<repo-name>/`  
- Pvz.: `https://DITreneris.github.io/03_uzduotys/` (jei repo `03_uzduotys` organizacijoje `DITreneris`).
- **Production URL (šis repozitorijus):** `https://DITreneris.github.io/automation/`

### Rankinis deploy

- **Actions** → workflow **Deploy to GitHub Pages** → **Run workflow** (branch: `main`).

---

## 2. Lokalus tikrinimas prieš deploy

```bash
npm install
npm test
```

A11y (pasirinktinai):

```bash
npx serve -s . -l 3000
# Kitoje terminale:
npx pa11y http://localhost:3000/lt/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/en/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/et/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/lv/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/lt/privatumas.html --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/en/privacy.html --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/et/privacy.html --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/lv/privacy.html --standard WCAG2AA --ignore "warning"
```

---

## 3. Po deploy – gyvas testavimas

- Atlikti gyvą testavimą pagal [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md).
- Rezultatus įrašyti į testavimo žurnalą (tame pačiame faile arba susietame).

---

## 4. Troubleshooting

| Problema | Sprendimas |
|----------|------------|
| Pages rodo 404 | Patikrinti, ar Settings → Pages šaltinis = **GitHub Actions**. |
| Workflow nepaleidžiamas | Patikrinti, ar failas `.github/workflows/deploy.yml` yra `main` šakoje. |
| **Deploy workflow failed** | Actions → atidaryti nepavykusį run → žiūrėti **test** job: jei nepraėjo `npm test`, lokaliai paleisti `npm test` ir taisyti; jei nepraėjo **deploy** job – tikrinti environment/permissions. |
| **`Failed to create deployment (404)`** / `deploy-pages` **Not Found** | Dažniausiai Pages dar neįjungtas su šaltiniu **GitHub Actions**. Eiti į **Settings → Pages** ir pasirinkti **GitHub Actions**; tada pakartoti workflow ([Pages nustatymai](https://github.com/DITreneris/automation/settings/pages)). Retesnė priežastis: organizacijoje išjungtas GitHub Pages – reikia org/admin leidimo. |
| **CI workflow failed** | Dažniausiai `pa11y` (a11y klaidos) arba `npm test`. Lokaliai: `npm test`, tada `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/ --standard WCAG2AA`. |
| Svetainė tuščia / neteisingas kelias | Projektas – statinis iš root; `path: .` – teisingas. Svetainė turi `/lt/`, `/en/`, `/et/`, `/lv/`; root redirect nukreipia į kalbą. Jei naudojate subfolderį, pakeisti `path`. |

---

## 5. Susiję dokumentai

- [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) – QA standartas (nuoroda į spinoff01)
- [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) – gyvo testavimo dokumentacija
- [AGENTS.md](AGENTS.md) – release ir QA procesas
