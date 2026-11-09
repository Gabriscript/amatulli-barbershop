(function () {
  'use strict';

  /* Booking page of the salon's current site. Empty = "Prenota" scrolls to the footer. */
  var BOOKING_URL = 'https://amatullibarbershop.it/prenota/';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* booking links */
  if (BOOKING_URL) {
    $$('[data-book]').forEach(function (a) {
      a.href = BOOKING_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* curved menu */
  var nav = $('#nav');
  var menuBtn = $('.menu-toggle');
  $$('.nav-list .t').forEach(function (t) {
    t.setAttribute('aria-label', t.textContent);
    t.innerHTML = t.textContent.split('').map(function (ch, i) {
      return '<i aria-hidden="true" style="--i:' + i + '">' + (ch === ' ' ? '&nbsp;' : ch) + '</i>';
    }).join('');
  });
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });

  /* header hairline once the page has scrolled (observer, no scroll listener) */
  var header = $('.site-header');
  new IntersectionObserver(function (entries) {
    header.classList.toggle('is-stuck', !entries[0].isIntersecting);
  }).observe($('#sentinel'));

  /* scroll reveal */
  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* open now + today's row, Europe/Rome */
  var parts = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
  var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  var st = shopStatus(day, (+parts.hour) * 60 + (+parts.minute));
  var statusEl = $('#open-status');
  if (statusEl) {
  $('.status-text', statusEl).textContent = st.text;
  statusEl.classList.add(st.open ? 'is-open' : 'is-closed');
  statusEl.hidden = false;
  }
  var row = $('.hours tr[data-day="' + day + '"]');
  if (row) row.classList.add('is-today');

  $('#year').textContent = new Date().getFullYear();
})();
