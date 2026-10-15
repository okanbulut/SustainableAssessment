// Sustainable Assessment Toolkit — interactive sections (self-check, redesign moves, worked examples).
"use strict";

// ── Content ──────────────────────────────────────────────────────────────

const Q = [
  { id: "discipline", kind: "ctx",
    note: "We start with context, so the steps at the end are realistic for your setting rather than generic.",
    q: "Which area do you teach in?",
    sub: "We'll point you to a worked example from your area at the end.",
    opts: [{ l: "Education or social sciences" }, { l: "Engineering or computer science" }, { l: "Business or law" }, { l: "Health sciences" }, { l: "Humanities" }, { l: "Natural sciences or mathematics" }] },

  { id: "size", kind: "ctx",
    note: "Class size decides whether some of the strongest moves are actually affordable. We will not recommend individual vivas for four hundred students.",
    q: "How many students take this assessment?",
    sub: "Roughly, in a typical offering.",
    opts: [{ l: "Fewer than 30", v: "s" }, { l: "30 to 100", v: "m" }, { l: "100 to 300", v: "l" }, { l: "More than 300", v: "xl" }] },

  { id: "mode", kind: "ctx",
    note: "How the course runs constrains what can be supervised and what has to work at a distance.",
    q: "How is the course delivered?",
    sub: "The mode of the course as a whole, not just this task.",
    opts: [{ l: "In person", v: "f2f" }, { l: "Fully online", v: "online" }, { l: "Hybrid", v: "hybrid" }] },

  { id: "produce", kind: "w",
    note: "Now the assessment itself. In our study, what the task asks for mattered more than the subject it covered.",
    q: "What does the task ask students to produce?",
    sub: "Pick the closest description of the main deliverable.",
    opts: [
      { l: "Short factual or computational answers", w: 3, fix: "recall" },
      { l: "A standard essay, report or literature review", w: 3, fix: "local" },
      { l: "An analysis of material specific to this course", w: 1 },
      { l: "A documented process with drafts and artefacts", w: 0, ok: "The task already asks for a process, not just a product — the hardest thing for a model to supply." }] },

  { id: "public", kind: "w",
    note: "Both systems we tested scored highest where the task could be answered from widely published material.",
    q: "Could the task be answered well from publicly available material?",
    sub: "Think about whether the topic is widely taught and widely written about.",
    opts: [
      { l: "Yes — it is a widely taught topic", w: 3, fix: "local" },
      { l: "Partly — the topic is common, the framing is ours", w: 2, fix: "local" },
      { l: "No — it depends on local or unpublished material", w: 0, ok: "The task already depends on material a model cannot retrieve." }] },

  { id: "conditions", kind: "w",
    note: "Supervision is the bluntest instrument available, and the one most of our participants reached for first.",
    q: "Where and under what conditions is the work done?",
    sub: "The conditions as they stand now, not as you would like them.",
    opts: [
      { l: "Entirely unsupervised, submitted online", w: 3, fix: "supervised" },
      { l: "Mostly unsupervised, with one supervised element", w: 1 },
      { l: "Supervised or in class", w: 0, ok: "Conditions are already controlled, which limits unattributed tool use." }] },

  { id: "grade", kind: "w",
    note: "Where the marks sit determines what students optimise for. It is often the cheapest thing to change.",
    q: "What does the grade depend on?",
    sub: "How the marks are distributed across the work.",
    opts: [
      { l: "The final artefact only", w: 3, fix: "process" },
      { l: "Mostly the artefact, with a small process mark", w: 2, fix: "process" },
      { l: "Process and artefact roughly equally", w: 0, ok: "Marks already recognise the process, not only the finished artefact." }] },

  { id: "account", kind: "w",
    note: "Instructors across all five regions described oral accounting as the change that restored their confidence fastest.",
    q: "Do students have to account for their choices in person?",
    sub: "Any spoken or live element where students explain their own work.",
    opts: [
      { l: "No", w: 3, fix: "oral" },
      { l: "Only if something looks wrong", w: 2, fix: "oral" },
      { l: "Yes — a short defence is part of the task", w: 0, ok: "Students already have to stand behind their work in person." }] },

  { id: "policy", kind: "w",
    note: "In our interviews, the most common complaint was not that policy was too strict, but that it was too vague to act on.",
    q: "Is AI use addressed on the assessment itself?",
    sub: "What a student reading the brief would actually see.",
    opts: [
      { l: "Nothing is said on the task", w: 2, fix: "declare" },
      { l: "A course-wide policy exists somewhere", w: 1, fix: "declare" },
      { l: "Not permitted — stated on the brief", w: 0, ok: "The brief tells students plainly that AI is not allowed for this task." },
      { l: "Permitted for parts of it, stated on the brief", w: 0, ok: "Students can tell from the brief what is and is not allowed." },
      { l: "Required — using AI is part of the task", w: 0, ok: "The task treats AI as a tool to be used well rather than a threat to be managed." }] },

  { id: "capacity", kind: "ctx",
    note: "Two questions left, both about you rather than the task. Your answers set how much the roadmap asks of you.",
    q: "How much can you change before the next offering?",
    sub: "Be honest — a shorter roadmap you finish beats a long one you abandon.",
    opts: [
      { l: "Very little — the outline is largely fixed", v: "low" },
      { l: "One component could change", v: "mid" },
      { l: "I can redesign the assessment", v: "high" }] },

  { id: "confidence", kind: "ctx",
    note: "Instructors in our study named time, not willingness, as the binding constraint. We will keep this proportionate.",
    q: "How confident are you using generative AI tools yourself?",
    sub: "This decides whether the roadmap starts with the tools or with the task.",
    opts: [
      { l: "I have not really used them", v: "low" },
      { l: "I have tried them a little", v: "mid" },
      { l: "I use them regularly", v: "high" }] }
];

