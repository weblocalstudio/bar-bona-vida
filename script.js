document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdown = document.querySelector('.dropdown');

  // 1. Apertura / Cierre del menú lateral (Drawer)
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // 2. Desplegable independiente en móvil (Flecha abre/cierra submenú)
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
  }

  // 3. Lógica de Píldoras de Menú (Auto-selección + Scrollspy)
  const catBtns = document.querySelectorAll('.cat-btn');
  const menuSections = document.querySelectorAll('.menu-group, .allergens-container');
  const categoryContainer = document.querySelector('.category-container');

  function setActiveCategory(targetHash) {
    if (!catBtns.length) return;

    let activeLink = null;

    catBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('href') === targetHash) {
        btn.classList.add('active');
        activeLink = btn;
      }
    });

    if (!activeLink && catBtns.length > 0) {
      catBtns[0].classList.add('active');
      activeLink = catBtns[0];
    }

    if (activeLink && categoryContainer) {
      const btnLeft = activeLink.offsetLeft;
      const btnWidth = activeLink.offsetWidth;
      const containerWidth = categoryContainer.offsetWidth;
      categoryContainer.scrollTo({
        left: btnLeft - (containerWidth / 2) + (btnWidth / 2),
        behavior: 'smooth'
      });
    }
  }

  const currentHash = window.location.hash;
  if (currentHash) {
    setActiveCategory(currentHash);
  } else {
    setActiveCategory('#tapas');
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (hash.startsWith('#')) {
        setActiveCategory(hash);
      }
    });
  });

  if (menuSections.length > 0 && catBtns.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          setActiveCategory(id);
        }
      });
    }, observerOptions);

    menuSections.forEach(section => observer.observe(section));
  }
});
