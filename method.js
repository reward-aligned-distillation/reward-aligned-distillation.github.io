/* Buildless, illustrative RAD explainer. No models run in this component. */
(() => {
  const host = document.getElementById('rad-method');
  if (!host) return;
  const tokens = [
    { text: "Let's solve", score: 0.08 },
    { text: '3x + 5 = 20', score: 0.24 },
    { text: 'subtract 5', score: 0.72 },
    { text: '3x = 15', score: 0.94 },
    { text: 'Wait,', score: -0.86 },
    { text: 'x = 5', score: 0.88 }
  ];
  const steps = [
    ['Initialize', 'Start from the current student θ and its optimizer state. Sample training responses, get teacher supervision, and initialize all token weights at c. This illustration uses c = 0.'],
    ['Look ahead', 'Take one temporary optimizer step at the origin weights c. RAD uses AdamW with its current optimizer state; the temporary student θ⁺ is used to estimate post-update reward.'],
    ['Score tokens', 'Sample fresh reward rollouts from θ⁺. Differentiate through the optimizer to form p, then score each training token at the original θ: Iₜ = −⟨∇θ ℓD,t, p⟩. A positive score favors increasing its weight.'],
    ['Project weights', 'Apply one projected ascent step: wₜ = clip(c + γ Iₜ, c − 1, c + 1). Here c = 0, so the allowed interval is [−1, +1]. Adjust γ to see suppression, signed weights, and clipping.'],
    ['Commit update', 'Discard the temporary parameters and optimizer state. Apply the weighted distillation update from the original θ and original optimizer state. Reset the weights to c for the next batch.']
  ];
  const state = { mode: 'rad', gamma: 1, step: 3, token: 3 };
  const make = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  const signed = value => `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(2)}`;
  const projected = score => Math.max(-1, Math.min(1, state.gamma * score));
  const weight = score => state.mode === 'opd' ? 1 : state.step < 3 ? 0 : projected(score);
  const controls = make('div', 'method-controls');
  const toggles = make('div', 'method-toggle');
  toggles.setAttribute('role', 'group');
  toggles.setAttribute('aria-label', 'Distillation method');
  const modeButtons = ['opd', 'rad'].map(mode => {
    const button = make('button', '', mode === 'opd' ? 'Uniform OPD' : 'RAD');
    button.type = 'button';
    button.addEventListener('click', () => { state.mode = mode; render(); });
    toggles.append(button);
    return button;
  });
  const strength = make('div', 'method-strength');
  const label = make('label', '', 'Weight step size γ');
  label.htmlFor = 'method-gamma';
  const slider = make('input');
  slider.id = 'method-gamma';
  slider.type = 'range';
  slider.min = '0'; slider.max = '2'; slider.step = '0.05'; slider.value = '1';
  const output = make('output');
  output.htmlFor = slider.id;
  slider.addEventListener('input', () => { state.gamma = Number(slider.value); render(); });
  strength.append(label, slider, output);
  controls.append(toggles, strength);
  const caption = make('p', 'method-illustration-caption', 'Illustrative token fragments and sensitivity scores · c = 0 · no model is running');
  const strip = make('div', 'method-tokens');
  strip.setAttribute('role', 'group');
  strip.setAttribute('aria-label', 'Choose a token to inspect its illustrative weight');
  const tokenNodes = tokens.map((token, index) => {
    const button = make('button', 'method-token');
    button.type = 'button';
    const plot = make('span', 'method-token-plot');
    const baseline = make('span', 'method-token-baseline');
    const bar = make('span', 'method-token-bar');
    plot.setAttribute('aria-hidden', 'true');
    plot.append(baseline, bar);
    const value = make('span', 'method-token-value');
    const text = make('span', 'method-token-label', token.text);
    button.append(plot, value, text);
    button.addEventListener('click', () => { state.token = index; render(); });
    strip.append(button);
    return { button, bar, value };
  });
  const legend = make('p', 'method-legend', 'Positive: follow the teacher’s signal · Near zero: suppress · Negative: reverse its gradient contribution');
  const stepper = make('div', 'method-steps');
  stepper.setAttribute('role', 'group');
  stepper.setAttribute('aria-label', 'Explore one RAD iteration');
  const stepButtons = steps.map(([title], index) => {
    const button = make('button', 'method-step', `${index + 1}. ${title}`);
    button.type = 'button';
    button.addEventListener('click', () => { state.step = index; render(); });
    stepper.append(button);
    return button;
  });
  const detail = make('div', 'method-detail');
  const detailTitle = make('strong');
  const detailText = make('p');
  detail.setAttribute('aria-live', 'polite');
  detail.setAttribute('aria-atomic', 'true');
  detail.append(detailTitle, detailText);
  const tokenNote = make('p', 'method-token-note');
  tokenNote.setAttribute('aria-live', 'polite');
  const note = make('p', 'method-illustration-footnote', 'The scores above are invented to explain the weighting rule. Token meaning does not determine its score; RAD estimates sensitivity through the optimizer. These are not experimental measurements.');
  host.replaceChildren(controls, caption, strip, legend, stepper, detail, tokenNote, note);
  function render() {
    host.dataset.mode = state.mode;
    host.dataset.step = String(state.step);
    modeButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(state.mode === ['opd', 'rad'][index])));
    slider.disabled = state.mode === 'opd';
    output.value = state.gamma.toFixed(2);
    slider.setAttribute('aria-valuetext', `${state.gamma.toFixed(2)}, illustrative weight step size`);
    stepButtons.forEach((button, index) => {
      button.disabled = state.mode === 'opd';
      button.setAttribute('aria-pressed', String(state.mode === 'rad' && state.step === index));
    });
    tokenNodes.forEach(({ button, bar, value }, index) => {
      const w = weight(tokens[index].score);
      const kind = w < -0.001 ? 'negative' : w > 0.001 ? 'positive' : 'zero';
      button.dataset.kind = kind;
      button.setAttribute('aria-pressed', String(index === state.token));
      button.setAttribute('aria-label', `${tokens[index].text}. Weight ${signed(w)}. Illustrative score ${signed(tokens[index].score)}.`);
      button.style.setProperty('--weight', w.toFixed(3));
      button.style.setProperty('--magnitude', Math.abs(w).toFixed(3));
      value.textContent = signed(w);
      bar.style.height = '50%';
      bar.style.bottom = w >= 0 ? '50%' : 'auto';
      bar.style.top = w < 0 ? '50%' : 'auto';
      bar.style.transformOrigin = w >= 0 ? 'center bottom' : 'center top';
      bar.style.transform = `scaleY(${Math.abs(w)})`;
    });
    const [title, text] = state.mode === 'opd'
      ? ['Uniform on-policy distillation', 'Every token gets weight +1.00. Each distillation contribution follows the teacher’s signal with the same weight. Select RAD to inspect a temporary lookahead and projected token weighting.']
      : steps[state.step];
    detailTitle.textContent = title;
    detailText.textContent = text;
    const selected = tokens[state.token];
    const w = weight(selected.score);
    const clipped = Math.abs(state.gamma * selected.score) > 1;
    tokenNote.textContent = state.mode === 'opd'
      ? `“${selected.text}” has weight +1.00, like every other token.`
      : state.step < 3
        ? `“${selected.text}” is initialized at c = 0. Its illustrative sensitivity is ${signed(selected.score)}; the weights change at step 4.`
        : `“${selected.text}”: w = clip(${state.gamma.toFixed(2)} × ${signed(selected.score)}, −1, +1) = ${signed(w)}.${clipped ? ' Projection clips it to the boundary.' : ''} ${w < 0 ? 'This reverses its distillation-gradient contribution.' : w === 0 ? 'This suppresses its contribution.' : 'This follows its distillation-gradient contribution.'}`;
  }
  render();
})();
