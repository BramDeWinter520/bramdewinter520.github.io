const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const requestType = document.getElementById('requestType');
const subjectInput = document.getElementById('subject');
const subjectField = document.getElementById('subjectField');
const replyToField = document.getElementById('replyToField');

function syncSubject() {
  const request = requestType.value ? `[${requestType.value}] ` : '';
  const subject = subjectInput.value.trim() || 'New website enquiry';
  subjectField.value = `${request}${subject}`;
}

menuBtn?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

requestType?.addEventListener('change', syncSubject);
subjectInput?.addEventListener('input', syncSubject);
syncSubject();

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const honeypot = contactForm.querySelector('input[name="_honey"]');
  if (honeypot && honeypot.value.trim()) {
    formStatus.textContent = 'Submission blocked.';
    return;
  }

  const email = document.getElementById('email').value.trim();
  const submitButton = contactForm.querySelector('button[type="submit"]');

  syncSubject();
  replyToField.value = email;

  const formData = new FormData(contactForm);
  formData.set('_subject', subjectField.value);
  formData.set('_replyto', email);

  submitButton.disabled = true;
  formStatus.textContent = 'Sending...';

  try {
    const response = await fetch('https://formsubmit.co/ajax/bd520@cam.ac.uk', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
    });

    if (!response.ok) throw new Error('Form submission failed');

    contactForm.reset();
    subjectField.value = 'New website enquiry';
    replyToField.value = '';
    formStatus.textContent = 'Thanks — your message has been sent.';
  } catch (error) {
    formStatus.textContent = 'Could not send the form right now. Please email bd520@cam.ac.uk directly.';
  } finally {
    submitButton.disabled = false;
  }
});
