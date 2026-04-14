'use strict';

/** ET/LV index + library.et.js, library.lv.js from en; library.lt.js from js/library.js via LT_JS_PAIRS. Run: npm run generate:et-lv */

const fs = require('fs');
const path = require('path');
const { ET_PROMPTS, LV_PROMPTS } = require('./prompt-bodies-et-lv.cjs');

const root = path.join(__dirname, '..');
const enPath = path.join(root, 'en', 'index.html');
/** Match generator search strings to file (en uses U+2019 in places). LF only for stable CI git diff. */
const en = fs
  .readFileSync(enPath, 'utf8')
  .replace(/\u2019/g, "'")
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n');

function writeUtf8Lf(filePath, content) {
  const normalized =
    typeof content === 'string'
      ? content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      : content;
  fs.writeFileSync(filePath, normalized, 'utf8');
}

function replacePromptBodies(html, map) {
  for (const id of Object.keys(map)) {
    const re = new RegExp(
      `<pre class="code-text" id="${id}">[\\s\\S]*?<\\/pre>`,
      ''
    );
    if (!re.test(html)) throw new Error('Missing pre#' + id);
    html = html.replace(
      re,
      `<pre class="code-text" id="${id}">${map[id]}</pre>`
    );
  }
  return html;
}

function applyPairs(html, pairs) {
  for (const [from, to] of pairs) {
    if (!html.includes(from)) {
      throw new Error('Missing substring: ' + from.slice(0, 90).replace(/\n/g, '\\n'));
    }
    html = html.split(from).join(to);
  }
  return html;
}

const ET_NAV = `                <nav class="lang-switcher" aria-label="Keel">
                    <ul class="lang-switcher-list">
                        <li><a href="../lt/" class="lang-link" data-lang="lt" onclick="try{localStorage.setItem('lang','lt')}catch(e){}">Lietuvių</a></li>
                        <li><a href="../en/" class="lang-link" data-lang="en" onclick="try{localStorage.setItem('lang','en')}catch(e){}">English</a></li>
                        <li><span class="lang-current" aria-current="page">Eesti</span></li>
                        <li><a href="../lv/" class="lang-link" data-lang="lv" onclick="try{localStorage.setItem('lang','lv')}catch(e){}">Latviešu</a></li>
                    </ul>
                </nav>`;

const LANG_NAV_RE = /<nav class="lang-switcher"[^>]*>[\s\S]*?<\/nav>/;

const LV_NAV = `                <nav class="lang-switcher" aria-label="Valoda">
                    <ul class="lang-switcher-list">
                        <li><a href="../lt/" class="lang-link" data-lang="lt" onclick="try{localStorage.setItem('lang','lt')}catch(e){}">Lietuvių</a></li>
                        <li><a href="../en/" class="lang-link" data-lang="en" onclick="try{localStorage.setItem('lang','en')}catch(e){}">English</a></li>
                        <li><a href="../et/" class="lang-link" data-lang="et" onclick="try{localStorage.setItem('lang','et')}catch(e){}">Eesti</a></li>
                        <li><span class="lang-current" aria-current="page">Latviešu</span></li>
                    </ul>
                </nav>`;

