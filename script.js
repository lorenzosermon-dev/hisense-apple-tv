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
    if (key === 'ArrowLeft' || code === 37) { event.preventDefault(); select(selected - 1); }
    else if (key === 'ArrowRight' || code === 39) { event.preventDefault(); select(selected + 1); }
    else if (key === 'ArrowUp' || key === 'ArrowDown' || code === 38 || code === 40) {
      event.preventDefault(); select(selected);
    } else if (key === 'Enter' || key === 'OK' || code === 13) {
      event.preventDefault();
      if (!event.repeat && activate(null, apps[selected])) { window.location.href = apps[selected].getAttribute('href'); }
    }
  }, false);
  window.addEventListener('pageshow', function () { updateClock(); select(selected); }, false);
  updateClock();
  window.setInterval(updateClock, 1000);
  select(0);
}());
