# Gyvo testavimo dokumentacija

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)  
**Deploy:** žr. [DEPLOYMENT.md](../DEPLOYMENT.md)

Po kiekvieno deploy atlikti gyvą testavimą ir rezultatus įrašyti čia (arba nuoroda į atskirą žurnalą).

---

## 1. Testavimo aplinka

| Laukas | Reikšmė |
|--------|--------|
| Production URL | https://DITreneris.github.io/automation/ |
| Naršyklė(ės) | Chrome, Firefox, Safari, Edge |
| Mobilus | iOS Safari / Chrome Mobile (pasirinktinai) |

**Automatiniai testai lokaliai / CI:** `npm test` – struktūriniai testai ([tests/structure.test.js](../tests/structure.test.js)), HTML lint (`node scripts/lint-html.mjs`, preset `html-validate:document`, be išorinio W3C API), ESLint. Prieš PR: `npm test`.

---

## 2. Scenarijai (checklist)

### Funkcionalumas

- [ ] **Kopijavimas:** Visi 8 promptai – pasirinkti → „Kopijuoti promptą“ → įklijuoti į DI (pvz. ChatGPT) – tekstas teisingas.
- [ ] **Progresas:** „Pažymėjau kaip atlikau“ – varnelė įrašoma; perkrovus puslapį – progresas išsaugotas (localStorage).
- [ ] **Skip link:** Tab iki „Praleisti į turinį“ – Enter – fokusas pereina į pagrindinį turinį.
- [ ] **Privatumas:** Nuoroda į privatumas.html veikia; privatumas.html atsidaro ir rodo turinį.

### Prieinamumas (a11y)

- [ ] **Klaviatūra:** Navigacija Tab, Enter, Esc – veikia be įstrigimo.
- [ ] **Focus:** Matomas focus (pvz. focus-visible) ant mygtukų ir nuorodų.
- [ ] **Pa11y:** CI jau bėga; pasirinktinai lokaliai: `npx pa11y <production-url>/ --standard WCAG2AA --ignore "warning"`.

### Responsive / naršyklės

- [ ] **Desktop:** Veikia Chrome / Firefox / Edge (arba Safari).
- [ ] **Mobilus:** Veikia vienoje iš: iOS Safari, Chrome Mobile (layoutas, mygtukai, kopijavimas).

### Turinio / bullet-proof (META, INPUT, OUTPUT)

- [ ] **Struktūra:** Kiekvienas iš 8 promptų turi aiškius META, INPUT, OUTPUT blokus (kopijuojamas tekstas).
- [ ] **Copyable:** Į mainų atmintinę kopijuojamas tik META+INPUT+OUTPUT; instrukcijos (Naudok kai, Pakeisk prieš naudodamas, Ką daryti) rodomos atskirame bloke „Prieš naudojant“ ir nekopijuojamos.
- [ ] **Instrukcijos:** „Kaip naudoti“ ir footer aiškina: [ĮMONĖ]/[MANO ROLĖ] keisti; DI rolės keisti nereikia.
- [ ] **Turinio patikra:** Nukopijuoti 1–2 promptus, įklijuoti – įklijuotas tekstas tik META+INPUT+OUTPUT (žr. [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md)).

### Kiti

- [ ] Nėra console klaidų atidarius puslapį ir atlikus kopijavimą.
- [ ] Nuorodos nepalūžusios (pagrindinis, privatumas).

---

## 3. Testavimo žurnalas

Įrašykite kiekvieno gyvo testavimo rezultatus.

### Šablonas įrašui

```markdown
## YYYY-MM-DD – [v1.x.x] / po deploy

- **Testeris:** vardas arba „QA“
- **URL:** https://...
- **Naršyklė:** Chrome 1xx / Firefox 1xx / …
- **Rezultatas:** ✅ Visi kritiniai praeina | ⚠️ Problema: [aprašymas]
- **Pastabos:** (neprivaloma)
```

### Pavyzdys

```markdown
## 2026-02-18 – pirmas deploy

- **Testeris:** QA
- **URL:** https://DITreneris.github.io/03_uzduotys/
- **Naršyklė:** Chrome (desktop)
- **Rezultatas:** ✅ Kopijavimas, progresas, skip link, privatumas – OK. Console be klaidų.
- **Pastabos:** A11y tikrinta per CI (pa11y). Mobilus – planuojama kitame cikle.
```

---

## 4. Susiję

- [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md) – promptų kokybės standartas (META/INPUT/OUTPUT, bullet-proof)
- [QA_STANDARTAS.md](QA_STANDARTAS.md) – QA kriterijai ir nuoroda į spinoff01  
- [DEPLOYMENT.md](../DEPLOYMENT.md) – kaip deploy ir kad po deploy būtų testuojama gyvai  

**Paskutinis atnaujinimas:** 2026-03-29
