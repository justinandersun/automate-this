'use strict';

// ============================================================
// Calculation Engine
// ============================================================

function normalizeOccurrenceToMinutes(value, unit) {
  if (unit === 'seconds') return value / 60;
  if (unit === 'minutes') return value;
  if (unit === 'hours')   return value * 60;
  if (unit === 'days')    return value * 8 * 60;
  if (unit === 'weeks')   return value * 40 * 60;
  if (unit === 'months')  return value * 160 * 60;
  if (unit === 'years')   return value * 2080 * 60;
  throw new Error('Unknown occurrence unit: ' + unit);
}

function normalizeFrequencyToPerYear(freq, period) {
  if (period === 'seconds') return freq * 260 * 8 * 3600;
  if (period === 'minutes') return freq * 260 * 8 * 60;
  if (period === 'hours')   return freq * 260 * 8;
  if (period === 'days')    return freq * 260;
  if (period === 'weeks')   return freq * 52;
  if (period === 'months')  return freq * 12;
  if (period === 'years')   return freq * 1;
  throw new Error('Unknown occurrence period: ' + period);
}

function normalizeAutomationToHours(value, unit) {
  if (unit === 'seconds') return value / 3600;
  if (unit === 'minutes') return value / 60;
  if (unit === 'hours')   return value;
  if (unit === 'days')    return value * 8;
  if (unit === 'weeks')   return value * 40;
  if (unit === 'months')  return value * 160;
  if (unit === 'years')   return value * 2080;
  throw new Error('Unknown automate unit: ' + unit);
}

function calculate(inputs) {
  const {
    hours_per_occurrence,
    occurrence_unit,
    occurrence_frequency,
    occurrence_period,
    hours_to_automate,
    automate_unit,
    annual_salary,
  } = inputs;

  // Step 1 — Normalize time-per-occurrence to minutes
  const time_per_occurrence_min = normalizeOccurrenceToMinutes(hours_per_occurrence, occurrence_unit);

  // Step 2 — Normalize occurrence frequency to per year
  const occurrences_per_year = normalizeFrequencyToPerYear(occurrence_frequency, occurrence_period);

  // Step 3 — Annual time cost
  const annual_minutes = time_per_occurrence_min * occurrences_per_year;
  const annual_hours   = annual_minutes / 60;

  // Step 4 — Hourly rate
  const hourly_rate = annual_salary / 2080;

  // Step 5 — Annual cost of NOT automating
  const annual_cost = annual_hours * hourly_rate;

  // Step 6 — Normalize automation investment to hours
  const invest_hours = normalizeAutomationToHours(hours_to_automate, automate_unit);

  // Step 7 — Automation investment cost (one-time)
  const invest_cost = invest_hours * hourly_rate;

  // Step 8 — 3-year return
  const three_year_savings = annual_cost * 3;
  const roi_ratio          = three_year_savings / invest_cost;

  // payback_weeks = invest_hours / (annual_hours / 52)
  const payback_weeks = invest_hours / (annual_hours / 52);

  // Step 9 — Verdict
  const verdict = roi_ratio >= 10 ? 'YES' : 'NO';

  return {
    annual_minutes,
    annual_hours,
    hourly_rate,
    annual_cost,
    invest_hours,
    invest_cost,
    three_year_savings,
    roi_ratio,
    payback_weeks,
    verdict,
  };
}

// ============================================================
// Formatters
// ============================================================

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatHours(n) {
  return n.toFixed(1);
}

function formatRoi(n) {
  return n.toFixed(1) + 'x';
}

function formatPayback(n) {
  return n.toFixed(1);
}

// ============================================================
// Tool Data (keyed by task_category)
// ============================================================

