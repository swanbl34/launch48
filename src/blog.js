import './blog.css';

const setupTheme = () => {
  const saved = localStorage.getItem('launch48-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }

  const updateLabel = () => {
    const current = document.documentElement.dataset.theme || 'dark';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    const currentLabel = current === 'light' ? 'clair' : 'sombre';
    const nextLabel = nextTheme === 'light' ? 'clair' : 'sombre';
    document.querySelectorAll('.theme-toggle').forEach((toggle) => {
      toggle.dataset.theme = current;
      toggle.dataset.nextTheme = nextTheme;
      toggle.setAttribute('aria-checked', String(current === 'light'));
      toggle.setAttribute('aria-label', `Activer le mode ${nextLabel}`);
      toggle.setAttribute('title', `Theme actuel : ${currentLabel}`);
    });
  };

  updateLabel();
  document.querySelectorAll('.theme-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('launch48-theme', next);
      updateLabel();
    });
  });
};

const setupMobileNav = () => {
  const burger = document.querySelector('.nav-burger');
  const panel = document.querySelector('.nav-mobile');
  if (!burger || !panel) return;

  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
};

const setupNavDropdown = () => {
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  if (dropdowns.length === 0) return;
  const desktopQuery = window.matchMedia('(min-width: 760px)');

  const closeAll = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('is-open', 'is-hovered');
      const toggle = dropdown.querySelector('.nav-dropdown__toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  };

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.nav-dropdown__toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (event) => {
      if (desktopQuery.matches) return;
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains('is-open');
      closeAll();
      dropdown.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    dropdown.addEventListener('mouseenter', () => {
      if (!desktopQuery.matches) return;
      closeAll();
      dropdown.classList.add('is-hovered');
      toggle.setAttribute('aria-expanded', 'true');
    });

    dropdown.addEventListener('mouseleave', () => {
      if (!desktopQuery.matches) return;
      dropdown.classList.remove('is-hovered');
      toggle.setAttribute('aria-expanded', 'false');
    });

    dropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeAll);
    });
  });

  document.addEventListener('click', (event) => {
    if (!dropdowns.some((dropdown) => dropdown.contains(event.target))) {
      closeAll();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
};

const setupResponsiveNavVisibility = () => {
  const desktopOnlyNodes = document.querySelectorAll('.nav-cta-desktop, .nav-theme-desktop');
  if (desktopOnlyNodes.length === 0) return;

  const mediaQuery = window.matchMedia('(min-width: 760px)');
  const sync = () => {
    desktopOnlyNodes.forEach((node) => {
      node.hidden = !mediaQuery.matches;
    });
  };

  sync();
  mediaQuery.addEventListener('change', sync);
};

const setupHeaderScrollState = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
};

setupTheme();
setupMobileNav();
setupNavDropdown();
setupResponsiveNavVisibility();
setupHeaderScrollState();
