/* Configura qui i collegamenti. Sono siti web, non avvii di app native.
 * Usa URL HTTPS completi oppure lascia una stringa vuota per disabilitare.
 * La riproduzione dipende dal browser TV, dai DRM e dal servizio. */
var APP_LINKS = {
  netflix: 'https://www.netflix.com/',
  youtube: 'https://www.youtube.com/',
  prime: 'https://www.primevideo.com/',
  rakuten: 'https://www.rakuten.tv/'
};

(function () {
  'use strict';
  var apps = document.querySelectorAll('[data-app]');
  var selected = 0;
  var settingsOpen = document.getElementById('settings-open');
  var settingsPanel = document.getElementById('settings-panel');
  var diagnosticsRun = document.getElementById('diagnostics-run');
  var settingsClose = document.getElementById('settings-close');
  var results = document.getElementById('diagnostics-results');
  var summary = document.getElementById('diagnostics-summary');
  var scaleControl = document.getElementById('display-scale');
  var scaleValue = document.getElementById('scale-value');
  var displayScale = 100;
  var scaleStorageKey = 'vista.displayScale';
  function applyLayout() {
    var root = document.documentElement;
    var width = root.clientWidth || window.innerWidth;
    var height = root.clientHeight || window.innerHeight;
    // 100 x 56.25 units preserve the 16:9 composition at any viewport size.
    // Both dimensions reserve 5% at each edge before the manual reduction.
    if (width > 0 && height > 0) {
      root.style.fontSize = (Math.min(width * 0.9 / 100, height * 0.9 / 56.25) * displayScale / 100) + 'px';
    }
    scaleControl.value = displayScale;
    scaleControl.setAttribute('aria-valuetext', displayScale + '%');
    scaleValue.textContent = displayScale + '%';
  }
  function setScale(value, save) {
    value = Number(value);
    displayScale = isFinite(value) ? Math.max(70, Math.min(100, Math.round(value))) : 100;
    applyLayout();
    if (save) {
      try { window.localStorage.setItem(scaleStorageKey, String(displayScale)); } catch (error) { /* Session-only when storage is unavailable. */ }
    }
  }
  try {
    var savedScale = window.localStorage.getItem(scaleStorageKey);
    if (savedScale !== null && savedScale !== '') { setScale(savedScale, false); }
  } catch (error) { /* Storage may be blocked on the TV. */ }
  applyLayout();
  window.addEventListener('resize', applyLayout, false);
  window.addEventListener('orientationchange', applyLayout, false);
  scaleControl.addEventListener('input', function () { setScale(scaleControl.value, true); }, false);
  scaleControl.addEventListener('change', function () { setScale(scaleControl.value, true); }, false);
  var panelOpen = false;
  var panelButtons = [diagnosticsRun, scaleControl, settingsClose];
  var panelSelected = 0;

  function openSettings() {
    panelOpen = true;
    settingsPanel.style.display = 'block';
    settingsPanel.setAttribute('aria-hidden', 'false');
    panelSelected = 0;
    diagnosticsRun.focus();
  }
  function closeSettings() {
    panelOpen = false;
    settingsPanel.style.display = 'none';
    settingsPanel.setAttribute('aria-hidden', 'true');
    settingsOpen.focus();
  }
  // Inspect descriptors only: reading window[name] could invoke a native getter.
  function inspectNative(name) {
    var owner = window;
    var descriptor;
    var depth = 0;
    if (typeof Object.getOwnPropertyDescriptor !== 'function' ||
        typeof Object.getPrototypeOf !== 'function') {
      return 'Non verificabile: introspezione non supportata';
    }
    try {
      while (owner && depth < 20) {
        descriptor = Object.getOwnPropertyDescriptor(owner, name);
        if (descriptor) {
          if (!Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
            return 'Non verificabile: accessore non eseguito';
          }
          return typeof descriptor.value === 'function' ?
            'Disponibile (funzione rilevata, non eseguita)' : 'Non disponibile (non è una funzione)';
        }
        owner = Object.getPrototypeOf(owner);
        depth += 1;
      }
      return owner ? 'Non verificabile: limite di introspezione' : 'Non disponibile';
    } catch (error) {
      return 'Non verificabile: proprietà protetta';
    }
  }
  function runDiagnostics() {
    var names = ['Hisense_installApp', 'Hisense_GetModelName', 'Hisense_GetFirmWareVersion'];
    var discovered;
    var name;
    var row;
    var label;
    var state;
    var j;
    var discoveryNote = '';
    // Additional globals are discovered by name, not presented as documented APIs.
    // No recursive traversal of native namespaces and no native function calls.
    try {
      if (typeof Object.getOwnPropertyNames === 'function') {
        discovered = Object.getOwnPropertyNames(window);
        for (j = 0; j < discovered.length; j += 1) {
          name = discovered[j];
          if (/^(Hisense|VIDAA)(_|[A-Z])/i.test(name) && names.indexOf(name) === -1) {
            names.push(name);
          }
        }
      } else { discoveryNote = ' Ricerca di ulteriori nomi non supportata.'; }
    } catch (error) { discoveryNote = ' Ricerca di ulteriori nomi non consentita.'; }
    while (results.firstChild) { results.removeChild(results.firstChild); }
    for (j = 0; j < names.length; j += 1) {
      row = document.createElement('div');
      row.className = 'diagnostic-row';
      label = document.createElement('div');
      label.className = 'diagnostic-name';
      label.textContent = names[j];
      state = document.createElement('div');
      state.className = 'diagnostic-state';
      state.textContent = inspectNative(names[j]);
      row.appendChild(label);
      row.appendChild(state);
      results.appendChild(row);
    }
    results.scrollTop = 0;
    summary.textContent = names.length + ' nomi controllati. Nessuna API nativa eseguita.' +
      ' Gli ulteriori nomi Hisense/VIDAA sono rilevati sul dispositivo, senza certificazione della loro documentazione.' + discoveryNote;
  }
  settingsOpen.addEventListener('click', openSettings, false);
  settingsClose.addEventListener('click', closeSettings, false);
  diagnosticsRun.addEventListener('click', runDiagnostics, false);
  diagnosticsRun.addEventListener('focus', function () { panelSelected = 0; }, false);
  scaleControl.addEventListener('focus', function () { panelSelected = 1; }, false);
  settingsClose.addEventListener('focus', function () { panelSelected = 2; }, false);
  var status = document.getElementById('status');
  var days = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

  function pad(value) { return value < 10 ? '0' + value : String(value); }
  function updateClock() {
    var now = new Date();
    document.getElementById('clock').textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
    document.getElementById('date').textContent = days[now.getDay()] + ' ' + now.getDate() + ' ' + months[now.getMonth()];
  }
  function select(index) {
    var i;
    selected = (index + apps.length) % apps.length;
    for (i = 0; i < apps.length; i += 1) {
      apps[i].className = apps[i].className.replace(/\s*is-focused/g, '');
      apps[i].tabIndex = i === selected ? 0 : -1;
    }
    apps[selected].className += ' is-focused';
    apps[selected].focus();
  }
  function activate(event, app) {
    var url = APP_LINKS[app.getAttribute('data-app')];
    if (!url || !/^https:\/\/[^\s]+$/i.test(url)) {
      if (event) { event.preventDefault(); }
      status.textContent = 'Collegamento non disponibile. Configura un indirizzo HTTPS in script.js.';
      return false;
    }
    app.setAttribute('href', url);
    return true;
  }
  function bindApp(app, index) {
    var url = APP_LINKS[app.getAttribute('data-app')];
    if (url && /^https:\/\/[^\s]+$/i.test(url)) { app.setAttribute('href', url); }
    else { app.removeAttribute('href'); app.setAttribute('aria-disabled', 'true'); }
    app.addEventListener('focus', function () {
      if (selected !== index) { select(index); }
    }, false);
    app.addEventListener('click', function (event) { activate(event, app); }, false);
  }
  var i;
  for (i = 0; i < apps.length; i += 1) { bindApp(apps[i], i); }
  document.addEventListener('keydown', function (event) {
    var code = event.keyCode || event.which;
    var key = event.key;
    var isOK = key === 'Enter' || key === 'OK' || code === 13;
    if (panelOpen) {
      if (key === 'Escape' || key === 'Backspace' || key === 'GoBack' || code === 27 || code === 8 || code === 461 || code === 10009) {
        event.preventDefault(); closeSettings();
      } else if (code === 9 || key === 'Tab' || key === 'ArrowUp' || key === 'ArrowDown' || code === 38 || code === 40) {
        event.preventDefault();
        var direction = (key === 'ArrowUp' || code === 38 || ((key === 'Tab' || code === 9) && event.shiftKey)) ? -1 : 1;
        panelSelected = (panelSelected + direction + panelButtons.length) % panelButtons.length;
        panelButtons[panelSelected].focus();
      } else if (key === 'ArrowLeft' || key === 'ArrowRight' || code === 37 || code === 39) {
        event.preventDefault();
        var step = (key === 'ArrowLeft' || code === 37) ? -1 : 1;
        if (panelButtons[panelSelected] === scaleControl) { setScale(displayScale + step, true); }
        else { results.scrollTop += step * results.clientHeight * 0.5; }
      } else if (isOK) {
        event.preventDefault();
        if (!event.repeat) { panelButtons[panelSelected].click(); }
      }
      return;
    }
    if (document.activeElement === settingsOpen) {
      if (isOK) { event.preventDefault(); if (!event.repeat) { openSettings(); } }
      else if (key === 'ArrowDown' || code === 40) { event.preventDefault(); select(selected); }
      else if (code >= 37 && code <= 39) { event.preventDefault(); }
      return;
    }
    if (key === 'ArrowUp' || code === 38) {
      event.preventDefault(); settingsOpen.focus(); return;
    }
    if (key === 'ArrowLeft' || code === 37) { event.preventDefault(); select(selected - 1); }
    else if (key === 'ArrowRight' || code === 39) { event.preventDefault(); select(selected + 1); }
    else if (key === 'ArrowUp' || key === 'ArrowDown' || code === 38 || code === 40) {
      event.preventDefault(); select(selected);
    } else if (key === 'Enter' || key === 'OK' || code === 13) {
      event.preventDefault();
      if (!event.repeat && activate(null, apps[selected])) { window.location.href = apps[selected].getAttribute('href'); }
    }
  }, false);
  window.addEventListener('pageshow', function () { applyLayout(); updateClock(); if (!panelOpen) { select(selected); } }, false);
  updateClock();
  window.setInterval(updateClock, 1000);
  select(0);
}());
