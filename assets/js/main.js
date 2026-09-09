/* Comportamiento compartido por la versión ES (/) y EN (/en/).
   Sin dependencias: el sitio es estático y se publica en GitHub Pages. */
(function () {
  'use strict';

  // Año del pie de página.
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Menú móvil. El estado vive en la clase .open y se refleja en aria-expanded
  // para que los lectores de pantalla anuncien si está abierto o cerrado.
  var burger = document.getElementById('burgerBtn');
  var navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }

  burger.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // Escape cierra el menú y devuelve el foco al botón que lo abrió.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenu(false);
      burger.focus();
    }
  });

  // Al pasar a escritorio el menú deja de estar desplegado: limpiamos el estado
  // para que aria-expanded no quede mintiendo.
  var desktop = window.matchMedia('(min-width: 861px)');
  var onChange = function (e) { if (e.matches) setMenu(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else desktop.addListener(onChange); // Safari < 14
})();