const MOVES = {
  local: { t: "Anchor the prompt in something only your class has", impact: "High", effort: "Low",
    d: "Swap the general topic for data your students generated, a case from a named week, a local organisation, or a source that is not online. In our sample this single change produced the lowest AI scores of any revision.",
    why: "Your answers say the task could largely be answered from published material." },
  process: { t: "Put real marks on the process", impact: "High", effort: "Low",
    d: "Require a planning note, an annotated draft, or a record of what was tried and rejected — and weight it at 20 to 30 per cent. Fabricating a credible process record costs more effort than doing the work.",
    why: "At present the grade rests mainly on the final artefact." },
  declare: { t: "State the rule on the brief itself", impact: "Medium", effort: "Low",
    d: "Write permitted, required or not for this task directly on the assessment, ask for a two-line declaration of what was used and what the student changed as a result, and give it a mark.",
    why: "A student reading your brief cannot currently tell what is allowed." },
  recall: { t: "Move recall behind a supervised gate", impact: "High", effort: "Medium",
    d: "Keep the factual and computational checks, but run them in class or in a short proctored window. Use the unsupervised time for work that recall cannot stand in for.",
    why: "The task asks mainly for short answers, which both systems we tested answered near-perfectly." },
  supervised: { t: "Split the evidence base", impact: "High", effort: "Medium",
    d: "Leave the bulk of the work unsupervised, and add one short supervised component that only a student who did the work can complete. You are not re-proctoring the whole assessment.",
    why: "The work is currently done entirely unsupervised." },
  oralSmall: { t: "Add a five-minute account of the work", impact: "High", effort: "Medium",
    d: "A short structured conversation about the submission, lightly graded and scheduled for everyone — not an investigation. Three questions, fixed in advance: what you chose, what you rejected, what you would do differently.",
    why: "Nothing in the task currently requires students to explain their own choices aloud." },
  oralLarge: { t: "Ask for a three-minute recorded explanation", impact: "Medium", effort: "Medium",
    d: "Every student submits a short unscripted video explaining one decision in their work. Mark a random sample in full and the rest on completion, or bring the sample into tutorials. It scales where vivas do not.",
    why: "Students never have to account for their choices, and your class is too large for individual vivas." },
  critique: { t: "Make the AI output the object of study", impact: "Medium", effort: "Medium",
    d: "Give students a generated answer to the task and ask them to find what it misses, misattributes or overstates, then improve it. Critique is usually the skill the assessment was reaching for.",
    why: "Your setting can absorb a redesign, and critiquing AI output turns it into the skill being assessed." },
  train: { t: "Spend an hour with the tools before changing anything", impact: "Medium", effort: "Low",
    d: "Put your own assessment into ChatGPT and Gemini and mark what comes back against your own criteria. Most instructors in our study found this more clarifying than any guidance document, including this one.",
    why: "You told us you have not used these tools much yet." },
  miniGate: { t: "Add one supervised question in class", impact: "Medium", effort: "Low",
    d: "Keep the assessment as it is, and add a single short question students answer in class without devices, about a decision in their own submission. Five minutes of class time and a quick completion mark is enough to show who can account for their work.",
    why: "You can change very little before the next offering, so this is the smallest step that still adds visible evidence of understanding." },
  share: { t: "Share this assessment as a good example", impact: "Medium", effort: "Low",
    d: "This assessment already holds up well, which makes it worth more as a shared example than as a private one. Walk colleagues through what makes it work at a staff meeting, or send it to us for the worked examples library.",
    why: "Instructors in our study consistently asked for concrete examples from colleagues rather than policy." }
};