/** Longest / most specific first. (Nav is replaced via LANG_NAV_RE before applyPairs.) */
const ET_PAIRS = [
  ['<html lang="en" data-hreflang-suite="library">', '<html lang="et" data-hreflang-suite="library">'],
  [
    'Let AI do 30–50% of your daily tasks – Prompt Anatomy',
    'Laske tehisintellektil teha 30–50% teie igapäevastest ülesannetest – Prompti anatoomia',
  ],
  [
    "<style>:root { --codeblock-copy-hint: 'Select and copy'; }</style>",
    "<style>:root { --codeblock-copy-hint: 'Valige ja kopeerige'; }</style>",
  ],
  [
    '<a href="#main-content" class="skip-link">Skip to content</a>',
    '<a href="#main-content" class="skip-link">Otse sisuni</a>',
  ],
  [
    'aria-label="Full Prompt Anatomy – interactive course (opens in new tab)">Prompt Anatomy</a>',
    'aria-label="Täielik Prompt Anatomy – interaktiivne kursus (avaneb uuel kaardil)">Prompt Anatomy</a>',
  ],
  [
    'aria-label="Prompt Anatomy spin-off project">Spin-off No. 1</span>',
    'aria-label="Prompt Anatomy spin-off projekt">Spin-off nr 1</span>',
  ],
  ['<h1>Let AI do 30–50% of your daily tasks</h1>', '<h1>Laske tehisintellektil teha 30–50% teie igapäevastest ülesannetest</h1>'],
  ['<p>8 exercises with ready-made templates – results in minutes.</p>', '<p>8 harjutust valmis mallidega – tulemused minutitega.</p>'],
  [
    'aria-label="Who it\'s for">Who it\'s for: Managers, specialists, consultants, freelancers.</p>',
    'aria-label="Kellele">Kellele: juhtidele, spetsialistidele, konsultantidele, vabakutselistele.</p>',
  ],
  [
    'aria-label="Start for free – go to first prompt">Start for free</a>',
    'aria-label="Alustage tasuta – minge esimese prompti juurde">Alustage tasuta</a>',
  ],
  [
    'aria-label="Join the community – Telegram">Join the community</a>',
    'aria-label="Liituge kogukonnaga – Telegramis">Liituge kogukonnaga</a>',
  ],
  [
    '<h2 id="objectives-title"><i data-lucide="target" aria-hidden="true"></i> What you get</h2>',
    '<h2 id="objectives-title"><i data-lucide="target" aria-hidden="true"></i> Mida saate</h2>',
  ],
  [
    `<p class="objectives-intro">In 30 minutes you'll have a basic AI workflow:</p>`,
    '<p class="objectives-intro">30 minutiga omandate põhjaliku tehisintellekti töövoo:</p>',
  ],
  ['<li><i data-lucide="check" aria-hidden="true"></i> 3–5 hours saved per week</li>', '<li><i data-lucide="check" aria-hidden="true"></i> 3–5 tundi nädalas säästetud aega</li>'],
  ['<li><i data-lucide="check" aria-hidden="true"></i> Up to 6× lower error risk</li>', '<li><i data-lucide="check" aria-hidden="true"></i> Kuni 6× väiksem veaoht</li>'],
  ['<li><i data-lucide="check" aria-hidden="true"></i> 8 standardized templates</li>', '<li><i data-lucide="check" aria-hidden="true"></i> 8 standardiseeritud malli</li>'],
  [
    '<li><i data-lucide="check" aria-hidden="true"></i> Clear automation logic instead of chaotic prompts</li>',
    '<li><i data-lucide="check" aria-hidden="true"></i> Selge automatiseerimise loogika kaootiliste promptide asemel</li>',
  ],
  [
    '<span>How to use this library</span>',
    '<span>Kuidas seda kogu kasutada</span>',
  ],
  [
    'aria-label="Approx. time: 3–5 min per step">~3–5 min per step</span>',
    'aria-label="Orienteeruv aeg: 3–5 min sammu kohta">~3–5 min sammu kohta</span>',
  ],
  [
    '<li>Choose a prompt and click it – the text will be selected</li>',
    '<li>Valige prompt ja klõpsake sellel – tekst märgistatakse</li>',
  ],
  [
    '<li>Click <strong>“Copy prompt”</strong> or use <code>Ctrl+C</code> / <code>Cmd+C</code></li>',
    '<li>Klõpsake <strong>„Kopeerige prompt“</strong> või kasutage <code>Ctrl+C</code> / <code>Cmd+C</code></li>',
  ],
  [
    '<li>Paste into ChatGPT, Claude or another AI tool</li>',
    '<li>Kleepige ChatGPT-sse, Claudesse või teise tehisintellekti tööriista</li>',
  ],
  [
    `<li>If the prompt has <code>[COMPANY]</code> – replace with your or your client's company; if <code>[MY ROLE]</code> – replace with your role. The AI role (e.g. “critical analyst”) is already in the prompt – no need to change it.</li>`,
    '<li>Kui promptis on <code>[ETTEVÕTE]</code> – asendage oma või kliendi ettevõtte nimega; kui <code>[MINU ROLL]</code> – asendage oma ametinimetusega. Tehisintellekti roll (nt „kriitiline analüütik“) on juba promptis – seda muutma ei pea.</li>',
  ],
  [
    `<p id="progressText">You've used 0 of 8 prompts</p>`,
    '<p id="progressText">Olete kasutanud 0/8 prompti</p>',
  ],
  ['aria-label="Progress">', 'aria-label="Edenemine">'],
  ['<div class="category">Foundation</div>', '<div class="category">Alused</div>'],
  ['<h2 class="prompt-title">AI Context Check</h2>', '<h2 class="prompt-title">Tehisintellekti konteksti kontroll</h2>'],
  [
    '<p class="prompt-desc">Check what ChatGPT knows about your organization and where it might go wrong</p>',
    '<p class="prompt-desc">Kontrollige, mida ChatGPT teie organisatsiooni kohta teab ja kus võib eksida</p>',
  ],
  ['aria-label="Select and copy prompt 1"', 'aria-label="Valige ja kopeerige prompt 1"'],
  ['<h3 class="before-use-title" id="before-use-title-1">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-1">Enne kasutamist</h3>'],
  [
    `<p><strong>Use when:</strong> you start analyzing an organization; you want to check what the AI knows about the company; you're preparing to use AI with context.</p>`,
    '<p><strong>Kasutage, kui:</strong> alustate organisatsiooni analüüsi; soovite kontrollida, mida tehisintellekt ettevõtte kohta teab; valmistute tehisintellekti kontekstis kasutamiseks.</p>',
  ],
  ['<p><strong>Replace before using:</strong></p>', '<p><strong>Enne kasutamist asendage:</strong></p>'],
  [
    `<li>[COMPANY] → your or your client's company (e.g. Acme Inc).</li>`,
    '<li>[ETTEVÕTE] → teie või kliendi ettevõte (nt Acme Inc).</li>',
  ],
  [
    '<p><strong>What to do:</strong> This is not a questionnaire. Copy the text below and paste it into ChatGPT or Claude.</p>',
    '<p><strong>Mida teha:</strong> See ei ole küsimustik. Kopeerige allolev tekst ja kleepige ChatGPT-sse või Claudesse.</p>',
  ],
  [
    '<p><strong>What to do:</strong> Copy the text below and paste it into ChatGPT or Claude.</p>',
    '<p><strong>Mida teha:</strong> Kopeerige allolev tekst ja kleepige ChatGPT-sse või Claudesse.</p>',
  ],
  ['aria-label="Information about this prompt">', 'aria-label="Teave selle prompti kohta">'],
  ['<strong>Why it matters</strong>', '<strong>Miks see loeb</strong>'],
  [
    '<p>Reduces AI “hallucinations” and wrong decisions – you see clearly what the AI actually knows about your context.</p>',
    '<p>Vähendab tehisintellekti „hallutsinatsioone“ ja valesid otsuseid – näete selgelt, mida tehisintellekt teie konteksti kohta tegelikult teab.</p>',
  ],
  ['aria-label="Copy prompt 1 to clipboard"', 'aria-label="Kopeerige prompt 1 lõikelauale"'],
  ['<span>Copy prompt</span>', '<span>Kopeerige prompt</span>'],
  ['aria-label="Mark this step as done"', 'aria-label="Märkige see samm tehtuks"'],
  ['<span>Mark as done</span>', '<span>Märkige tehtuks</span>'],
  ['<div class="category">Analysis</div>', '<div class="category">Analüüs</div>'],
  ['<h2 class="prompt-title">Organization Portrait</h2>', '<h2 class="prompt-title">Organisatsiooni portree</h2>'],
  ['<p class="prompt-desc">Build a clear profile and context of your organization</p>', '<p class="prompt-desc">Ehitage selge profiil ja kontekst teie organisatsioonist</p>'],
  ['aria-label="Select and copy prompt 2"', 'aria-label="Valige ja kopeerige prompt 2"'],
  ['<h3 class="before-use-title" id="before-use-title-2">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-2">Enne kasutamist</h3>'],
  [
    `<p><strong>Use when:</strong> you want a clear organization profile; you're preparing context for other prompts; you're analyzing a client or partner.</p>`,
    '<p><strong>Kasutage, kui:</strong> soovite selget organisatsiooni profiili; valmistute teiste promptide konteksti jaoks; analüüsite klienti või partnerit.</p>',
  ],
  ['<strong>Application</strong>', '<strong>Rakendus</strong>'],
  [
    '<p>This prompt creates organization context that will be used in all other prompts.</p>',
    '<p>See prompt loob organisatsiooni konteksti, mida kasutatakse kõigis teistes promptides.</p>',
  ],
  ['aria-label="Copy prompt 2 to clipboard"', 'aria-label="Kopeerige prompt 2 lõikelauale"'],
  ['aria-label="Select and copy prompt 3"', 'aria-label="Valige ja kopeerige prompt 3"'],
  ['<div class="category">Role</div>', '<div class="category">Roll</div>'],
  ['<h2 class="prompt-title">My Role in the Organization</h2>', '<h2 class="prompt-title">Minu roll organisatsioonis</h2>'],
  [
    `<p class="prompt-desc">Clearly define your role's purpose, responsibilities and impact</p>`,
    '<p class="prompt-desc">Määratlege selgelt teie rolli eesmärk, vastutus ja mõju</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-3">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-3">Enne kasutamist</h3>'],
  [
    `<p><strong>Use when:</strong> you want to clarify your role; you're starting with a new company; you need a reference for your position.</p>`,
    '<p><strong>Kasutage, kui:</strong> soovite oma rolli selgitada; alustate uue ettevõttega; vajate oma ameti jaoks viiteteksti.</p>',
  ],
  [
    `<li>[COMPANY] → your or your client's company (e.g. Acme Inc);</li>`,
    '<li>[ETTEVÕTE] → teie või kliendi ettevõte (nt Acme Inc);</li>',
  ],
  [
    '<li>[MY ROLE] → your job title (e.g. Sales Manager).</li>',
    '<li>[MINU ROLL] → teie ametinimetus (nt müügijuht).</li>',
  ],
  ['<strong>Result</strong>', '<strong>Tulemus</strong>'],
  [
    '<p>You get a clear role description – use it as a reference for the next steps.</p>',
    '<p>Saate selge rollikirjelduse – kasutage seda järgmiste sammude jaoks.</p>',
  ],
  ['aria-label="Copy prompt 3 to clipboard"', 'aria-label="Kopeerige prompt 3 lõikelauale"'],
  ['aria-label="Select and copy prompt 4"', 'aria-label="Valige ja kopeerige prompt 4"'],
  ['<div class="category">Document</div>', '<div class="category">Dokument</div>'],
  ['<h2 class="prompt-title">Job Description + KPI</h2>', '<h2 class="prompt-title">Ametijuhend + KPI</h2>'],
  ['<p class="prompt-desc">Create a practical job description with KPIs</p>', '<p class="prompt-desc">Looge praktiline ametijuhend koos KPI-dega</p>'],
  ['<h3 class="before-use-title" id="before-use-title-4">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-4">Enne kasutamist</h3>'],
  [
    `<p><strong>Use when:</strong> you need a job description; you're preparing for review or onboarding; you want measurable KPIs.</p>`,
    '<p><strong>Kasutage, kui:</strong> vajate ametijuhendit; valmistute ülevaatuseks või sisseelamiseks; soovite mõõdetavaid KPI-sid.</p>',
  ],
  ['<strong>Practical value</strong>', '<strong>Praktiline väärtus</strong>'],
  [
    '<p>This document can be used for self-assessment or onboarding new employees.</p>',
    '<p>Seda dokumenti saab kasutada enesehindluseks või uute töötajate sisseelamiseks.</p>',
  ],
  ['aria-label="Copy prompt 4 to clipboard"', 'aria-label="Kopeerige prompt 4 lõikelauale"'],
  ['aria-label="Select and copy prompt 5"', 'aria-label="Valige ja kopeerige prompt 5"'],
  ['<div class="category">Processes</div>', '<div class="category">Protsessid</div>'],
  ['<h2 class="prompt-title">Core Work Processes</h2>', '<h2 class="prompt-title">Põhitööprotsessid</h2>'],
  [
    '<p class="prompt-desc">Identify where time and energy go (Pareto 80/20)</p>',
    '<p class="prompt-desc">Tuvastage, kuhu läheb aeg ja energia (Pareto 80/20)</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-5">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-5">Enne kasutamist</h3>'],
  [
    '<p><strong>Use when:</strong> you want to see where time goes; optimize your workday; prepare for AI integration.</p>',
    '<p><strong>Kasutage, kui:</strong> soovite näha, kuhu aeg läheb; optimeerite tööpäeva; valmistute tehisintellekti lõimimiseks.</p>',
  ],
  ['<strong>Optimization</strong>', '<strong>Optimeerimine</strong>'],
  [
    '<p>Once you understand the processes, you can see where AI will have the biggest impact.</p>',
    '<p>Kui protsessid on selged, näete, kus tehisintellektil on suurim mõju.</p>',
  ],
  ['aria-label="Copy prompt 5 to clipboard"', 'aria-label="Kopeerige prompt 5 lõikelauale"'],
  ['aria-label="Select and copy prompt 6"', 'aria-label="Valige ja kopeerige prompt 6"'],
  ['<div class="category">AI Integration</div>', '<div class="category">Tehisintellekt</div>'],
  ['<h2 class="prompt-title">AI Help and Optimization</h2>', '<h2 class="prompt-title">Tehisintellekti abi ja optimeerimine</h2>'],
  [
    '<p class="prompt-desc">Turn AI into a real work assistant – concrete ideas based on your processes</p>',
    '<p class="prompt-desc">Muutke tehisintellekt tõeliseks tööabiliseks – konkreetsed ideed teie protsesside põhjal</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-6">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-6">Enne kasutamist</h3>'],
  [
    '<p><strong>Use when:</strong> you already have process descriptions (step 5); you want concrete ways to use AI; you want to save time.</p>',
    '<p><strong>Kasutage, kui:</strong> teil on juba protsessikirjeldused (samm 5); soovite konkreetseid viise tehisintellekti kasutamiseks; soovite aega säästa.</p>',
  ],
  ['<strong>Real impact</strong>', '<strong>Tegelik mõju</strong>'],
  [
    '<p>This prompt helps identify specific places where AI can save hours per week.</p>',
    '<p>See prompt aitab leida konkreetseid kohti, kus tehisintellekt võib nädalas tunde säästa.</p>',
  ],
  ['aria-label="Copy prompt 6 to clipboard"', 'aria-label="Kopeerige prompt 6 lõikelauale"'],
  ['aria-label="Select and copy prompt 7"', 'aria-label="Valige ja kopeerige prompt 7"'],
  ['<div class="category">Library</div>', '<div class="category">Kogu</div>'],
  ['<h2 class="prompt-title">Daily Prompt Library</h2>', '<h2 class="prompt-title">Igapäevane promptide kogu</h2>'],
  [
    '<p class="prompt-desc">Ready-made prompts for daily work and challenges</p>',
    '<p class="prompt-desc">Valmis promptid igapäevatööks ja väljakutseteks</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-7">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-7">Enne kasutamist</h3>'],
  [
    '<p><strong>Use when:</strong> you want personal prompts; for daily work and quick decisions; you want a [prompt | when | problem] table.</p>',
    '<p><strong>Kasutage, kui:</strong> soovite isiklikke prompte; igapäevatööks ja kiirete otsuste jaoks; soovite tabelit veergudega <code>[KÜSITIS]</code> | <code>[MILLAL KASUTAN]</code> | <code>[MILLISE PROBLEEMI LAHENDAB]</code>.</p>',
  ],
  ['<strong>Daily improvement</strong>', '<strong>Igapäevane areng</strong>'],
  [
    '<p>You get a personal prompt collection – use it every day without extra thinking.</p>',
    '<p>Saate isikliku promptide kogu – kasutage iga päev ilma lisamõtlemiseta.</p>',
  ],
  ['aria-label="Copy prompt 7 to clipboard"', 'aria-label="Kopeerige prompt 7 lõikelauale"'],
  ['aria-label="Select and copy prompt 8"', 'aria-label="Valige ja kopeerige prompt 8"'],
  ['<div class="category">Simulation</div>', '<div class="category">Simulatsioon</div>'],
  ['<h2 class="prompt-title">Critical Situation Simulation</h2>', '<h2 class="prompt-title">Kriitilise olukorra simulatsioon</h2>'],
  [
    '<p class="prompt-desc">Prepare for pressure and uncertainty in advance</p>',
    '<p class="prompt-desc">Valmistuge surveks ja ebakindluseks ette</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-8">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-8">Enne kasutamist</h3>'],
  [
    '<p><strong>Use when:</strong> you want to prepare for crises; plan a response to pressure; train decisions with AI.</p>',
    '<p><strong>Kasutage, kui:</strong> soovite valmistuda kriisideks; planeerida reaktsiooni survele; treenida otsuseid tehisintellektiga.</p>',
  ],
  ['<strong>Readiness</strong>', '<strong>Valmidus</strong>'],
  [
    '<p>Simulations help you learn to manage crises before they happen. Better to practice with AI than in a real situation.</p>',
    '<p>Simulatsioonid aitavad õppida kriise juhtima enne, kui need juhtuvad. Parem harjutada tehisintellektiga kui päris olukorras.</p>',
  ],
  ['aria-label="Copy prompt 8 to clipboard"', 'aria-label="Kopeerige prompt 8 lõikelauale"'],
  [`<h2 id="next-steps-title">What's next?</h2>`, '<h2 id="next-steps-title">Mis edasi?</h2>'],
  [
    '<p>Best to go in order from 1 to 8. Click a link to jump to that prompt.</p>',
    '<p>Parim on minna järjekorras 1–8. Klõpsake lingil, et hüpata selle prompti juurde.</p>',
  ],
  ['<a href="#block1">1. Context check</a>', '<a href="#block1">1. Konteksti kontroll</a>'],
  ['<a href="#block2">2. Organization portrait</a>', '<a href="#block2">2. Organisatsiooni portree</a>'],
  ['<a href="#block3">3. My role</a>', '<a href="#block3">3. Minu roll</a>'],
  ['<a href="#block4">4. Job description + KPI</a>', '<a href="#block4">4. Ametijuhend + KPI</a>'],
  ['<a href="#block5">5. Work processes</a>', '<a href="#block5">5. Tööprotsessid</a>'],
  ['<a href="#block6">6. AI optimization</a>', '<a href="#block6">6. Tehisintellekti optimeerimine</a>'],
  ['<a href="#block7">7. Daily library</a>', '<a href="#block7">7. Igapäevane kogu</a>'],
  ['<a href="#block8">8. Critical situation simulation</a>', '<a href="#block8">8. Kriitilise olukorra simulatsioon</a>'],
  [
    '<h2 id="community-title">Want more?<br>Join us on Telegram.</h2>',
    '<h2 id="community-title">Soovite rohkem?<br>Liituge Telegramis.</h2>',
  ],
  [
    '<p>Shared discussions, tips and news about prompts and AI.</p>',
    '<p>Ühised arutelud, nõuanded ja uudised promptide ja tehisintellekti kohta.</p>',
  ],
  [
    'aria-label="Open Prompt Anatomy Telegram channel in new tab">Join Telegram</a>',
    'aria-label="Ava Prompt Anatomy Telegram uuel kaardil">Liitu Telegramiga</a>',
  ],
  [
    'aria-label="Full Prompt Anatomy – interactive course (opens in new tab)">Prompt Anatomy →</a>',
    'aria-label="Täielik Prompt Anatomy – interaktiivne kursus (avaneb uuel kaardil)">Prompt Anatomy →</a>',
  ],
  [
    '<h3>Good luck with your prompts <i data-lucide="rocket" aria-hidden="true"></i></h3>',
    '<h3>Edu promptidega <i data-lucide="rocket" aria-hidden="true"></i></h3>',
  ],
  [
    '<p>If the prompt has [COMPANY] or [MY ROLE] – replace with your details. The AI role (e.g. “critical analyst”) is already set – no need to change it.</p>',
    '<p>Kui promptis on [ETTEVÕTE] või [MINU ROLL] – asendage oma andmetega. Tehisintellekti roll (nt „kriitiline analüütik“) on juba seatud – seda muutma ei pea.</p>',
  ],
  [
    '<p class="footer-product-link">This is <strong>Spin-off No. 1</strong> from “Prompt Anatomy”. Full interactive course and more: <a href="https://www.promptanatomy.app/en" target="_blank" rel="noopener noreferrer">Prompt Anatomy →</a></p>',
    '<p class="footer-product-link">See on <strong>Spin-off nr 1</strong> projektist „Prompt Anatomy“. Täielik interaktiivne kursus ja rohkem: <a href="https://www.promptanatomy.app/en" target="_blank" rel="noopener noreferrer">Prompt Anatomy →</a></p>',
  ],
  ['<span class="tag" role="listitem"><i data-lucide="bot" aria-hidden="true"></i> AI-optimized</span>', '<span class="tag" role="listitem"><i data-lucide="bot" aria-hidden="true"></i> Tehisintellektile optimeeritud</span>'],
  ['<span class="tag" role="listitem"><i data-lucide="book-marked" aria-hidden="true"></i> 8 prompts</span>', '<span class="tag" role="listitem"><i data-lucide="book-marked" aria-hidden="true"></i> 8 prompti</span>'],
  ['<span class="tag" role="listitem"><i data-lucide="zap" aria-hidden="true"></i> Quick start</span>', '<span class="tag" role="listitem"><i data-lucide="zap" aria-hidden="true"></i> Kiire start</span>'],
  ['<span class="tag" role="listitem"><i data-lucide="target" aria-hidden="true"></i> Results</span>', '<span class="tag" role="listitem"><i data-lucide="target" aria-hidden="true"></i> Tulemused</span>'],
  [
    '<p>&copy; 2026 Tomas Staniulis. Training material. All rights reserved. <a href="privacy.html">Privacy</a></p>',
    '<p>&copy; 2026 Tomas Staniulis. Õppematerjal. Kõik õigused kaitstud. <a href="privacy.html">Privaatsus</a></p>',
  ],
  ['aria-label="Copy text field"', 'aria-label="Kopeerimisväli"'],
  ['aria-label="Copy notification">', 'aria-label="Kopeerimisteade">'],
  ['<span>Copied</span>', '<span>Kopeeritud</span>'],
];

