import './legal.css';

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

setupTheme();
