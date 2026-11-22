document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. SISTEMA DE NAVEGACIÓN POR SLIDES SEPARADOS
     ======================================================================== */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const navItems = Array.from(document.querySelectorAll('.nav-item, .nav-cta'));
  const mobilePills = Array.from(document.querySelectorAll('.mobile-pill[data-go-slide]'));
  const dockDots = Array.from(document.querySelectorAll('.dock-dot'));
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  const dockCounter = document.getElementById('dock-counter');
  const viewport = document.getElementById('slides-viewport');

  const slideNames = [
    'Inicio',
    'Funcionamiento',
    'Simulador',
    'Demostración',
    'Ficha técnica',
    'Recursos',
    'Contacto'
  ];

  let currentSlide = 0;

  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlide = index;

    slides.forEach((sec, idx) => {
      const active = idx === currentSlide;
      sec.hidden = !active;
      sec.classList.toggle('is-active', active);
    });

    navItems.forEach((btn) => {
      const target = Number(btn.dataset.goSlide);
      btn.classList.toggle('is-active', target === currentSlide);
    });

    mobilePills.forEach((btn) => {
      const target = Number(btn.dataset.goSlide);
      btn.classList.toggle('is-active', target === currentSlide);
    });

    dockDots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentSlide);
    });

    if (dockCounter) {
      dockCounter.textContent = `${currentSlide + 1} / ${slides.length} · ${slideNames[currentSlide]}`;
    }

    if (btnPrev) {
      btnPrev.disabled = currentSlide === 0;
    }

    if (btnNext) {
      if (currentSlide === slides.length - 1) {
        btnNext.textContent = 'Volver al Inicio ↺';
      } else {
        btnNext.textContent = `Siguiente: ${slideNames[currentSlide + 1]} →`;
      }
    }

    if (viewport) {
      viewport.scrollTop = 0;
    }
  }

  document.querySelectorAll('[data-go-slide]').forEach((el) => {
    el.addEventListener('click', () => {
      const target = Number(el.dataset.goSlide);
      goToSlide(target);
      closeMobileMenu();
    });
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentSlide === slides.length - 1) {
        goToSlide(0);
      } else {
        goToSlide(currentSlide + 1);
      }
    });
  }

  // Navegación con flechas del teclado cuando no se edita un campo
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
  });

  /* ========================================================================
     2. MENÚ MÓVIL PANTALLA COMPLETA (Figma Mobile)
     ======================================================================== */
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const mobileOpenBtn = document.getElementById('mobile-menu-open');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');

  function closeMobileMenu() {
    if (!mobileOverlay) return;
    mobileOverlay.hidden = true;
    if (mobileOpenBtn) mobileOpenBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileOpenBtn && mobileOverlay) {
    mobileOpenBtn.addEventListener('click', () => {
      mobileOverlay.hidden = false;
      mobileOpenBtn.setAttribute('aria-expanded', 'true');
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  /* ========================================================================
     3. SIMULADOR INTERACTIVO DE PROXIMIDAD (Idéntico a Figma)
     ======================================================================== */
  const slider = document.getElementById('distance-slider');
  const distOutput = document.getElementById('distance-output');
  const coreDist = document.getElementById('core-distance');
  const ringsBox = document.getElementById('concentric-rings');
  const simTitle = document.getElementById('sim-title');
  const simSubtitle = document.getElementById('sim-subtitle');
  const barsIndicator = document.getElementById('bars-indicator');
  const patternText = document.getElementById('pattern-text');
  const statusLed = document.getElementById('status-led');
  const statusBadge = document.getElementById('status-badge');
  const presetChips = document.querySelectorAll('.preset-chip');
  const segBtns = document.querySelectorAll('.seg-btn');
  const btnPulse = document.getElementById('btn-test-pulse');
  const btnToggleSim = document.getElementById('btn-toggle-sim');

  let intensity = 'Media';
  let paused = false;

  function formatComma(num) {
    return `${num.toFixed(1).replace('.', ',')} m`;
  }

  function vibratePattern(zone) {
    if (paused) return;
    ringsBox.classList.add('is-pulsing');
    setTimeout(() => ringsBox.classList.remove('is-pulsing'), 230);

    if ('vibrate' in navigator) {
      const k = intensity === 'Suave' ? 0.7 : intensity === 'Alta' ? 1.4 : 1;
      if (zone === 'muy-cercano') navigator.vibrate([Math.round(240 * k), 60, Math.round(240 * k)]);
      else if (zone === 'cercano') navigator.vibrate([Math.round(140 * k), 90, Math.round(140 * k)]);
      else if (zone === 'lejano') navigator.vibrate(Math.round(90 * k));
    }
  }

  function renderSimulator() {
    const val = parseFloat(slider.value);
    const label = formatComma(val);
    distOutput.textContent = label;
    coreDist.textContent = label;

    presetChips.forEach((chip) => {
      chip.classList.toggle('is-selected', Math.abs(parseFloat(chip.dataset.preset) - val) < 0.05);
    });

    const bars = barsIndicator.querySelectorAll('i');
    bars.forEach((b) => b.classList.remove('is-lit'));
    barsIndicator.classList.remove('is-red');
    ringsBox.classList.remove('state-muy-cercano', 'state-fuera');

    if (paused) {
      statusBadge.textContent = 'SIMULACIÓN EN PAUSA';
      simTitle.textContent = 'Simulación en pausa';
      simSubtitle.textContent = 'No se representa una alerta. Reanuda para explorar nuevamente.';
      patternText.textContent = 'Actuador táctil en espera';
      return;
    }

    statusBadge.textContent = 'ASISTENCIA ACTIVA · 0–2 M';

    if (val > 2.0) {
      statusLed.className = 'dot-teal';
      ringsBox.classList.add('state-fuera');
      simTitle.textContent = 'Fuera de rango';
      simSubtitle.textContent = `Sin alerta representada · ${label} · Fuera de rango no equivale a entorno libre.`;
      patternText.textContent = 'Sin patrón táctil activo (> 2,0 m)';
    } else if (val >= 1.0) {
      statusLed.className = 'dot-teal';
      bars[0].classList.add('is-lit');
      simTitle.textContent = 'Obstáculo lejano';
      simSubtitle.textContent = `Obstáculo lejano · patrón suave · ${label} · Intensidad ${intensity}.`;
      patternText.textContent = 'Patrón suave y espaciado (1,0 – 2,0 m)';
    } else if (val >= 0.5) {
      statusLed.className = 'dot-teal';
      bars[0].classList.add('is-lit');
      bars[1].classList.add('is-lit');
      simTitle.textContent = 'Obstáculo cercano';
      simSubtitle.textContent = `Obstáculo cercano · patrón medio · ${label} · Intensidad ${intensity}.`;
      patternText.textContent = 'Patrón rítmico medio (0,5 – 1,0 m)';
    } else {
      statusLed.className = 'dot-red';
      bars[0].classList.add('is-lit');
      bars[1].classList.add('is-lit');
      bars[2].classList.add('is-lit');
      barsIndicator.classList.add('is-red');
      ringsBox.classList.add('state-muy-cercano');
      simTitle.textContent = 'Obstáculo muy cercano';
      simSubtitle.textContent = `Obstáculo muy cercano · patrón intenso · ${label} · Intensidad ${intensity}.`;
      patternText.textContent = 'Patrón intenso y continuo (< 0,5 m)';
    }
  }

  if (slider) {
    slider.addEventListener('input', renderSimulator);
    slider.addEventListener('change', () => {
      const v = parseFloat(slider.value);
      if (v < 0.5) vibratePattern('muy-cercano');
      else if (v < 1.0) vibratePattern('cercano');
      else if (v <= 2.0) vibratePattern('lejano');
    });
  }

  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      slider.value = chip.dataset.preset;
      renderSimulator();
      const v = parseFloat(slider.value);
      if (v < 0.5) vibratePattern('muy-cercano');
      else if (v < 1.0) vibratePattern('cercano');
      else if (v <= 2.0) vibratePattern('lejano');
    });
  });

  segBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      segBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      intensity = btn.dataset.intensity;
      renderSimulator();
      vibratePattern('cercano');
    });
  });

  if (btnPulse) {
    btnPulse.addEventListener('click', () => {
      const v = parseFloat(slider.value);
      if (v < 0.5) vibratePattern('muy-cercano');
      else if (v < 1.0) vibratePattern('cercano');
      else vibratePattern('lejano');
    });
  }

  if (btnToggleSim) {
    btnToggleSim.addEventListener('click', () => {
      paused = !paused;
      btnToggleSim.setAttribute('aria-pressed', String(paused));
      btnToggleSim.textContent = paused ? 'Reanudar simulación' : 'Pausar simulación';
      renderSimulator();
    });
  }

  /* ========================================================================
     4. PULSACIÓN SOSTENIDA DE 1,5 s (HU-014)
     ======================================================================== */
  const btnHold = document.getElementById('btn-hold-stop');
  const holdFill = document.getElementById('hold-fill');
  const holdText = document.getElementById('hold-text');
  let holdFrame = null;
  let holdStartedAt = 0;

  function beginHold() {
    holdStartedAt = Date.now();
    holdFrame = requestAnimationFrame(tickHold);
  }

  function tickHold() {
    const pct = Math.min(((Date.now() - holdStartedAt) / 1500) * 100, 100);
    holdFill.style.width = `${pct}%`;
    if (pct >= 100) {
      paused = true;
      btnToggleSim.setAttribute('aria-pressed', 'true');
      btnToggleSim.textContent = 'Reanudar simulación';
      holdText.textContent = 'Asistencia detenida correctamente';
      renderSimulator();
      if ('vibrate' in navigator) navigator.vibrate(180);
      setTimeout(() => {
        holdFill.style.width = '0%';
        holdText.textContent = 'Mantener 1,5 s para finalizar asistencia';
      }, 2200);
    } else {
      holdFrame = requestAnimationFrame(tickHold);
    }
  }

  function endHold() {
    if (holdFrame) cancelAnimationFrame(holdFrame);
    if (holdFill.style.width !== '100%') holdFill.style.width = '0%';
  }

  if (btnHold) {
    btnHold.addEventListener('mousedown', beginHold);
    btnHold.addEventListener('touchstart', beginHold, { passive: true });
    btnHold.addEventListener('mouseup', endHold);
    btnHold.addEventListener('mouseleave', endHold);
    btnHold.addEventListener('touchend', endHold);
  }

  /* ========================================================================
     5. STORYBOARD DEMOSTRACIÓN ACCESIBLE (5 Escenas de Figma)
     ======================================================================== */
  const scenes = [
    {
      tag: 'HAPTIGO · VISIÓN GENERAL',
      title: 'Asistencia háptica de proximidad',
      cc: '[Subtítulos CC]: "HaptiGo propone comunicar la proximidad frontal mediante patrones hápticos sin bloquear tu audición ambiental."',
      ad: '[Descripción sonora AD]: Peatón desplazándose con bastón blanco en vía urbana; el dispositivo pectoral Haptic One proyecta un cono frontal de 35 grados hasta 2 metros.'
    },
    {
      tag: 'ZONA LEJANA · 1,0 M – 2,0 M',
      title: '1,5 m · Patrón suave',
      cc: '[Subtítulos CC]: "A una distancia ficticia de un metro y medio, la pantalla indica zona lejana y emite un pulso lento y espaciado."',
      ad: '[Descripción sonora AD]: El indicador central muestra 1,5 metros con una barra activa en verde oscuro; el peatón recibe una advertencia temprana.'
    },
    {
      tag: 'ZONA CERCANA · 0,5 M – 1,0 M',
      title: '0,8 m · Patrón medio',
      cc: '[Subtítulos CC]: "El estado cambia a cercano. El ritmo conceptual aumenta para permitir una maniobra preventiva sin detener la marcha."',
      ad: '[Descripción sonora AD]: El anillo concéntrico ilumina dos barras de intensidad media mientras el usuario rodea un obstáculo elevado.'
    },
    {
      tag: 'ZONA MUY CERCANA · < 0,5 M',
      title: '0,3 m · Patrón intenso',
      cc: '[Subtítulos CC]: "La pantalla indica muy cercano con alerta crítica continua: detente y revisa el entorno con el bastón blanco."',
      ad: '[Descripción sonora AD]: Los tres anillos cambian a rojo de alto contraste y se encienden las tres barras de señal máxima.'
    },
    {
      tag: 'SEGURIDAD PREVENTIVA · HU-040',
      title: 'Complementa, no sustituye',
      cc: '[Subtítulos CC]: "Explora en reposo. HaptiGo complementa el bastón blanco para obstáculos a altura del torso y cabeza."',
      ad: '[Descripción sonora AD]: Vista final del ecosistema HaptiGo junto al bastón blanco y la aplicación móvil de alto contraste.'
    }
  ];

  let sceneIdx = 0;
  let sbTimer = null;
  let sbPlaying = false;

  const sbBadge = document.getElementById('sb-step-badge');
  const sbTag = document.getElementById('sb-visual-tag');
  const sbTitle = document.getElementById('sb-scene-title');
  const sbCaption = document.getElementById('sb-scene-caption');
  const sbAd = document.getElementById('sb-scene-ad');
  const sbDots = document.querySelectorAll('.sb-dot');
  const btnSbPlay = document.getElementById('btn-sb-play');
  const btnSbNext = document.getElementById('btn-sb-next');
  const btnSbCc = document.getElementById('btn-sb-cc');
  const btnSbAd = document.getElementById('btn-sb-ad');

  function renderScene(i) {
    sceneIdx = (i + scenes.length) % scenes.length;
    const s = scenes[sceneIdx];
    sbBadge.textContent = `STORYBOARD CONCEPTUAL · ESCENA ${sceneIdx + 1} DE ${scenes.length}`;
    sbTag.textContent = s.tag;
    sbTitle.textContent = s.title;
    sbCaption.textContent = s.cc;
    sbAd.textContent = s.ad;
    sbDots.forEach((d, idx) => d.classList.toggle('is-active', idx === sceneIdx));
  }

  sbDots.forEach((d) => {
    d.addEventListener('click', () => renderScene(Number(d.dataset.scene)));
  });

  if (btnSbNext) {
    btnSbNext.addEventListener('click', () => renderScene(sceneIdx + 1));
  }

  if (btnSbPlay) {
    btnSbPlay.addEventListener('click', () => {
      sbPlaying = !sbPlaying;
      btnSbPlay.setAttribute('aria-pressed', String(sbPlaying));
      btnSbPlay.textContent = sbPlaying ? 'Pausar' : 'Reproducir';
      if (sbPlaying) {
        sbTimer = setInterval(() => renderScene(sceneIdx + 1), 3800);
      } else {
        clearInterval(sbTimer);
      }
    });
  }

  if (btnSbCc) {
    btnSbCc.addEventListener('click', () => {
      const on = btnSbCc.getAttribute('aria-pressed') === 'true';
      btnSbCc.setAttribute('aria-pressed', String(!on));
      btnSbCc.classList.toggle('is-on', !on);
      sbCaption.hidden = on;
    });
  }

  if (btnSbAd) {
    btnSbAd.addEventListener('click', () => {
      const on = btnSbAd.getAttribute('aria-pressed') === 'true';
      btnSbAd.setAttribute('aria-pressed', String(!on));
      btnSbAd.classList.toggle('is-on', !on);
      sbAd.hidden = on;
    });
  }

  /* ========================================================================
     6. ACORDEÓN FAQ Y FORMULARIO DE CONTACTO (HU-043 / HU-045)
     ======================================================================== */
  document.querySelectorAll('.faq-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const sign = btn.querySelector('.faq-plus');
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
      if (sign) sign.textContent = open ? '+' : '−';
    });
  });

  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inp-name');
      const email = document.getElementById('inp-email');
      const msg = document.getElementById('inp-msg');

      formAlert.hidden = true;
      formAlert.className = 'form-alert';

      if (!name.value.trim()) {
        formAlert.textContent = 'Revisa los campos: el nombre completo es obligatorio.';
        formAlert.classList.add('is-err');
        formAlert.hidden = false;
        name.focus();
        return;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        formAlert.textContent = 'Revisa los campos: introduce un correo electrónico válido.';
        formAlert.classList.add('is-err');
        formAlert.hidden = false;
        email.focus();
        return;
      }

      if (!msg.value.trim()) {
        formAlert.textContent = 'Revisa los campos: escribe tu mensaje o consulta.';
        formAlert.classList.add('is-err');
        formAlert.hidden = false;
        msg.focus();
        return;
      }

      formAlert.textContent = 'Solicitud enviada correctamente. Datos validados: nos contactaremos en menos de 48 horas.';
      formAlert.classList.add('is-ok');
      formAlert.hidden = false;
      contactForm.reset();
    });
  }

  renderSimulator();
  goToSlide(0);
});