/** Estonian replacements for js/library.js only */
const ET_JS_PAIRS = [
  [
    "button.innerHTML = '<i data-lucide=\"check\" aria-hidden=\"true\"></i><span>Copied</span>';",
    "button.innerHTML = '<i data-lucide=\"check\" aria-hidden=\"true\"></i><span>Kopeeritud</span>';",
  ],
  [
    "showError(button, 'Something went wrong. Try copying again.');",
    "showError(button, 'Midagi läks valesti. Proovige uuesti kopeerida.');",
  ],
  [
    "showError(button, 'Something went wrong. Try copying again. Select the text and use Ctrl+C (or Cmd+C).');",
    "showError(button, 'Midagi läks valesti. Proovige uuesti. Valige tekst ja kasutage Ctrl+C (või Cmd+C).');",
  ],
  [
    "showError(button, 'Copy didn\\'t work. Select the text and use Ctrl+C (or Cmd+C).');",
    "showError(button, 'Kopeerimine ei õnnestunud. Valige tekst ja kasutage Ctrl+C (või Cmd+C).');",
  ],
  [
    "button.setAttribute('aria-label', 'Prompt copied successfully');",
    "button.setAttribute('aria-label', 'Prompt edukalt kopeeritud');",
  ],
  [
    "button.setAttribute('aria-label', `Copy prompt ${promptId.replace('prompt', '')} to clipboard`);",
    "button.setAttribute('aria-label', `Kopeerige prompt ${promptId.replace('prompt', '')} lõikelauale`);",
  ],
  [
    "const errorMessage = message || 'Something went wrong. Try copying again.';",
    "const errorMessage = message || 'Midagi läks valesti. Proovige uuesti kopeerida.';",
  ],
  [
    "if (textEl) textEl.textContent = count === 8 ? 'Great – you\\'ve used all 8.' : 'You\\'ve used ' + count + ' of 8 prompts.';",
    "if (textEl) textEl.textContent = count === 8 ? 'Suurepärane – olete kasutanud kõiki kaheksat prompti.' : 'Olete kasutanud ' + count + '/8 prompti.';",
  ],
];