const TOOL_DATA = {
  data_entry: [
    {
      name: 'Make',
      slug: 'make',
      description: 'Visual workflow builder for connecting apps and automating data transfers.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'n8n',
      slug: 'n8n',
      description: 'Open-source workflow automation; self-host or cloud.',
      tier: 'Open source',
      complexity: 'Low-code',
    },
    {
      name: 'Microsoft Power Automate',
      slug: 'power-automate',
      description: 'Deep Microsoft 365 integration; handles desktop and cloud flows.',
      tier: 'Paid',
      complexity: 'Low-code',
    },
  ],
  reporting: [
    {
      name: 'Make',
      slug: 'make',
      description: 'Connect your data sources and auto-generate report exports on a schedule.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'Notion',
      slug: 'notion',
      description: 'Build living dashboards that pull from databases; auto-update with integrations.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'n8n',
      slug: 'n8n',
      description: 'Chain API calls to assemble and deliver formatted reports.',
      tier: 'Open source',
      complexity: 'Low-code',
    },
  ],
  notifications: [
    {
      name: 'Make',
      slug: 'make',
      description: 'Trigger Slack, email, or SMS alerts based on any condition in your app stack.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'n8n',
      slug: 'n8n',
      description: 'Custom notification workflows with conditional logic and branching.',
      tier: 'Open source',
      complexity: 'Low-code',
    },
    {
      name: 'Microsoft Power Automate',
      slug: 'power-automate',
      description: 'Native Teams and Outlook alerts; no extra setup for Microsoft shops.',
      tier: 'Paid',
      complexity: 'No-code',
    },
  ],
  file_ops: [
    {
      name: 'Make',
      slug: 'make',
      description: 'Watch folders, rename, convert, and route files across cloud storage.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'n8n',
      slug: 'n8n',
      description: 'Script-friendly file operations with full control over logic.',
      tier: 'Open source',
      complexity: 'Low-code',
    },
    {
      name: 'Microsoft Power Automate',
      slug: 'power-automate',
      description: 'SharePoint and OneDrive file automation built in.',
      tier: 'Paid',
      complexity: 'No-code',
    },
  ],
  scheduling: [
    {
      name: 'Make',
      slug: 'make',
      description: 'Automate calendar invites, reminders, and booking confirmations across tools.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'Notion',
      slug: 'notion',
      description: 'Build a self-updating scheduling hub with linked databases and reminders.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'n8n',
      slug: 'n8n',
      description: 'Custom scheduling logic with API access to any calendar or booking tool.',
      tier: 'Open source',
      complexity: 'Low-code',
    },
  ],
  research: [
    {
      name: 'Make',
      slug: 'make',
      description: 'Pull data from APIs, RSS feeds, or web forms into a single structured output.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'Notion',
      slug: 'notion',
      description: 'Centralize research into a linked database; share with your team.',
      tier: 'Free tier',
      complexity: 'No-code',
    },
    {
      name: 'n8n',
      slug: 'n8n',
      description: 'Scrape, query, and aggregate from multiple sources with full scripting support.',
      tier: 'Open source',
      complexity: 'Low-code',
    },
  ],
};

// ============================================================
// NO quips (selected once per calculation)
// ============================================================
const NO_QUIPS = [
  "You'd spend more time automating this than doing it forever. Keep suffering.",
  "The math doesn't lie. Do it by hand and touch grass.",
  "At this rate, retirement will arrive before the ROI does.",
  "The spreadsheet life has chosen you. Embrace it.",
  "Strong 'not your problem to solve' energy here.",
  "Maybe automate something that actually costs you time?",
];

// ============================================================
// Output Rendering
// ============================================================

function buildBusinessCasePlainText(result, taskDescription) {
  const { annual_hours, annual_cost, invest_hours, invest_cost, payback_weeks, roi_ratio, three_year_savings } = result;
  return (
    `Automating ${taskDescription} will save you approximately ${formatHours(annual_hours)} hours\n` +
    `per year — worth ${formatCurrency(annual_cost)} at your salary. Your one-time investment\n` +
    `of ${formatHours(invest_hours)} hours (${formatCurrency(invest_cost)}) pays for itself in ${formatPayback(payback_weeks)} weeks,\n` +
    `returning ${formatRoi(roi_ratio)} over 3 years (${formatCurrency(three_year_savings)} in recovered time).\n\n` +
    `Automate it.`
  );
}

function renderToolCard(tool) {
  return (
    `<div class="tool-card">` +
      `<a class="tool-card__name" href="#affiliate-${tool.slug}">${tool.name}</a>` +
      `<p class="tool-card__description">${tool.description}</p>` +
      `<div class="tool-card__badges">` +
        `<span class="tool-card__badge tool-card__badge--tier">${tool.tier}</span>` +
        `<span class="tool-card__badge">${tool.complexity}</span>` +
      `</div>` +
    `</div>`
  );
}

function renderTools(category) {
  const tools = TOOL_DATA[category];
  const toolsSection = document.getElementById('tools-section');
  toolsSection.className = 'tools-section';
  toolsSection.innerHTML =
    `<h2 class="tools-heading">Where to start</h2>` +
    `<div class="tools-grid">${tools.map(renderToolCard).join('')}</div>` +
    `<p class="tools-footnote">* Links may earn a commission.</p>`;
  toolsSection.removeAttribute('hidden');
}

