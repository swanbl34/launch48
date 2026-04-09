import './partenaires.css';

const PASSWORD = 'Launch48.2026';
const STORAGE_KEY = 'launch48-partner-access';

const setupTheme = () => {
  const savedTheme = localStorage.getItem('launch48-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme;
  }

  const updateToggle = () => {
    const currentTheme = document.documentElement.dataset.theme || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const currentLabel = currentTheme === 'light' ? 'clair' : 'sombre';
    const nextLabel = nextTheme === 'light' ? 'clair' : 'sombre';

    document.querySelectorAll('.theme-toggle').forEach((toggle) => {
      toggle.dataset.theme = currentTheme;
      toggle.dataset.nextTheme = nextTheme;
      toggle.setAttribute('aria-checked', String(currentTheme === 'light'));
      toggle.setAttribute('aria-label', `Activer le mode ${nextLabel}`);
      toggle.setAttribute('title', `Thème actuel : ${currentLabel}`);
    });
  };

  updateToggle();

  document.querySelectorAll('.theme-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('launch48-theme', nextTheme);
      updateToggle();
    });
  });
};

const setupPartnerGate = () => {
  const form = document.getElementById('partner-lock-form');
  const input = document.getElementById('partner-password');
  const error = document.getElementById('partner-lock-error');

  if (!form || !input || !error) {
    return;
  }

  const unlock = () => {
    document.body.classList.remove('partners-page--locked');
    document.body.classList.add('partners-page--unlocked');
  };

  if (sessionStorage.getItem(STORAGE_KEY) === 'granted') {
    unlock();
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submittedPassword = input.value.trim();

    if (submittedPassword === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'granted');
      error.textContent = '';
      input.value = '';
      unlock();
      return;
    }

    error.textContent = 'Mot de passe incorrect.';
    input.select();
  });
};

const setupPartnerForm = () => {
  const form = document.getElementById('partners-form');
  const feedback = document.getElementById('partners-form-feedback');

  if (!form || !feedback) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const whatsapp = String(formData.get('whatsapp') || '').trim();

    const subject = encodeURIComponent('Programme partenaire Launch48');
    const body = encodeURIComponent(
      [
        'Bonjour Launch48,',
        '',
        "Je souhaite rejoindre le programme partenaire.",
        '',
        `Nom : ${name}`,
        `Email : ${email}`,
        `WhatsApp : ${whatsapp}`
      ].join('\n')
    );

    feedback.textContent = 'Ouverture de votre email...';
    window.location.href = `mailto:contact@launch48.fr?subject=${subject}&body=${body}`;
  });
};

setupTheme();
setupPartnerGate();
setupPartnerForm();
