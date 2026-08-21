/* Lux Wall Watches — script.js
   Vanilla JavaScript only. No frameworks. */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  var navScrim = document.querySelector('.nav-scrim');

  function closeNav() {
    if (!navToggle || !mainNav) return;
    navToggle.classList.remove('open');
    mainNav.classList.remove('open');
    if (navScrim) navScrim.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      if (navScrim) navScrim.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
  if (navScrim) navScrim.addEventListener('click', closeNav);
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  /* ---------- Header scroll behavior ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Smooth scrolling for on-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Reveal-on-scroll animations ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Collection filtering ---------- */
  var filterButtons = document.querySelectorAll('.filter-bar button');
  var galleryItems = document.querySelectorAll('#gallery .piece');
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var cats = (item.getAttribute('data-cat') || '').split(' ');
          var show = filter === 'all' || cats.indexOf(filter) !== -1;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Product detail modal ---------- */
  var pdOverlay = document.getElementById('pd-overlay');
  if (pdOverlay) {
    var pdImgs = pdOverlay.querySelectorAll('.pd-media img');
    var pdMat = pdOverlay.querySelector('.pd-mat');
    var pdName = pdOverlay.querySelector('.pd-name');
    var pdDesc = pdOverlay.querySelector('.pd-desc');
    var pdDims = pdOverlay.querySelector('.pd-dims');
    var pdDial = pdOverlay.querySelector('.pd-dial');
    var pdFrame = pdOverlay.querySelector('.pd-frame');
    var pdHands = pdOverlay.querySelector('.pd-hands');
    var pdMovement = pdOverlay.querySelector('.pd-movement');
    var pdPrice = pdOverlay.querySelector('.pd-price');

    document.querySelectorAll('[data-product]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var mainImg = trigger.getAttribute('data-img');
        var detailImg = trigger.getAttribute('data-img2') || mainImg;
        pdImgs[0].src = mainImg;
        pdImgs[0].alt = trigger.getAttribute('data-name');
        if (pdImgs[1]) {
          pdImgs[1].src = detailImg;
          pdImgs[1].alt = trigger.getAttribute('data-name') + ' — detail';
        }
        pdMat.textContent = trigger.getAttribute('data-material');
        pdName.textContent = trigger.getAttribute('data-name');
        pdDesc.textContent = trigger.getAttribute('data-desc');
        pdDims.textContent = trigger.getAttribute('data-dims');
        pdDial.textContent = trigger.getAttribute('data-dial');
        pdFrame.textContent = trigger.getAttribute('data-frame');
        pdHands.textContent = trigger.getAttribute('data-hands');
        pdMovement.textContent = trigger.getAttribute('data-movement');
        pdPrice.textContent = trigger.getAttribute('data-price');
        pdOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      pdOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    pdOverlay.querySelector('.pd-close').addEventListener('click', closeModal);
    pdOverlay.addEventListener('click', function (e) {
      if (e.target === pdOverlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---------- Contact form validation ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var name = contactForm.querySelector('#full-name');
      var email = contactForm.querySelector('#email');
      var message = contactForm.querySelector('#message');

      [name, email, message].forEach(function (field) {
        field.closest('.field').classList.remove('has-error');
      });

      if (!name.value.trim()) {
        name.closest('.field').classList.add('has-error');
        valid = false;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        email.closest('.field').classList.add('has-error');
        valid = false;
      }
      if (!message.value.trim()) {
        message.closest('.field').classList.add('has-error');
        valid = false;
      }

      var successBox = document.getElementById('form-success');
      if (valid) {
        contactForm.reset();
        if (successBox) successBox.classList.add('show');
      } else {
        if (successBox) successBox.classList.remove('show');
      }
    });
  }

  /* ---------- Newsletter validation ---------- */
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var msg = form.parentElement.querySelector('.form-msg');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (input && emailPattern.test(input.value.trim())) {
        if (msg) { msg.textContent = 'Thank you — you are on the list.'; }
        form.reset();
      } else {
        if (msg) { msg.textContent = 'Please enter a valid email address.'; }
      }
    });
  });

  /* ---------- Cookie consent (localStorage) ---------- */
  var COOKIE_KEY = 'lww_cookie_consent';
  var banner = document.getElementById('cookie-banner');

  function getConsent() {
    try { return localStorage.getItem(COOKIE_KEY); } catch (err) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(COOKIE_KEY, value); } catch (err) { /* ignore */ }
  }

  if (banner) {
    if (!getConsent()) {
      banner.classList.add('show');
    }
    var acceptBtn = banner.querySelector('.cookie-accept');
    var declineBtn = banner.querySelector('.cookie-decline');
    var settingsBtn = banner.querySelector('.cookie-settings');

    if (acceptBtn) acceptBtn.addEventListener('click', function () {
      setConsent('accepted');
      banner.classList.remove('show');
    });
    if (declineBtn) declineBtn.addEventListener('click', function () {
      setConsent('declined');
      banner.classList.remove('show');
    });
    if (settingsBtn) settingsBtn.addEventListener('click', function () {
      window.location.href = 'cookie-policy.html';
    });
  }

});
