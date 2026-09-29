const modal = document.getElementById('contact-modal');

if (modal) {
  const win = modal.querySelector('.modal__window');
  const inner = modal.querySelector('.modal__inner');
  const form = modal.querySelector('.modal__form');
  const success = modal.querySelector('.modal__success');
  const formError = modal.querySelector('.modal__form-error');
  const submitBtn = form.querySelector('.modal__submit');
  const consent = form.elements.consent;
  const fields = [...form.querySelectorAll('[data-field]')];

  const getInput = (field) => field.querySelector('.field__control');

  const validators = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Введите имя'),
    phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Введите корректный номер телефона'),
    company: (v) => (v.trim().length >= 2 ? '' : 'Введите название компании'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Введите корректный email'),
  };

  function setError(field, message) {
    const input = getInput(field);
    field.classList.toggle('is-error', Boolean(message));
    const errorEl = field.querySelector('.field__error');
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
    // TODO: заменить на реальный эндпоинт
    // const res = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!res.ok) throw new Error('Request failed');
    console.log('contact form', data);
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  function showSuccess() {
    win.style.minHeight = `${win.offsetHeight}px`;
    inner.hidden = true;
    success.hidden = false;
    modal.setAttribute('aria-labelledby', 'contact-modal-success-title');
    success.querySelector('.modal__thanks')?.focus();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const results = fields.map(validateField);
    if (!results.every(Boolean)) {
      form.querySelector('.field.is-error .field__control')?.focus();
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

  function resetModal() {
    form.reset();
    fields.forEach((f) => setError(f, ''));
    inner.hidden = false;
    success.hidden = true;
    formError.hidden = true;
    win.style.minHeight = '';
    modal.setAttribute('aria-labelledby', 'contact-modal-title');
    updateSubmit();
  }

  function openModal() {
    if (modal.open) return;
    modal.showModal();
    document.documentElement.classList.add('is-modal-open');
  }

  document.querySelectorAll('[data-modal-open="contact-modal"]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => modal.close());
  });

  let pressedOutside = false;
  modal.addEventListener('mousedown', (e) => {
    pressedOutside = !e.target.closest('.modal__window');
  });
  modal.addEventListener('click', (e) => {
    if (pressedOutside && !e.target.closest('.modal__window')) modal.close();
  });

  modal.addEventListener('close', () => {
    document.documentElement.classList.remove('is-modal-open');
    resetModal();
  });

  updateSubmit();
}