/** Latvian UI pairs. */
const LV_PAIRS = [
  ['<html lang="en" data-hreflang-suite="library">', '<html lang="lv" data-hreflang-suite="library">'],
  [
    'Let AI do 30–50% of your daily tasks – Prompt Anatomy',
    'Ļaujiet MI veikt 30–50% no jūsu ikdienas uzdevumiem – Prompt Anatomy',
  ],
  [
    "<style>:root { --codeblock-copy-hint: 'Select and copy'; }</style>",
    "<style>:root { --codeblock-copy-hint: 'Atlasiet un kopējiet'; }</style>",
  ],
  [
    '<a href="#main-content" class="skip-link">Skip to content</a>',
    '<a href="#main-content" class="skip-link">Tieši uz saturu</a>',
  ],
  [
    'aria-label="Full Prompt Anatomy – interactive course (opens in new tab)">Prompt Anatomy</a>',
    'aria-label="Pilnā Prompt Anatomy – interaktīvs kurss (atveras jaunā cilnē)">Prompt Anatomy</a>',
  ],
  [
    'aria-label="Prompt Anatomy spin-off project">Spin-off No. 1</span>',
    'aria-label="Prompt Anatomy spin-off projekts">Spin-off Nr. 1</span>',
  ],
  ['<h1>Let AI do 30–50% of your daily tasks</h1>', '<h1>Ļaujiet MI veikt 30–50% no jūsu ikdienas uzdevumiem</h1>'],
  ['<p>8 exercises with ready-made templates – results in minutes.</p>', '<p>8 vingrinājumi ar gataviem veidnēm – rezultāti dažu minūšu laikā.</p>'],
  [
    'aria-label="Who it\'s for">Who it\'s for: Managers, specialists, consultants, freelancers.</p>',
    'aria-label="Kam">Kam: vadītājiem, speciālistiem, konsultantiem, brīvmāksliniekiem.</p>',
  ],
  [
    'aria-label="Start for free – go to first prompt">Start for free</a>',
    'aria-label="Sākt bez maksas – pāriet pie pirmā prompta">Sākt bez maksas</a>',
  ],
  [
    'aria-label="Join the community – Telegram">Join the community</a>',
    'aria-label="Pievienoties kopienai – Telegram">Pievienoties kopienai</a>',
  ],
  [
    '<h2 id="objectives-title"><i data-lucide="target" aria-hidden="true"></i> What you get</h2>',
    '<h2 id="objectives-title"><i data-lucide="target" aria-hidden="true"></i> Ko iegūstat</h2>',
  ],
  [
    `<p class="objectives-intro">In 30 minutes you'll have a basic AI workflow:</p>`,
    '<p class="objectives-intro">30 minūtēs iegūsiet pamata MI darba plūsmu:</p>',
  ],
  ['<li><i data-lucide="check" aria-hidden="true"></i> 3–5 hours saved per week</li>', '<li><i data-lucide="check" aria-hidden="true"></i> 3–5 stundas ietaupītas nedēļā</li>'],
  ['<li><i data-lucide="check" aria-hidden="true"></i> Up to 6× lower error risk</li>', '<li><i data-lucide="check" aria-hidden="true"></i> Līdz 6× mazāks kļūdu risks</li>'],
  ['<li><i data-lucide="check" aria-hidden="true"></i> 8 standardized templates</li>', '<li><i data-lucide="check" aria-hidden="true"></i> 8 standartizētas veidnes</li>'],
  [
    '<li><i data-lucide="check" aria-hidden="true"></i> Clear automation logic instead of chaotic prompts</li>',
    '<li><i data-lucide="check" aria-hidden="true"></i> Skaidra automatizācijas loģika nevis haotiski prompti</li>',
  ],
  ['<span>How to use this library</span>', '<span>Kā lietot šo bibliotēku</span>'],
  [
    'aria-label="Approx. time: 3–5 min per step">~3–5 min per step</span>',
    'aria-label="Orientējošais laiks: 3–5 min uz soli">~3–5 min uz soli</span>',
  ],
  ['<li>Choose a prompt and click it – the text will be selected</li>', '<li>Izvēlieties promptu un noklikšķiniet – teksts tiks atlasīts</li>'],
  [
    '<li>Click <strong>“Copy prompt”</strong> or use <code>Ctrl+C</code> / <code>Cmd+C</code></li>',
    '<li>Nospiediet <strong>„Kopēt promptu“</strong> vai izmantojiet <code>Ctrl+C</code> / <code>Cmd+C</code></li>',
  ],
  ['<li>Paste into ChatGPT, Claude or another AI tool</li>', '<li>Ielīmējiet ChatGPT, Claude vai citā MI rīkā</li>'],
  [
    `<li>If the prompt has <code>[COMPANY]</code> – replace with your or your client's company; if <code>[MY ROLE]</code> – replace with your role. The AI role (e.g. “critical analyst”) is already in the prompt – no need to change it.</li>`,
    '<li>Ja promptā ir <code>[UZŅĒMUMS]</code> – aizstājiet ar savu vai klienta uzņēmuma nosaukumu; ja <code>[MANA LOMA]</code> – ar savu amatu. MI loma (piem. „kritisks analītiķis“) jau ir promptā – mainīt nav jā.</li>',
  ],
  [`<p id="progressText">You've used 0 of 8 prompts</p>`, '<p id="progressText">Lietojāt 0 no 8 promptiem</p>'],
  ['aria-label="Progress">', 'aria-label="Progresss">'],
  ['<div class="category">Foundation</div>', '<div class="category">Pamati</div>'],
  ['<h2 class="prompt-title">AI Context Check</h2>', '<h2 class="prompt-title">MI konteksta pārbaude</h2>'],
  [
    '<p class="prompt-desc">Check what ChatGPT knows about your organization and where it might go wrong</p>',
    '<p class="prompt-desc">Pārbaudiet, ko ChatGPT zina par jūsu organizāciju un kur var kļūdīties</p>',
  ],
  ['aria-label="Select and copy prompt 1"', 'aria-label="Atlasīt un kopēt promptu 1"'],
  ['<h3 class="before-use-title" id="before-use-title-1">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-1">Pirms lietošanas</h3>'],
  [
    `<p><strong>Use when:</strong> you start analyzing an organization; you want to check what the AI knows about the company; you're preparing to use AI with context.</p>`,
    '<p><strong>Lietojiet, kad:</strong> sākat analizēt organizāciju; vēlaties pārbaudīt, ko MI zina par uzņēmumu; gatavojaties lietot MI ar kontekstu.</p>',
  ],
  ['<p><strong>Replace before using:</strong></p>', '<p><strong>Pirms lietošanas aizstājiet:</strong></p>'],
  [
    `<li>[COMPANY] → your or your client's company (e.g. Acme Inc).</li>`,
    '<li>[UZŅĒMUMS] → jūsu vai klienta uzņēmums (piem. Acme Inc).</li>',
  ],
  [
    '<p><strong>What to do:</strong> This is not a questionnaire. Copy the text below and paste it into ChatGPT or Claude.</p>',
    '<p><strong>Ko darīt:</strong> Tas nav jautājumu saraksts. Kopējiet zemāk esošo tekstu un ielīmējiet ChatGPT vai Claude.</p>',
  ],
  [
    '<p><strong>What to do:</strong> Copy the text below and paste it into ChatGPT or Claude.</p>',
    '<p><strong>Ko darīt:</strong> Kopējiet zemāk esošo tekstu un ielīmējiet ChatGPT vai Claude.</p>',
  ],
  ['aria-label="Information about this prompt">', 'aria-label="Informācija par šo promptu">'],
  ['<strong>Why it matters</strong>', '<strong>Kāpēc tas svarīgi</strong>'],
  [
    '<p>Reduces AI “hallucinations” and wrong decisions – you see clearly what the AI actually knows about your context.</p>',
    '<p>Samazina MI „halucinācijas“ un nepareizus lēmumus – skaidri redzat, ko MI patiesi zina par jūsu kontekstu.</p>',
  ],
  ['aria-label="Copy prompt 1 to clipboard"', 'aria-label="Kopēt promptu 1 starpliktuvē"'],
  ['<span>Copy prompt</span>', '<span>Kopēt promptu</span>'],
  ['aria-label="Mark this step as done"', 'aria-label="Atzīmēt šo soli kā izdarītu"'],
  ['<span>Mark as done</span>', '<span>Atzīmēt kā izdarītu</span>'],
  ['<div class="category">Analysis</div>', '<div class="category">Analīze</div>'],
  ['<h2 class="prompt-title">Organization Portrait</h2>', '<h2 class="prompt-title">Organizācijas portrets</h2>'],
  ['<p class="prompt-desc">Build a clear profile and context of your organization</p>', '<p class="prompt-desc">Izveidojiet skaidru profilu un kontekstu par savu organizāciju</p>'],
  ['aria-label="Select and copy prompt 2"', 'aria-label="Atlasīt un kopēt promptu 2"'],
  ['<h3 class="before-use-title" id="before-use-title-2">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-2">Pirms lietošanas</h3>'],
  [
    `<p><strong>Use when:</strong> you want a clear organization profile; you're preparing context for other prompts; you're analyzing a client or partner.</p>`,
    '<p><strong>Lietojiet, kad:</strong> vēlaties skaidru organizācijas profilu; gatavojat kontekstu citiem promptiem; analizējat klientu vai partneri.</p>',
  ],
  ['<strong>Application</strong>', '<strong>Pielietojums</strong>'],
  [
    '<p>This prompt creates organization context that will be used in all other prompts.</p>',
    '<p>Šis prompts rada organizācijas kontekstu, ko izmantos visos pārējos promptos.</p>',
  ],
  ['aria-label="Copy prompt 2 to clipboard"', 'aria-label="Kopēt promptu 2 starpliktuvē"'],
  ['aria-label="Select and copy prompt 3"', 'aria-label="Atlasīt un kopēt promptu 3"'],
  ['<div class="category">Role</div>', '<div class="category">Loma</div>'],
  ['<h2 class="prompt-title">My Role in the Organization</h2>', '<h2 class="prompt-title">Mana loma organizācijā</h2>'],
  [
    `<p class="prompt-desc">Clearly define your role's purpose, responsibilities and impact</p>`,
    '<p class="prompt-desc">Skaidri definējiet savas lomas mērķi, pienākumus un ietekmi</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-3">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-3">Pirms lietošanas</h3>'],
  [
    `<p><strong>Use when:</strong> you want to clarify your role; you're starting with a new company; you need a reference for your position.</p>`,
    '<p><strong>Lietojiet, kad:</strong> vēlaties noskaidrot savu lomu; sākat jaunā uzņēmumā; vajag atsauci uz savu amatu.</p>',
  ],
  [
    `<li>[COMPANY] → your or your client's company (e.g. Acme Inc);</li>`,
    '<li>[UZŅĒMUMS] → jūsu vai klienta uzņēmums (piem. Acme Inc);</li>',
  ],
  [
    '<li>[MY ROLE] → your job title (e.g. Sales Manager).</li>',
    '<li>[MANA LOMA] → jūsu amata nosaukums (piem. pārdošanas vadītājs).</li>',
  ],
  ['<strong>Result</strong>', '<strong>Rezultāts</strong>'],
  [
    '<p>You get a clear role description – use it as a reference for the next steps.</p>',
    '<p>Iegūstat skaidru lomas aprakstu – izmantojiet kā atsauce nākamajiem soļiem.</p>',
  ],
  ['aria-label="Copy prompt 3 to clipboard"', 'aria-label="Kopēt promptu 3 starpliktuvē"'],
  ['aria-label="Select and copy prompt 4"', 'aria-label="Atlasīt un kopēt promptu 4"'],
  ['<div class="category">Document</div>', '<div class="category">Dokuments</div>'],
  ['<h2 class="prompt-title">Job Description + KPI</h2>', '<h2 class="prompt-title">Amata apraksts + KPI</h2>'],
  ['<p class="prompt-desc">Create a practical job description with KPIs</p>', '<p class="prompt-desc">Izveidojiet praktisku amata aprakstu ar KPI</p>'],
  ['<h3 class="before-use-title" id="before-use-title-4">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-4">Pirms lietošanas</h3>'],
  [
    `<p><strong>Use when:</strong> you need a job description; you're preparing for review or onboarding; you want measurable KPIs.</p>`,
    '<p><strong>Lietojiet, kad:</strong> vajag amata aprakstu; gatavojaties pārbaudei vai vervēšanai; vēlaties mērāmus KPI.</p>',
  ],
  ['<strong>Practical value</strong>', '<strong>Praktiskā vērtība</strong>'],
  [
    '<p>This document can be used for self-assessment or onboarding new employees.</p>',
    '<p>Šo dokumentu var izmantot pašnovērtējai vai jaunu darbinieku vervēšanai.</p>',
  ],
  ['aria-label="Copy prompt 4 to clipboard"', 'aria-label="Kopēt promptu 4 starpliktuvē"'],
  ['aria-label="Select and copy prompt 5"', 'aria-label="Atlasīt un kopēt promptu 5"'],
  ['<div class="category">Processes</div>', '<div class="category">Procesi</div>'],
  ['<h2 class="prompt-title">Core Work Processes</h2>', '<h2 class="prompt-title">Galvenie darba procesi</h2>'],
  [
    '<p class="prompt-desc">Identify where time and energy go (Pareto 80/20)</p>',
    '<p class="prompt-desc">Identificējiet, kur tiek tērēts laiks un enerģija (Pareto 80/20)</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-5">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-5">Pirms lietošanas</h3>'],
  [
    '<p><strong>Use when:</strong> you want to see where time goes; optimize your workday; prepare for AI integration.</p>',
    '<p><strong>Lietojiet, kad:</strong> vēlaties redzēt, kur tiek laiks; optimizējat darba dienu; gatavojaties MI integrācijai.</p>',
  ],
  ['<strong>Optimization</strong>', '<strong>Optimizācija</strong>'],
  [
    '<p>Once you understand the processes, you can see where AI will have the biggest impact.</p>',
    '<p>Saprotot procesus, redzat, kur MI būs lielākā ietekme.</p>',
  ],
  ['aria-label="Copy prompt 5 to clipboard"', 'aria-label="Kopēt promptu 5 starpliktuvē"'],
  ['aria-label="Select and copy prompt 6"', 'aria-label="Atlasīt un kopēt promptu 6"'],
  ['<div class="category">AI Integration</div>', '<div class="category">MI integrācija</div>'],
  ['<h2 class="prompt-title">AI Help and Optimization</h2>', '<h2 class="prompt-title">MI palīdzība un optimizācija</h2>'],
  [
    '<p class="prompt-desc">Turn AI into a real work assistant – concrete ideas based on your processes</p>',
    '<p class="prompt-desc">Pārvērsiet MI par īstu darba asistentu – konkrētas idejas balstītas uz jūsu procesiem</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-6">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-6">Pirms lietošanas</h3>'],
  [
    '<p><strong>Use when:</strong> you already have process descriptions (step 5); you want concrete ways to use AI; you want to save time.</p>',
    '<p><strong>Lietojiet, kad:</strong> jau ir procesu apraksti (5. solis); vēlaties konkrētus veidus MI lietošanai; vēlaties ietaupīt laiku.</p>',
  ],
  ['<strong>Real impact</strong>', '<strong>Reālā ietekme</strong>'],
  [
    '<p>This prompt helps identify specific places where AI can save hours per week.</p>',
    '<p>Šis prompts palīdz atrast konkrētas vietas, kur MI var ietaupīt stundas nedēļā.</p>',
  ],
  ['aria-label="Copy prompt 6 to clipboard"', 'aria-label="Kopēt promptu 6 starpliktuvē"'],
  ['aria-label="Select and copy prompt 7"', 'aria-label="Atlasīt un kopēt promptu 7"'],
  ['<div class="category">Library</div>', '<div class="category">Bibliotēka</div>'],
  ['<h2 class="prompt-title">Daily Prompt Library</h2>', '<h2 class="prompt-title">Ikdienas promptu bibliotēka</h2>'],
  [
    '<p class="prompt-desc">Ready-made prompts for daily work and challenges</p>',
    '<p class="prompt-desc">Gatavi prompti ikdienas darbam un izaicinājumiem</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-7">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-7">Pirms lietošanas</h3>'],
  [
    '<p><strong>Use when:</strong> you want personal prompts; for daily work and quick decisions; you want a [prompt | when | problem] table.</p>',
    '<p><strong>Lietojiet, kad:</strong> vēlaties personiskus promptus; ikdienas darbam un ātriem lēmumiem; vēlaties tabulu ar kolonnām <code>[PROMPTTEKSTS]</code> | <code>[KAD LIETOJU]</code> | <code>[KĀDU PROBLĒMU RISINA]</code>.</p>',
  ],
  ['<strong>Daily improvement</strong>', '<strong>Ikdienas uzlabojums</strong>'],
  [
    '<p>You get a personal prompt collection – use it every day without extra thinking.</p>',
    '<p>Iegūstat personisku promptu kolekciju – lietojiet katru dienu bez liekām pārdomām.</p>',
  ],
  ['aria-label="Copy prompt 7 to clipboard"', 'aria-label="Kopēt promptu 7 starpliktuvē"'],
  ['aria-label="Select and copy prompt 8"', 'aria-label="Atlasīt un kopēt promptu 8"'],
  ['<div class="category">Simulation</div>', '<div class="category">Simulācija</div>'],
  ['<h2 class="prompt-title">Critical Situation Simulation</h2>', '<h2 class="prompt-title">Kritiskas situācijas simulācija</h2>'],
  [
    '<p class="prompt-desc">Prepare for pressure and uncertainty in advance</p>',
    '<p class="prompt-desc">Sagatavojieties spiedienam un nenoteiktībai iepriekš</p>',
  ],
  ['<h3 class="before-use-title" id="before-use-title-8">Before using</h3>', '<h3 class="before-use-title" id="before-use-title-8">Pirms lietošanas</h3>'],
  [
    '<p><strong>Use when:</strong> you want to prepare for crises; plan a response to pressure; train decisions with AI.</p>',
    '<p><strong>Lietojiet, kad:</strong> vēlaties sagatavoties krīzēm; plānot reakciju uz spiedienu; trenēt lēmumus ar MI.</p>',
  ],
  ['<strong>Readiness</strong>', '<strong>Gatavība</strong>'],
  [
    '<p>Simulations help you learn to manage crises before they happen. Better to practice with AI than in a real situation.</p>',
    '<p>Simulācijas palīdz mācīties pārvaldīt krīses pirms tās notiek. Labāk trenēties ar MI nekā reālā situācijā.</p>',
  ],
  ['aria-label="Copy prompt 8 to clipboard"', 'aria-label="Kopēt promptu 8 starpliktuvē"'],
  [`<h2 id="next-steps-title">What's next?</h2>`, '<h2 id="next-steps-title">Kas tālāk?</h2>'],
  [
    '<p>Best to go in order from 1 to 8. Click a link to jump to that prompt.</p>',
    '<p>Vislabāk iet secībā no 1 līdz 8. Noklikšķiniet uz saites, lai pārietu pie attiecīgā prompta.</p>',
  ],
  ['<a href="#block1">1. Context check</a>', '<a href="#block1">1. Konteksta pārbaude</a>'],
  ['<a href="#block2">2. Organization portrait</a>', '<a href="#block2">2. Organizācijas portrets</a>'],
  ['<a href="#block3">3. My role</a>', '<a href="#block3">3. Mana loma</a>'],
  ['<a href="#block4">4. Job description + KPI</a>', '<a href="#block4">4. Amata apraksts + KPI</a>'],
  ['<a href="#block5">5. Work processes</a>', '<a href="#block5">5. Darba procesi</a>'],
  ['<a href="#block6">6. AI optimization</a>', '<a href="#block6">6. MI optimizācija</a>'],
  ['<a href="#block7">7. Daily library</a>', '<a href="#block7">7. Ikdienas bibliotēka</a>'],
  ['<a href="#block8">8. Critical situation simulation</a>', '<a href="#block8">8. Kritiskas situācijas simulācija</a>'],
  [
    '<h2 id="community-title">Want more?<br>Join us on Telegram.</h2>',
    '<h2 id="community-title">Vēlaties vairāk?<br>Pievienojieties Telegram.</h2>',
  ],
  [
    '<p>Shared discussions, tips and news about prompts and AI.</p>',
    '<p>Kopīgas diskusijas, padomi un jaunumi par promptiem un MI.</p>',
  ],
  [
    'aria-label="Open Prompt Anatomy Telegram channel in new tab">Join Telegram</a>',
    'aria-label="Atvērt Prompt Anatomy Telegram kanālu jaunā cilnē">Pievienoties Telegram</a>',
  ],
  [
    'aria-label="Full Prompt Anatomy – interactive course (opens in new tab)">Prompt Anatomy →</a>',
    'aria-label="Pilnā Prompt Anatomy – interaktīvs kurss (atveras jaunā cilnē)">Prompt Anatomy →</a>',
  ],
  [
    '<h3>Good luck with your prompts <i data-lucide="rocket" aria-hidden="true"></i></h3>',
    '<h3>Veiksmi ar promptiem <i data-lucide="rocket" aria-hidden="true"></i></h3>',
  ],
  [
    '<p>If the prompt has [COMPANY] or [MY ROLE] – replace with your details. The AI role (e.g. “critical analyst”) is already set – no need to change it.</p>',
    '<p>Ja promptā ir [UZŅĒMUMS] vai [MANA LOMA] – aizstājiet ar saviem datiem. MI loma (piem. „kritisks analītiķis“) jau ir iestatīta – mainīt nav jā.</p>',
  ],
  [
    '<p class="footer-product-link">This is <strong>Spin-off No. 1</strong> from “Prompt Anatomy”. Full interactive course and more: <a href="https://www.promptanatomy.app/en" target="_blank" rel="noopener noreferrer">Prompt Anatomy →</a></p>',
    '<p class="footer-product-link">Šis ir <strong>Spin-off Nr. 1</strong> no „Prompt Anatomy“. Pilns interaktīvs kurss un vairāk: <a href="https://www.promptanatomy.app/en" target="_blank" rel="noopener noreferrer">Prompt Anatomy →</a></p>',
  ],
  ['<span class="tag" role="listitem"><i data-lucide="bot" aria-hidden="true"></i> AI-optimized</span>', '<span class="tag" role="listitem"><i data-lucide="bot" aria-hidden="true"></i> MI optimizēts</span>'],
  ['<span class="tag" role="listitem"><i data-lucide="book-marked" aria-hidden="true"></i> 8 prompts</span>', '<span class="tag" role="listitem"><i data-lucide="book-marked" aria-hidden="true"></i> 8 prompti</span>'],
  ['<span class="tag" role="listitem"><i data-lucide="zap" aria-hidden="true"></i> Quick start</span>', '<span class="tag" role="listitem"><i data-lucide="zap" aria-hidden="true"></i> Ātrs starts</span>'],
  ['<span class="tag" role="listitem"><i data-lucide="target" aria-hidden="true"></i> Results</span>', '<span class="tag" role="listitem"><i data-lucide="target" aria-hidden="true"></i> Rezultāti</span>'],
  [
    '<p>&copy; 2026 Tomas Staniulis. Training material. All rights reserved. <a href="privacy.html">Privacy</a></p>',
    '<p>&copy; 2026 Tomas Staniulis. Apmācību materiāls. Visas tiesības aizsargātas. <a href="privacy.html">Privātums</a></p>',
  ],
  ['aria-label="Copy text field"', 'aria-label="Kopēšanas lauks"'],
  ['aria-label="Copy notification">', 'aria-label="Kopēšanas paziņojums">'],
  ['<span>Copied</span>', '<span>Nokopēts</span>'],
];

