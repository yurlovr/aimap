const root = document.getElementById('form-cta');

if (root) {
  const card = root.querySelector('.form-cta__card');
  const inner = root.querySelector('.form-cta__inner');
  const title = root.querySelector('.form-cta__title');
  const form = root.querySelector('.form-cta__form');
  const success = root.querySelector('.form-cta__success');
  const thanksBtn = root.querySelector('.form-cta__thanks');
  const formError = root.querySelector('.form-cta__form-error');
  const submitBtn = form.querySelector('.form-cta__submit');
  const consent = form.elements.consent;
  const fields = [...form.querySelectorAll('[data-field]')];

  const getInput = (field) => field.querySelector('.form-cta__control');

  const validators = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Введите имя'),
    phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Введите корректный номер телефона'),
    company: (v) => (v.trim().length >= 2 ? '' : 'Введите название компании'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Введите корректный email'),
  };

  function setError(field, message) {
    const input = getInput(field);
    field.classList.toggle('is-error', Boolean(message));
    const errorEl = field.querySelector('.form-cta__error');
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(field) {
    const input = getInput(field);
    const rule = validators[input.name];
    const message = rule ? rule(input.value) : '';
    setError(field, message);
    return !message;
  }

  function updateSubmit() {
    const filled = fields.every((f) => {
      const input = getInput(f);
      return !input.required || input.value.trim() !== '';
    });
    submitBtn.disabled = !(filled && consent.checked);
  }

  form.addEventListener('input', (e) => {
    const input = e.target;

    if (input.name === 'phone') {
      input.value = input.value.replace(/[^\d+()\-\s]/g, '');
    }

    const field = input.closest('[data-field]');
    if (field?.classList.contains('is-error')) validateField(field);

    formError.hidden = true;
    updateSubmit();
  });

  form.addEventListener('change', updateSubmit);

  form.addEventListener('focusout', (e) => {
    const field = e.target.closest?.('[data-field]');
    if (field && !field.contains(e.relatedTarget)) validateField(field);
  });

  /* ---------- Отправка ---------- */
  async function sendForm(data) {
    // TODO: заменить на реальный эндпоинт (тот же, что и у модального окна)
    // const res = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!res.ok) throw new Error('Request failed');
    console.log('form-cta', data);
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  function showSuccess() {
    card.style.minHeight = `${card.offsetHeight}px`;
    inner.hidden = true;
    success.hidden = false;
    thanksBtn.focus({ preventScroll: true });
  }

  function resetForm() {
    form.reset();
    fields.forEach((f) => setError(f, ''));
    formError.hidden = true;
    success.hidden = true;
    inner.hidden = false;
    card.style.minHeight = '';
    updateSubmit();

    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const results = fields.map(validateField);
    if (!results.every(Boolean)) {
      form.querySelector('.form-cta__field.is-error .form-cta__control')?.focus();
      return;
    }

    submitBtn.disabled = true;
    formError.hidden = true;

    try {
      const { consent: _consent, ...data } = Object.fromEntries(new FormData(form));
      await sendForm(data);
      showSuccess();
    } catch (err) {
      formError.hidden = false;
      submitBtn.disabled = false;
    }
  });

  thanksBtn.addEventListener('click', resetForm);

  updateSubmit();
}