function renderYes(result, taskDescription, taskCategory) {
  const { annual_hours, annual_cost, invest_hours, invest_cost, payback_weeks, roi_ratio, three_year_savings } = result;

  // Verdict
  const verdictEl = document.getElementById('verdict');
  verdictEl.className = 'verdict verdict--yes';
  verdictEl.innerHTML = '<span class="verdict-icon" aria-hidden="true">✓</span> Yes, automate it.';

  // Business case block
  const plainText = buildBusinessCasePlainText(result, taskDescription);

  // Build HTML version with mono spans on numbers
  const htmlText =
    `Automating <em>${taskDescription}</em> will save you approximately ` +
    `<span class="mono">${formatHours(annual_hours)} hours</span> ` +
    `per year — worth <span class="mono">${formatCurrency(annual_cost)}</span> at your salary. ` +
    `Your one-time investment of <span class="mono">${formatHours(invest_hours)} hours</span> ` +
    `(<span class="mono">${formatCurrency(invest_cost)}</span>) pays for itself in ` +
    `<span class="mono">${formatPayback(payback_weeks)} weeks</span>, ` +
    `returning <span class="mono">${formatRoi(roi_ratio)}</span> over 3 years ` +
    `(<span class="mono">${formatCurrency(three_year_savings)}</span> in recovered time).\n\nAutomate it.`;

  const resultEl = document.getElementById('result-content');
  resultEl.innerHTML =
    `<div class="business-case">${htmlText}</div>` +
    `<div class="action-btns">` +
      `<button type="button" class="copy-btn" id="copy-btn">Copy business case</button>` +
      `<button type="button" class="share-btn" id="share-btn">Share</button>` +
    `</div>`;

  document.getElementById('copy-btn').addEventListener('click', function () {
    navigator.clipboard.writeText(plainText).then(() => {
      this.textContent = 'Copied!';
      this.classList.add('copied');
      setTimeout(() => {
        this.textContent = 'Copy business case';
        this.classList.remove('copied');
      }, 2000);
    });
  });

  document.getElementById('share-btn').addEventListener('click', function () {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.textContent = 'Link copied!';
      this.classList.add('shared');
      setTimeout(() => {
        this.textContent = 'Share';
        this.classList.remove('shared');
      }, 2000);
    });
  });

  renderTools(taskCategory);
}

function renderNo(result) {
  const { annual_cost, invest_cost, roi_ratio } = result;

  const quip = NO_QUIPS[Math.floor(Math.random() * NO_QUIPS.length)];

  // Verdict
  const verdictEl = document.getElementById('verdict');
  verdictEl.className = 'verdict verdict--no';
  verdictEl.innerHTML = '<span class="verdict-icon" aria-hidden="true">✕</span> No, not worth it.';

  const resultEl = document.getElementById('result-content');
  resultEl.innerHTML =
    `<p class="no-quip">${quip}</p>` +
    `<p class="no-stats">` +
    `Your time cost: <span class="mono">${formatCurrency(annual_cost)}/year</span>. ` +
    `Automation cost: <span class="mono">${formatCurrency(invest_cost)}</span>. ` +
    `ROI: <span class="mono">${formatRoi(roi_ratio)}</span> over 3 years. ` +
    `Threshold is <span class="mono">10x</span>.` +
    `</p>` +
    `<div class="action-btns">` +
      `<button type="button" class="share-btn" id="share-btn">Share</button>` +
    `</div>`;

  document.getElementById('share-btn').addEventListener('click', function () {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.textContent = 'Link copied!';
      this.classList.add('shared');
      setTimeout(() => {
        this.textContent = 'Share';
        this.classList.remove('shared');
      }, 2000);
    });
  });

  // Hide tool recommendations
  const toolsSection = document.getElementById('tools-section');
  toolsSection.setAttribute('hidden', '');
  toolsSection.innerHTML = '';
}

// ============================================================
// Validation
// ============================================================

function showError(input, message) {
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  const errId = input.id + '-error';
  let errEl = document.getElementById(errId);
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.id = errId;
    errEl.className = 'visually-hidden';
    errEl.setAttribute('role', 'alert');
    input.parentNode.insertBefore(errEl, input.nextSibling);
  }
  errEl.textContent = message;
  input.setAttribute('aria-describedby', errId);
}

function clearError(input) {
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  const errId = input.id + '-error';
  const errEl = document.getElementById(errId);
  if (errEl) errEl.textContent = '';
}

function validateNumberInput(input, opts) {
  const raw = input.value.trim();
  if (raw === '') {
    showError(input, opts.label + ' is required.');
    return false;
  }
  const val = parseFloat(raw);
  if (isNaN(val) || val <= 0) {
    showError(input, opts.label + ' must be a positive number.');
    return false;
  }
  if (opts.integer && !Number.isInteger(val)) {
    showError(input, opts.label + ' must be a whole number.');
    return false;
  }
  clearError(input);
  return true;
}