/** Latvian replacements for js/library.js only */
const LV_JS_PAIRS = [
  [
    "button.innerHTML = '<i data-lucide=\"check\" aria-hidden=\"true\"></i><span>Copied</span>';",
    "button.innerHTML = '<i data-lucide=\"check\" aria-hidden=\"true\"></i><span>Nokopēts</span>';",
  ],
  [
    "showError(button, 'Something went wrong. Try copying again.');",
    "showError(button, 'Kaut kas nogāja nepareizi. Mēģiniet kopēt vēlreiz.');",
  ],
  [
    "showError(button, 'Something went wrong. Try copying again. Select the text and use Ctrl+C (or Cmd+C).');",
    "showError(button, 'Kaut kas nogāja nepareizi. Mēģiniet vēlreiz. Atlasiet tekstu un izmantojiet Ctrl+C (vai Cmd+C).');",
  ],
  [
    "showError(button, 'Copy didn\\'t work. Select the text and use Ctrl+C (or Cmd+C).');",
    "showError(button, 'Kopēšana neizdevās. Atlasiet tekstu un izmantojiet Ctrl+C (vai Cmd+C).');",
  ],
  [
    "button.setAttribute('aria-label', 'Prompt copied successfully');",
    "button.setAttribute('aria-label', 'Prompt veiksmīgi nokopēts');",
  ],
  [
    "button.setAttribute('aria-label', `Copy prompt ${promptId.replace('prompt', '')} to clipboard`);",
    "button.setAttribute('aria-label', `Kopēt promptu ${promptId.replace('prompt', '')} starpliktuvē`);",
  ],
  [
    "const errorMessage = message || 'Something went wrong. Try copying again.';",
    "const errorMessage = message || 'Kaut kas nogāja nepareizi. Mēģiniet kopēt vēlreiz.';",
  ],
  [
    "if (textEl) textEl.textContent = count === 8 ? 'Great – you\\'ve used all 8.' : 'You\\'ve used ' + count + ' of 8 prompts.';",
    "if (textEl) textEl.textContent = count === 8 ? 'Lieliski – izmantojāt visus 8.' : 'Lietojāt ' + count + ' no 8 promptiem.';",
  ],
];