const RANK = { High: 3, Medium: 2, Low: 1 };
const BANDS = [
  { min: 0.6, label: "High exposure", color: "var(--color-accent-700)",
    blurb: "As designed, this task can largely be completed by a current general-purpose model without the student engaging the intended learning." },
  { min: 0.3, label: "Moderate exposure", color: "#9a6a1f",
    blurb: "Parts of this task are substitutable, but there is already something a model cannot supply. The roadmap below strengthens that part rather than rebuilding the assessment." },
  { min: -1, label: "Low exposure", color: "var(--color-accent-2-700)",
    blurb: "This design already depends on things a model cannot reach. The steps below are about making that explicit and sharing it, not repairing it." }
];

const TYPES = [
  { name: "Multiple-choice quiz",
    risk: "Publicly discussed item banks and standard phrasing mean models answer these near-perfectly, including many items intended as higher-order.",
    before: "Forty multiple-choice items on the module content, open for a week, unlimited attempts.",
    after: "Twenty items in a supervised window, plus one short written justification of a chosen answer that the marker can query.",
    moves: [
      { t: "Shrink the weight, keep the function", d: "Quizzes are good for checking coverage and bad for certifying it. Drop the weighting to what a coverage check is worth." },
      { t: "Ask for the reasoning behind one answer", d: "Add a single item asking students to justify a choice in two sentences. It is quick to mark and hard to outsource convincingly." },
      { t: "Close the window", d: "A supervised or time-boxed sitting changes the exposure profile more than rewriting the items does." } ] },
  { name: "Take-home essay",
    risk: "General prompts on widely taught topics are answered at a solid passing standard, with the weakest results appearing only where course-specific framing was required.",
    before: "\"Discuss the impact of X on Y, 2,000 words, referencing at least eight sources.\"",
    after: "\"Using the three readings from weeks 6–8 and the seminar disagreement we recorded, argue a position on X. Please include your planning note.\"",
    moves: [
      { t: "Bind the prompt to the course", d: "Name the readings, the seminar, the dataset, the week. Generality is the vulnerability, not the essay form." },
      { t: "Grade the plan as well as the prose", d: "Ask for a one-page plan submitted earlier and marked. It creates a trail and improves the essays." },
      { t: "Require a declaration with judgement in it", d: "Which tool, for what, and what the student changed as a result — assessed on the quality of that account." } ] },
  { name: "Problem set",
    risk: "Standard problems with published solutions are solved reliably; models fail mainly on problems built from unfamiliar data or on showing a required method.",
    before: "Ten textbook problems, submitted as final answers with working.",
    after: "Six problems using data generated in the lab session, one of which contains an error students must find and explain.",
    moves: [
      { t: "Generate the numbers locally", d: "Per-student or per-cohort data from a lab, a simulation or a field exercise removes the published-solution advantage." },
      { t: "Include a flawed worked solution", d: "Give students a model-produced answer and ask them to locate and explain the error. Critique is the skill you wanted anyway." },
      { t: "Mark the method, not the result", d: "Rubric weight on approach, assumptions and checking makes the answer alone insufficient." } ] },
  { name: "Literature review",
    risk: "Fluent, well-structured reviews are produced easily, though citation accuracy remains the most common failure we observed.",
    before: "\"Review the literature on X and identify gaps.\"",
    after: "\"Review the literature on X, then evaluate a supplied AI-generated review of the same field: what does it miss, misattribute or overstate?\"",
    moves: [
      { t: "Make verification the task", d: "Require students to check and annotate every citation — retrieved, read, and characterised in their own words." },
      { t: "Review the machine's review", d: "Supply a generated review as the object of critique. Students demonstrate command of the field by finding what is wrong with it." },
      { t: "Narrow the scope to something specific", d: "A gap relevant to a named local context, project or dataset rather than a field-wide survey." } ] },
  { name: "Group project",
    risk: "Group work distributes rather than reduces exposure: individual contributions are rarely visible enough to tell who did what with which tools.",
    before: "One group report and a shared mark.",
    after: "Group report, an individual contribution log with an agreed division of labour, and a ten-minute group conversation with individual questions.",
    moves: [
      { t: "Make individual contribution visible", d: "Logged, dated, and part of the mark. Groups sort themselves out when contribution is assessed." },
      { t: "Ask individual questions in a group meeting", d: "Short and structured. It distinguishes participation from proximity." },
      { t: "Set the group's AI policy as an artefact", d: "Have the group write and submit its own rules for tool use, then hold them to it." } ] },
  { name: "Presentation",
    risk: "Slides and scripts are produced easily; the live portion is where exposure drops, provided questions go beyond the prepared material.",
    before: "Ten-minute presentation, marked on slides and delivery.",
    after: "Eight-minute presentation plus four minutes of unscripted questions on choices made, weighted equally.",
    moves: [
      { t: "Weight the questions, not the slides", d: "Move marks from the artefact to the exchange that follows it." },
      { t: "Ask about what was left out", d: "Decisions, rejected framings and limitations are the parts a student who did the work can discuss." },
      { t: "Let AI build the slides openly", d: "If the outcome is oral communication, permit tool use for the deck and assess the speaking." } ] }
];

