/* Shared helpers for the standalone pages. Load after three.min.js and before the page script.
   - GravityLabPage.notice(title, text): full-screen message with Reload and "Back to Gravity Lab".
   - Shows that notice when three.js did not load, when WebGL cannot start, or when the GPU drops
     the WebGL context (common on iOS when a tab with large textures is backgrounded). */
(function () {
  'use strict';
  var script = document.currentScript;
  // Path to the sandbox, relative to the page. vendor/ sits at the site root, so its parent is the sandbox.
  var home = script ? new URL('../', script.src).href : '../';
  var shown = false;

  function notice(title, text) {
    if (shown) return;
    shown = true;
    var el = document.createElement('div');
    el.className = 'gl-notice';
    el.setAttribute('role', 'alertdialog');
    el.setAttribute('aria-labelledby', 'gl-notice-title');
    el.innerHTML =
      '<div><h2 id="gl-notice-title"></h2><p></p><div class="gl-actions">' +
      '<button type="button">Reload</button>' +
      '<a class="gl-home" href=""><span aria-hidden="true">←</span> Gravity Lab</a></div></div>';
    el.querySelector('h2').textContent = title;
    el.querySelector('p').textContent = text;
    el.querySelector('a').href = home;
    el.querySelector('button').addEventListener('click', function () {
      location.reload();
    });
    (document.body || document.documentElement).appendChild(el);
    el.querySelector('button').focus();
  }

  function noThree() {
    notice(
      'This exhibit could not start',
      'Its 3D library did not load. Check your connection and reload; if you are offline, open it once while online so it can be saved for later.',
    );
  }
  function noWebGL() {
    notice(
      '3D graphics are not available',
      'This exhibit needs WebGL. Try another browser, turn on hardware acceleration, or close other tabs and reload.',
    );
  }

  if (typeof window.THREE === 'undefined') noThree();

  // webglcontextlost does not bubble, so listen in the capture phase for every canvas on the page.
  window.addEventListener(
    'webglcontextlost',
    function (event) {
      event.preventDefault();
      notice(
        'The 3D view was paused',
        'Your device reclaimed the graphics memory this exhibit was using (this can happen when the tab is in the background). Reload to carry on.',
      );
    },
    true,
  );
  window.addEventListener('error', function (event) {
    var msg = String((event && event.message) || '');
    if (/THREE is not defined/.test(msg)) noThree();
    else if (/WebGL|creating WebGL context/i.test(msg)) noWebGL();
  });

  window.GravityLabPage = { notice: notice, home: home };
})();
