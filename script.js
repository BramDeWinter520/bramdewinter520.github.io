const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const requestType = document.getElementById('requestType');
const subjectInput = document.getElementById('subject');
const subjectField = document.getElementById('subjectField');
const replyToField = document.getElementById('replyToField');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
});

requestType.addEventListener('change', () => {
  const prefix = requestType.value ? `[${requestType.value}] ` : '';
  subjectField.value = `${prefix}${subjectInput.value.trim() || 'New website enquiry'}`;
});

subjectInput.addEventListener('input', () => {
  const prefix = requestType.value ? `[${requestType.value}] ` : '';
  subjectField.value = `${prefix}${subjectInput.value.trim() || 'New website enquiry'}`;
});

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const requestTypeValue = requestType.value;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = subjectInput.value.trim();
  const message = document.getElementById('message').value.trim();
  const honey = contactForm.querySelector('input[name="_honey"]').value.trim();

  if (honey) {
    formStatus.textContent = 'Submission blocked.';
    return;
  }

  const emailSubject = `[${requestTypeValue}] ${subject}`;
  subjectField.value = emailSubject;
  replyToField.value = email;

  const payload = {
    name,
    email,
    requestType: requestTypeValue,
    subject,
    message,
    _subject: emailSubject,
    _replyto: email,
    _captcha: 'false',
    _template: 'table'
  };

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formStatus.textContent = 'Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    contactForm.reset();
    subjectField.value = 'New website enquiry';
    replyToField.value = '';
    formStatus.textContent = 'Thanks — your message has been sent.';
  } catch (error) {
    formStatus.textContent = 'Something went wrong. Please email bd520@cam.ac.uk directly.';
  } finally {
    submitButton.disabled = false;
  }
});