const EXAMPLES = [
  { discipline: "Education", format: "Research proposal", title: "Research proposal with a decision record", body: "Students submit a research proposal and a record of up to two pages explaining their question, source checks and method choices. Any AI assistance is explained and evaluated within the existing marking criteria.", ai: "Permitted", aiNote: "Guidelines 1, 4, 6" },
  { discipline: "Philosophy", format: "Critique", title: "Ethics article review with an AI interpretation check", body: "Students review one assigned ethics reading and check an AI interpretation supplied by the instructor. They use the reading to explain whether the interpretation is supported, overstated or mistaken.", ai: "Required", aiNote: "Guidelines 2, 5, 6" },
  { discipline: "Health sciences", format: "Quiz", title: "Health history quiz with a short explanation", body: "Students complete a short health-history quiz and explain one selected answer in two sentences. The redesign adds visible reasoning to an existing introductory task without adding new clinical content.", ai: "Restricted", aiNote: "Guidelines 1, 6" },
  { discipline: "Computer science", format: "Programming lab", title: "First Java lab with a revision note", body: "Students write and demonstrate a small Java program, then explain one tested change using before-and-after code. AI may provide explanations or debugging hints; students show how they checked the advice.", ai: "Permitted", aiNote: "Guidelines 1, 3, 4, 6" },
  { discipline: "Business", format: "Project", title: "Group business case with contribution records", body: "Teams prepare a business case for their chosen technology. Each student adds a short contribution record, and the team explains its AI rules and key decisions. The existing report criteria and peer adjustment remain in place.", ai: "Permitted", aiNote: "Guidelines 1, 4, 6" },
  { discipline: "Engineering", format: "Lab report", title: "Beam deflection lab with an AI calculation check", body: "Each group loads a beam in the lab and compares measured deflection with beam theory. Students also check an AI-generated calculation for the same beam and explain where it is correct, wrong or based on unstated assumptions.", ai: "Permitted", aiNote: "Guidelines 2, 4, 5, 6" }
];

const AI_COLORS = { Permitted: "var(--color-accent-2-700)", Required: "var(--color-accent-700)", Restricted: "var(--color-neutral-800)" };
const FILTERS = ["All", "Education", "Engineering", "Business", "Computer science", "Philosophy", "Health sciences"];

// ── Rendering ────────────────────────────────────────────────────────────

const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = id => document.getElementById(id);

const state = { stage: 0, answers: {}, type: 1, filter: "All" };

function pill(on) {
  return on
    ? { bg: "var(--color-accent)", bd: "var(--color-accent)", fg: "var(--color-bg)" }
    : { bg: "transparent", bd: "var(--color-divider)", fg: "var(--color-text)" };
}