function validateTextInput(input, label) {
  const raw = input.value.trim();
  if (raw === '') {
    showError(input, label + ' is required.');
    return false;
  }
  clearError(input);
  return true;
}

function getNumericSalary(input) {
  return parseFloat(input.value.replace(/,/g, ''));
}

function getFormValues() {
  const hoursPerOcc   = document.getElementById('hours_per_occurrence');
  const occFreq       = document.getElementById('occurrence_frequency');
  const taskDesc      = document.getElementById('task_description');
  const hoursToAuto   = document.getElementById('hours_to_automate');
  const salary        = document.getElementById('annual_salary');

  let valid = true;

  if (!validateNumberInput(hoursPerOcc, { label: 'Time per occurrence' })) valid = false;
  if (!validateNumberInput(occFreq, { label: 'Frequency', integer: true })) valid = false;
  if (!validateTextInput(taskDesc, 'Task description')) valid = false;
  if (!validateNumberInput(hoursToAuto, { label: 'Time to automate' })) valid = false;

  // Validate salary (may contain commas)
  const salaryRaw = salary.value.trim();
  if (salaryRaw === '') {
    showError(salary, 'Annual salary is required.');
    valid = false;
  } else {
    const salaryNum = getNumericSalary(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      showError(salary, 'Annual salary must be a positive number.');
      valid = false;
    } else {
      clearError(salary);
    }
  }

  if (!valid) return null;

  return {
    hours_per_occurrence: parseFloat(hoursPerOcc.value),
    occurrence_unit:      document.getElementById('occurrence_unit').value,
    occurrence_frequency: parseInt(occFreq.value, 10),
    occurrence_period:    document.getElementById('occurrence_period').value,
    task_category:        document.getElementById('task_category').value,
    task_description:     taskDesc.value.trim(),
    hours_to_automate:    parseFloat(hoursToAuto.value),
    automate_unit:        document.getElementById('automate_unit').value,
    annual_salary:        getNumericSalary(salary),
  };
}

// ============================================================
// Salary field: format on blur, strip on focus
// ============================================================

function initSalaryFormatting() {
  const salary = document.getElementById('annual_salary');

  salary.addEventListener('blur', function () {
    const num = getNumericSalary(this);
    if (!isNaN(num) && num > 0) {
      this.value = Math.round(num).toLocaleString('en-US');
    }
  });

  salary.addEventListener('focus', function () {
    const num = getNumericSalary(this);
    if (!isNaN(num)) {
      this.value = String(Math.round(num));
    }
  });
}

// ============================================================
// Blur validation listeners
// ============================================================

function initBlurValidation() {
  const numberFields = [
    { id: 'hours_per_occurrence', opts: { label: 'Time per occurrence' } },
    { id: 'occurrence_frequency', opts: { label: 'Frequency', integer: true } },
    { id: 'hours_to_automate',    opts: { label: 'Time to automate' } },
  ];

  numberFields.forEach(({ id, opts }) => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => validateNumberInput(el, opts));
    el.addEventListener('input', () => { if (el.classList.contains('is-invalid')) validateNumberInput(el, opts); });
  });

  const taskDesc = document.getElementById('task_description');
  taskDesc.addEventListener('blur', () => validateTextInput(taskDesc, 'Task description'));
  taskDesc.addEventListener('input', () => { if (taskDesc.classList.contains('is-invalid')) validateTextInput(taskDesc, 'Task description'); });

  const salary = document.getElementById('annual_salary');
  salary.addEventListener('blur', function () {
    const salaryRaw = this.value.trim();
    if (salaryRaw === '') {
      showError(this, 'Annual salary is required.');
      return;
    }
    const num = getNumericSalary(this);
    if (isNaN(num) || num <= 0) {
      showError(this, 'Annual salary must be a positive number.');
    } else {
      clearError(this);
    }
  });
}

// ============================================================
// Form Submit
// ============================================================