/** Lithuanian replacements for js/library.js only (generated output: library.lt.js) */
const LT_JS_PAIRS = [
  [
    "button.innerHTML = '<i data-lucide=\"check\" aria-hidden=\"true\"></i><span>Copied</span>';",
    "button.innerHTML = '<i data-lucide=\"check\" aria-hidden=\"true\"></i><span>Nukopijuota</span>';",
  ],
  [
    "showError(button, 'Something went wrong. Try copying again.');",
    "showError(button, 'Kažkas nepavyko. Bandykite kopijuoti dar kartą.');",
  ],
  [
    "showError(button, 'Something went wrong. Try copying again. Select the text and use Ctrl+C (or Cmd+C).');",
    "showError(button, 'Kažkas nepavyko. Bandykite dar kartą. Pažymėkite tekstą ir naudokite Ctrl+C (arba Cmd+C).');",
  ],
  [
    "showError(button, 'Copy didn\\'t work. Select the text and use Ctrl+C (or Cmd+C).');",
    "showError(button, 'Kopijavimas nepavyko. Pažymėkite tekstą ir naudokite Ctrl+C (arba Cmd+C).');",
  ],
  [
    "button.setAttribute('aria-label', 'Prompt copied successfully');",
    "button.setAttribute('aria-label', 'Promptas sėkmingai nukopijuotas');",
  ],
  [
    "button.setAttribute('aria-label', `Copy prompt ${promptId.replace('prompt', '')} to clipboard`);",
    "button.setAttribute('aria-label', `Kopijuoti promptą ${promptId.replace('prompt', '')} į mainų atmintinę`);",
  ],
  [
    "const errorMessage = message || 'Something went wrong. Try copying again.';",
    "const errorMessage = message || 'Kažkas nepavyko. Bandykite kopijuoti dar kartą.';",
  ],
  [
    "if (textEl) textEl.textContent = count === 8 ? 'Great – you\\'ve used all 8.' : 'You\\'ve used ' + count + ' of 8 prompts.';",
    "if (textEl) textEl.textContent = count === 8 ? 'Puiku – panaudojai visus 8.' : 'Panaudojai ' + count + ' iš 8 promptų.';",
  ],
  [
    "throw new Error('execCommand copy failed');",
    "throw new Error('execCommand copy nepavyko');",
  ],
];