function scrollToId(id) {
  const el = $(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
}

// Scores the answers and resolves the roadmap. Logic mirrors the design source.
function buildRoadmap() {
  const a = state.answers;
  const val = id => { const i = Q.findIndex(q => q.id === id); return a[i] === undefined ? null : (Q[i].opts[a[i]].v || Q[i].opts[a[i]].l); };

  let score = 0, max = 0;
  const keys = [], working = [];
  Q.forEach((qq, i) => {
    if (qq.kind !== "w" || a[i] === undefined) return;
    const o = qq.opts[a[i]];
    score += o.w;
    max += Math.max.apply(null, qq.opts.map(x => x.w || 0));
    if (o.fix && keys.indexOf(o.fix) === -1) keys.push(o.fix);
    if (o.ok) working.push(o.ok);
  });
  const ratio = max ? score / max : 0;
  const band = BANDS.find(b => ratio >= b.min) || BANDS[2];

  const size = val("size"), cap = val("capacity"), conf = val("confidence");
  const ansL = id => { const i = Q.findIndex(qq => qq.id === id); return i > -1 && a[i] !== undefined ? Q[i].opts[a[i]].l : ""; };
  const aiRequired = ansL("policy") === "Required — using AI is part of the task";

  let resolved = keys.map(k => k === "oral" ? ((size === "l" || size === "xl") ? "oralLarge" : "oralSmall") : k);
  if (conf === "low") resolved.push("train");
  if (cap === "high" && resolved.indexOf("critique") === -1) resolved.push("critique");
  if (ratio < 0.3) resolved.push("share");
  if (aiRequired) resolved = resolved.filter(k => k !== "critique");
  if (ansL("public").indexOf("No") === 0) resolved = resolved.filter(k => k !== "local");
  if (ansL("conditions") === "Supervised or in class") resolved = resolved.filter(k => k !== "recall");

  const alreadySupervised = ansL("conditions") === "Supervised or in class";
  const alreadyDefends = ansL("account").indexOf("Yes") === 0;
  const briefStated = /stated on the brief|^Required/.test(ansL("policy"));
  const miniOk = !alreadySupervised && !alreadyDefends;
  if (cap === "low" && ratio >= 0.3 && miniOk && resolved.indexOf("miniGate") === -1) resolved.push("miniGate");
  const capLimit = cap === "low" ? ["Low"] : (cap === "mid" ? ["Low", "Medium"] : ["Low", "Medium", "High"]);
  const capCount = cap === "low" ? 3 : (cap === "mid" ? 4 : 5);

  let list = resolved.map(k => MOVES[k]).filter(Boolean)
    .filter(m => capLimit.indexOf(m.effort) !== -1)
    .sort((x, y) => (RANK[y.impact] - RANK[x.impact]) || (RANK[x.effort] - RANK[y.effort]))
    .slice(0, capCount);
  if (!list.length) list = [ratio < 0.3 ? MOVES.share : (miniOk ? MOVES.miniGate : (!briefStated ? MOVES.declare : MOVES.train))];

  const steps = list.map((m, i) => Object.assign({ n: "0" + (i + 1) }, m));

  const sizeLabel = { s: "a small class", m: "a class of 30 to 100", l: "a class of 100 to 300", xl: "a class of more than 300" }[size] || "your class";
  const modeLabel = { f2f: "taught in person", online: "taught fully online", hybrid: "taught in hybrid mode" }[val("mode")] || "";
  const ctxLine = "For " + (val("discipline") || "your discipline").toLowerCase() + ", " + sizeLabel + (modeLabel ? ", " + modeLabel : "") + ".";

  const EX_MAP = { "Education or social sciences": ["Education"], "Engineering or computer science": ["Engineering", "Computer science"], "Business or law": ["Business"], "Health sciences": ["Health sciences"], "Humanities": ["Philosophy"], "Natural sciences or mathematics": [] };
  const disc = val("discipline");
  let matchEx = null, exact = false;
  for (const d of EX_MAP[disc] || []) { matchEx = EXAMPLES.find(e => e.discipline === d); if (matchEx) { exact = true; break; } }
  if (!matchEx && disc) matchEx = EXAMPLES.find(e => e.discipline === "Engineering");

  return { band, ratio, working, steps, ctxLine, matchEx, exact };
}

function renderIntro() {
  return `
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 18px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent-700); font-weight: 600;">Where your assessment stands today</div>
      <h2 style="font-size: 44px; line-height: 1.05; max-width: 20ch;">Let's look at one assessment together.</h2>
      <p style="font-size: 17px; line-height: 1.65; max-width: 54ch; color: var(--color-neutral-800);">Eleven short questions about a single assessment task you already run: <b>what</b> it asks for, <b>how</b> it is marked, and what you can realistically <b>change</b>. At the end you get a profile of where your assessment stands and a roadmap of numbered steps, ordered so the first one is the one worth doing first.</p>
      <p style="font-size: 15px; line-height: 1.6; max-width: 54ch; color: var(--color-neutral-700);">No sign-up, nothing sent anywhere, nothing stored. This is a prompt for your own judgement, not a verdict on your teaching.</p>
      <button type="button" data-act="start" class="btn btn-primary" style="border-radius: 999px; margin-top: 14px; padding: 14px 34px; font-size: 16px; cursor: pointer;">Take a look</button>
    </div>`;
}

function renderQuestion() {
  const qi = state.stage - 1, q = Q[qi], a = state.answers;
  const answered = a[qi] !== undefined;
  const segs = Q.map((_, i) => `<div style="flex: 1; height: 5px; border-radius: 999px; background: ${i <= qi ? "var(--color-accent)" : "var(--color-neutral-300)"}; opacity: ${i <= qi ? "1" : "0.55"};"></div>`).join("");
  const opts = q.opts.map((o, oi) => {
    const on = a[qi] === oi;
    return `<button type="button" class="opt" data-act="pick" data-i="${oi}" aria-pressed="${on}" style="text-align: left; cursor: pointer; font: inherit; font-size: 16px; font-weight: ${on ? 600 : 400}; line-height: 1.45; padding: 16px 24px; border-radius: 999px; border: 1px solid ${on ? "var(--color-accent)" : "var(--color-neutral-300)"}; background: ${on ? "var(--color-accent)" : "var(--color-bg)"}; color: ${on ? "#fff" : "var(--color-text)"};">${esc(o.l)}</button>`;
  }).join("");
  const nextStyle = answered
    ? "background: var(--color-accent); border-color: var(--color-accent); color: #fff; cursor: pointer;"
    : "background: var(--color-neutral-200); border-color: var(--color-neutral-200); color: var(--color-neutral-500); cursor: not-allowed;";
  return `
    <div style="display: flex; flex-direction: column; gap: 34px;">
      <div style="display: flex; gap: 6px;" aria-hidden="true">${segs}</div>
      <div style="background: var(--color-bg); border-radius: var(--radius-lg); border-left: 4px solid var(--color-accent); padding: 22px 26px; box-shadow: var(--shadow-sm);">
        <p style="font-size: 16px; line-height: 1.6; color: var(--color-neutral-800);">${esc(q.note)}</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-neutral-700);">Question ${state.stage} of ${Q.length}</div>
        <h2 id="q-text" tabindex="-1" style="font-size: 34px; line-height: 1.12; max-width: 26ch;">${esc(q.q)}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: var(--color-neutral-800); max-width: 50ch;">${esc(q.sub)}</p>
      </div>
      <div role="group" aria-labelledby="q-text" style="display: flex; flex-direction: column; gap: 10px;">${opts}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        <button type="button" data-act="back" class="btn btn-secondary" style="border-radius: 999px; padding: 12px 28px; cursor: pointer;">Back</button>
        <button type="button" data-act="next" class="btn" aria-disabled="${!answered}" style="border-radius: 999px; padding: 12px 30px; font-size: 16px; border: 1px solid; ${nextStyle}">${state.stage === Q.length ? "Build my roadmap" : "Next"}</button>
      </div>
    </div>`;
}

function renderDone() {
  const r = buildRoadmap(), first = r.steps[0];
  const pct = Math.round(Math.max(r.ratio, 0.08) * 100) + "%";
  const working = r.working.length ? `
    <div style="display: flex; flex-direction: column; gap: 4px; border-top: 1px solid var(--color-divider); padding-top: 32px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-neutral-700); font-weight: 600; margin-bottom: 12px;">What is already working</div>
      ${r.working.map(w => `
      <div style="display: flex; gap: 16px; align-items: start; padding: 16px 0; border-bottom: 1px solid var(--color-divider);">
        <div style="flex: none; width: 26px; height: 26px; border-radius: 999px; background: var(--color-accent-2-200); display: flex; align-items: center; justify-content: center; color: var(--color-accent-2-900); font-size: 14px; font-weight: 700;">✓</div>
        <p style="font-size: 16px; line-height: 1.55; color: var(--color-neutral-800);">${esc(w)}</p>
      </div>`).join("")}
    </div>` : "";
  const steps = r.steps.map(s => `
    <div style="display: flex; gap: 20px; align-items: start; padding: 26px 0; border-top: 1px solid var(--color-divider);">
      <div style="font-family: var(--font-heading); font-size: 17px; color: var(--color-accent-700); flex: none; width: 34px; padding-top: 2px;">${s.n}</div>
      <div style="min-width: 0; display: flex; flex-direction: column; gap: 8px;">
        <h4 style="font-size: 20px; line-height: 1.3;">${esc(s.t)}</h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="tag tag-outline" style="font-size: 12px;">Impact: ${esc(s.impact)}</span>
          <span class="tag tag-neutral" style="font-size: 12px;">Effort: ${esc(s.effort)}</span>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: var(--color-neutral-800);">${esc(s.d)}</p>
        <p style="font-size: 14px; line-height: 1.5; color: var(--color-neutral-700); font-style: italic;">${esc(s.why)}</p>
      </div>
    </div>`).join("");
  const ex = r.matchEx;
  const match = ex ? `
    <div class="card" style="border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 10px;">
      <div class="card-kicker">${r.exact ? "A worked example from your area" : "The closest worked example we have"}</div>
      <div class="card-title">${esc(ex.title)}</div>
      <p class="card-body">${esc(ex.body)}</p>
      <p style="font-size: 14px; color: var(--color-neutral-700);">${esc(ex.discipline + " · " + ex.format + " · AI: " + ex.ai)}</p>
      <div data-noprint="1"><button type="button" data-act="example" class="btn btn-secondary" style="border-radius: 999px; cursor: pointer;">See it in the worked examples</button></div>
    </div>` : "";
  return `
    <div id="roadmap-print" style="display: flex; flex-direction: column; gap: 44px;">
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent-700); font-weight: 600;">Your roadmap</div>
        <h2 id="roadmap-title" tabindex="-1" style="font-size: 42px; line-height: 1.06; max-width: 22ch;">Here is where to start.</h2>
        <p style="font-size: 17px; line-height: 1.65; max-width: 54ch; color: var(--color-neutral-800);">Built from the answers you just gave — nothing more. Every step below was filtered for what you said you could change and for the size of your class, then ordered by how much it shifts the profile.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; border-top: 1px solid var(--color-divider); padding-top: 32px;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-neutral-700); font-weight: 600;">Where this assessment stands</div>
        <div style="display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap;">
          <div style="font-family: var(--font-heading); font-size: 32px; line-height: 1.1; color: ${r.band.color};">${esc(r.band.label)}</div>
          <div style="font-size: 15px; color: var(--color-neutral-700);">${esc(r.ctxLine)}</div>
        </div>
        <div style="height: 9px; border-radius: 999px; background: var(--color-neutral-200); overflow: hidden; max-width: 460px;">
          <div style="height: 100%; border-radius: 999px; background: ${r.band.color}; width: ${pct};"></div>
        </div>
        <p style="font-size: 16px; line-height: 1.6; max-width: 58ch; color: var(--color-neutral-800);">${esc(r.band.blurb)}</p>
      </div>
      ${working}
      <div style="background: var(--color-neutral-900); border-radius: var(--radius-lg); padding: 38px 40px; display: flex; flex-direction: column; gap: 14px;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent-400); font-weight: 600;">One thing worth doing first</div>
        <p style="font-size: 16px; line-height: 1.6; color: var(--color-neutral-300);">You do not need to change everything at once. If you change one thing before the next offering, make it this.</p>
        <h3 style="font-size: 30px; line-height: 1.12; color: #fff; margin-top: 8px;">${esc(first.t)}</h3>
        <p style="font-size: 17px; line-height: 1.6; color: var(--color-neutral-200);">${esc(first.d)}</p>
        <p style="font-size: 15px; line-height: 1.55; color: var(--color-neutral-400); border-top: 1px solid var(--color-neutral-700); padding-top: 16px; margin-top: 8px;">${esc(first.why)}</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0;">
        <div style="display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; margin-bottom: 20px;">
          <h3 style="font-size: 26px; line-height: 1.15;">The full roadmap</h3>
          <span style="font-size: 15px; color: var(--color-neutral-700);">${r.steps.length + (r.steps.length === 1 ? " step" : " steps")}, in order</span>
        </div>
        ${steps}
        <div style="border-top: 1px solid var(--color-divider);"></div>
      </div>
      ${match}
      <div style="display: flex; flex-direction: column; gap: 18px; background: var(--color-bg); border-radius: var(--radius-lg); padding: 30px 32px;">
        <p style="font-size: 16px; line-height: 1.6; color: var(--color-neutral-800); max-width: 58ch;">This roadmap is a starting point, not a prescription — you know your students and your discipline better than any questionnaire does. Take it to a colleague and compare.</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;" data-noprint="1">
          <button type="button" data-act="print" class="btn btn-primary" style="border-radius: 999px; cursor: pointer;">Print or save as PDF</button>
          <button type="button" data-act="email" class="btn btn-secondary" style="border-radius: 999px; cursor: pointer;">Email it to myself</button>
          <button type="button" data-act="reset" class="btn btn-ghost" style="border-radius: 999px; cursor: pointer;">Start again</button>
        </div>
      </div>
    </div>`;
}

function renderSelfCheck(focusId) {
  const root = $("selfcheck-root");
  root.innerHTML = state.stage === 0 ? renderIntro() : (state.stage <= Q.length ? renderQuestion() : renderDone());
  if (focusId && $(focusId)) $(focusId).focus({ preventScroll: true });
}

function roadmapText() {
  const r = buildRoadmap();
  let s = "MY ASSESSMENT ROADMAP\nAI-Resilient Assessment Toolkit\n\n" + r.ctxLine + "\nProfile: " + r.band.label + "\n\n";
  r.steps.forEach(st => { s += st.n + ". " + st.t + " [impact: " + st.impact + ", effort: " + st.effort + "]\n" + st.d + "\n\n"; });
  return s;
}

function printRoadmap() {
  const src = $("roadmap-print");
  if (!src) return;
  $("roadmap-sheet")?.remove();
  const sheet = document.createElement("div");
  sheet.id = "roadmap-sheet";
  const copy = src.cloneNode(true);
  copy.removeAttribute("id");
  sheet.appendChild(copy);
  document.body.appendChild(sheet);
  document.body.classList.add("printing-roadmap");
  const done = () => { document.body.classList.remove("printing-roadmap"); sheet.remove(); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  window.print();
}

function onSelfCheckClick(e) {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const qi = state.stage - 1;
  switch (btn.dataset.act) {
    case "start": state.stage = 1; renderSelfCheck("q-text"); break;
    case "pick":
      state.answers[qi] = +btn.dataset.i;
      renderSelfCheck();
      document.querySelector(`#selfcheck-root [data-act="pick"][data-i="${btn.dataset.i}"]`)?.focus();
      break;
    case "next":
      if (state.answers[qi] === undefined) return;
      state.stage += 1;
      renderSelfCheck(state.stage > Q.length ? "roadmap-title" : "q-text");
      break;
    case "back": state.stage = Math.max(0, state.stage - 1); renderSelfCheck(state.stage ? "q-text" : null); break;
    case "reset": state.stage = 1; state.answers = {}; renderSelfCheck("q-text"); scrollToId("selfcheck"); break;
    case "print": printRoadmap(); break;
    case "email":
      window.location.href = "mailto:?subject=" + encodeURIComponent("My assessment roadmap") + "&body=" + encodeURIComponent(roadmapText());
      break;
    case "example": {
      const ex = buildRoadmap().matchEx;
      if (!ex) return;
      state.filter = ex.discipline;
      renderExamples();
      scrollToId("examples");
      break;
    }
  }
}

function pillButton(name, on, attrs, size) {
  const s = pill(on);
  const pad = size === "sm" ? "8px 16px" : "10px 20px";
  const fs = size === "sm" ? 14 : 15;
  return `<button type="button" ${attrs} aria-pressed="${on}" style="cursor: pointer; font: inherit; font-size: ${fs}px; font-weight: 600; padding: ${pad}; border-radius: 999px; border: 1px solid ${s.bd}; background: ${s.bg}; color: ${s.fg};">${esc(name)}</button>`;
}

function renderRedesign() {
  $("type-pills").innerHTML = TYPES.map((t, i) => pillButton(t.name, state.type === i, `data-type="${i}"`)).join("");
  const wiz = TYPES[state.type];
  $("wiz-risk").textContent = wiz.risk;
  $("wiz-before").textContent = wiz.before;
  $("wiz-after").textContent = wiz.after;
  $("wiz-moves").innerHTML = wiz.moves.map((m, i) => `
    <div style="display: flex; gap: 18px; align-items: flex-start; background: var(--color-neutral-100); border-radius: var(--radius-lg); padding: 22px 24px;">
      <span style="width: 34px; height: 34px; flex: none; border-radius: 999px; background: var(--color-accent-200); color: var(--color-accent-800); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 15px;">${i + 1}</span>
      <div>
        <h3 style="font-size: 18px; margin-bottom: 6px;">${esc(m.t)}</h3>
        <p style="font-size: 15px; line-height: 1.55; color: var(--color-neutral-800);">${esc(m.d)}</p>
      </div>
    </div>`).join("");
}

function renderExamples() {
  $("example-filters").innerHTML = FILTERS.map(f => pillButton(f, state.filter === f, `data-filter="${esc(f)}"`, "sm")).join("");
  $("example-grid").innerHTML = EXAMPLES
    .filter(e => state.filter === "All" || e.discipline === state.filter)
    .map(e => `
      <div style="background: var(--color-neutral-100); border-radius: var(--radius-lg); padding: 26px; display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="tag tag-neutral">${esc(e.discipline)}</span>
          <span class="tag tag-outline">${esc(e.format)}</span>
        </div>
        <h3 style="font-size: 19px; line-height: 1.25;">${esc(e.title)}</h3>
        <p style="font-size: 15px; line-height: 1.55; color: var(--color-neutral-800);">${esc(e.body)}</p>
        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--color-divider); font-size: 14px;">
          <span style="font-weight: 700; color: ${AI_COLORS[e.ai]};">AI: ${esc(e.ai)}</span>
          <span style="color: var(--color-neutral-700);"> · ${esc(e.aiNote)}</span>
        </div>
      </div>`).join("");
}

function init() {
  renderSelfCheck();
  renderRedesign();
  renderExamples();

  $("selfcheck-root").addEventListener("click", onSelfCheckClick);
  $("type-pills").addEventListener("click", e => {
    const b = e.target.closest("[data-type]");
    if (b) { state.type = +b.dataset.type; renderRedesign(); $("type-pills").querySelector(`[data-type="${b.dataset.type}"]`).focus(); }
  });
  $("example-filters").addEventListener("click", e => {
    const b = e.target.closest("[data-filter]");
    if (b) { state.filter = b.dataset.filter; renderExamples(); $("example-filters").querySelector(`[data-filter="${b.dataset.filter}"]`).focus(); }
  });

  // "Policy" in the header opens the collapsed policy list before scrolling to it
  document.querySelectorAll("[data-open-policies]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    const d = document.querySelector("#policies details");
    if (d) d.open = true;
    scrollToId("policies");
  }));

  $("form-send").addEventListener("click", () => {
    const body = "Name: " + $("form-name").value + "\nInstitution: " + $("form-inst").value + "\n\n" + $("form-msg").value;
    window.location.href = "mailto:bulut@ualberta.ca?subject=" +
      encodeURIComponent("Sustainable Assessment toolkit — collaboration") +
      "&body=" + encodeURIComponent(body);
  });

  // The partner map iframe reports its content height so it never scrolls internally
  window.addEventListener("message", e => {
    if (!e.data || e.data.type !== "partnerMapHeight") return;
    const fr = $("partner-map-frame");
    if (fr) fr.style.height = Math.max(420, e.data.height) + "px";
  });
}

init();