function initForm() {
  const form      = document.getElementById('calc-form');
  const output    = document.getElementById('output');
  const formError = document.getElementById('form-error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formError.textContent = '';

    const inputs = getFormValues();
    if (!inputs) {
      formError.textContent = 'Please fill in all fields correctly before calculating.';
      // Focus first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const { task_description, task_category, ...calcInputs } = inputs;
    const result = calculate(calcInputs);

    // Write all inputs to the URL so it's shareable
    updateURL(inputs);

    // Remove old animation class to allow re-trigger
    output.removeAttribute('hidden');
    output.style.animation = 'none';
    // Force reflow
    void output.offsetWidth;
    output.style.animation = '';

    if (result.verdict === 'YES') {
      renderYes(result, task_description, task_category);
    } else {
      renderNo(result);
    }

    // Scroll output into view
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ============================================================
// Init
// ============================================================

// ============================================================
// Auto-resize inline inputs and selects to fit their content
// ============================================================

function initAutoResize() {
  // Hidden ruler span — matches the sentence font so measurements are accurate
  const ruler = document.createElement('span');
  ruler.setAttribute('aria-hidden', 'true');
  ruler.style.cssText = [
    'position:absolute',
    'top:-9999px',
    'left:-9999px',
    'visibility:hidden',
    'white-space:pre',
    'font-family:Fraunces,Georgia,serif',
    'font-size:1.75rem',   /* matches .sentence font-size */
    'font-weight:600',     /* matches input/select font-weight */
  ].join(';');
  document.body.appendChild(ruler);

  function measure(text) {
    ruler.textContent = text;
    return ruler.offsetWidth;
  }

  function resizeInput(input) {
    const text = input.value || input.placeholder || '';
    const minW = parseFloat(getComputedStyle(input).minWidth) || 0;
    input.style.width = Math.max(measure(text) + 20, minW) + 'px';
  }

  function resizeSelect(select) {
    const opt = select.options[select.selectedIndex];
    const text = opt ? opt.text : '';
    const minW = parseFloat(getComputedStyle(select).minWidth) || 0;
    const maxW = parseFloat(select.dataset.maxw) || Infinity;
    select.style.width = Math.min(Math.max(measure(text) + 44, minW), maxW) + 'px';
  }

  // Wire up listeners once
  document.querySelectorAll('.inline-input').forEach(function (input) {
    input.addEventListener('input', function () { resizeInput(input); });
    // After blur, salary value may have gained commas — resize to match
    input.addEventListener('blur', function () { setTimeout(function () { resizeInput(input); }, 0); });
  });
  document.querySelectorAll('.inline-select').forEach(function (select) {
    select.addEventListener('change', function () { resizeSelect(select); });
  });

  // Size everything now, then again once fonts are confirmed loaded
  function resizeAll() {
    document.querySelectorAll('.inline-input').forEach(resizeInput);
    document.querySelectorAll('.inline-select').forEach(resizeSelect);
  }
  resizeAll();
  document.fonts.ready.then(resizeAll);
}

// ============================================================
// Init
// ============================================================

// ============================================================
// URL params — write on calculate, read on load
// ============================================================

function updateURL(inputs) {
  const p = new URLSearchParams({
    hpo: inputs.hours_per_occurrence,
    ou:  inputs.occurrence_unit,
    of:  inputs.occurrence_frequency,
    op:  inputs.occurrence_period,
    tc:  inputs.task_category,
    td:  inputs.task_description,
    hta: inputs.hours_to_automate,
    au:  inputs.automate_unit,
    sal: inputs.annual_salary,
  });
  history.replaceState(null, '', '?' + p.toString());
}

function loadFromURL() {
  const params = new URLSearchParams(location.search);
  const map = [
    ['hpo', 'hours_per_occurrence'],
    ['ou',  'occurrence_unit'],
    ['of',  'occurrence_frequency'],
    ['op',  'occurrence_period'],
    ['tc',  'task_category'],
    ['td',  'task_description'],
    ['hta', 'hours_to_automate'],
    ['au',  'automate_unit'],
    ['sal', 'annual_salary'],
  ];
  let filled = 0;
  map.forEach(function ([key, id]) {
    const val = params.get(key);
    if (val !== null) {
      const el = document.getElementById(id);
      if (el) { el.value = val; filled++; }
    }
  });
  // Format salary display if it was loaded
  if (params.get('sal')) {
    const salEl = document.getElementById('annual_salary');
    const num = parseFloat(salEl.value);
    if (!isNaN(num) && num > 0) {
      salEl.value = Math.round(num).toLocaleString('en-US');
    }
  }
  return filled === map.length;
}

// ============================================================
// Init
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  initSalaryFormatting();
  initBlurValidation();
  initForm();

  const hasURLParams = loadFromURL();
  initAutoResize();

  // Auto-calculate if all params were present in the URL
  if (hasURLParams) {
    requestAnimationFrame(function () {
      document.getElementById('calc-form').dispatchEvent(new Event('submit'));
    });
  }
});
