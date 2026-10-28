(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // menu
  var burger = $('.burger'), panel = $('.panel');
  function closeMenu() { panel.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = panel.hidden; panel.hidden = !open; burger.setAttribute('aria-expanded', String(open));
  });
  $$('.panel a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.addEventListener('resize', function () { if (innerWidth > 1040) closeMenu(); });

  // language EN / PL
  var lang = 'en';
  $$('[data-pl]').forEach(function (el) { el.setAttribute('data-en', el.innerHTML); });
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    $$('[data-pl]').forEach(function (el) { el.innerHTML = el.getAttribute(l === 'pl' ? 'data-pl' : 'data-en'); });
    $$('.lang button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === l); });
    try { localStorage.setItem('rs-lang', l); } catch (e) {}
  }
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
  try { if (localStorage.getItem('rs-lang') === 'pl') setLang('pl'); } catch (e) {}

  // spec tabs
  function showTab(id) {
    $$('.tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === id)); });
    $$('.spec').forEach(function (p) { p.hidden = p.dataset.panel !== id; });
  }
  $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { showTab(b.dataset.tab); }); });
  $$('.prod a[data-tab]').forEach(function (a) { a.addEventListener('click', function () { showTab(a.dataset.tab); }); });

  // bottom bar on phones: only after the hero buttons scroll away
  var mob = $('.mob'), heroCta = $('.hero-cta'), contact = $('#contact');
  var pastHero = false, atContact = false;
  function upd() { mob.classList.toggle('widac', pastHero && !atContact); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; upd(); }).observe(heroCta);
    new IntersectionObserver(function (e) { atContact = e[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(contact);
  }

  // request for quotation: builds a ready message, sends via e-mail or WhatsApp
  var form = $('#rfq');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    $$('[required]', form).forEach(function (i) {
      var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
      i.classList.toggle('bad', bad); if (bad && ok) { i.focus(); ok = false; }
    });
    if (!ok) return;
    var f = form.elements;
    var txt = [
      'Request for quotation - Rhino Sugar',
      'Company: ' + f.company.value + ' (' + f.country.value + ')',
      'Product: ' + f.product.value,
      'Quantity: ' + f.qty.value + ' MT / month, contract: ' + f.term.value,
      'Delivery: ' + f.inco.value + ' ' + f.port.value + ', packing: ' + f.pack.value,
      'Contact: ' + f.email.value + (f.phone.value ? ', ' + f.phone.value : '')
    ];
    if (f.msg.value.trim()) txt.push('Notes: ' + f.msg.value.trim());
    var body = txt.join('\n');
    $('#sumtxt').textContent = body;
    $('#sum-mail').href = 'mailto:info@rhino-sugar.com?subject=' + encodeURIComponent('RFQ ' + f.product.value + ' - ' + f.company.value) + '&body=' + encodeURIComponent(body);
    $('#sum-wa').href = 'https://wa.me/48578894419?text=' + encodeURIComponent(body);
    var s = $('#sum'); s.hidden = false; s.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $$('input,select,textarea', form).forEach(function (i) { i.addEventListener('input', function () { i.classList.remove('bad'); }); });
})();