const libPath = path.join(root, 'js', 'library.js');
const libEn = fs
  .readFileSync(libPath, 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n');

let etHtml = replacePromptBodies(en, ET_PROMPTS);
etHtml = etHtml.replace(LANG_NAV_RE, ET_NAV.trim());
etHtml = applyPairs(etHtml, ET_PAIRS);
etHtml = etHtml.replaceAll('../js/library.js', '../js/library.et.js');

let lvHtml = replacePromptBodies(en, LV_PROMPTS);
lvHtml = lvHtml.replace(LANG_NAV_RE, LV_NAV.trim());
lvHtml = applyPairs(lvHtml, LV_PAIRS);
lvHtml = lvHtml.replaceAll('../js/library.js', '../js/library.lv.js');

writeUtf8Lf(path.join(root, 'et', 'index.html'), etHtml);
writeUtf8Lf(path.join(root, 'lv', 'index.html'), lvHtml);
writeUtf8Lf(path.join(root, 'js', 'library.et.js'), applyPairs(libEn, ET_JS_PAIRS));
writeUtf8Lf(path.join(root, 'js', 'library.lv.js'), applyPairs(libEn, LV_JS_PAIRS));
writeUtf8Lf(path.join(root, 'js', 'library.lt.js'), applyPairs(libEn, LT_JS_PAIRS));
console.log('Wrote et/index.html, lv/index.html, js/library.et.js, js/library.lv.js, js/library.lt.js');
