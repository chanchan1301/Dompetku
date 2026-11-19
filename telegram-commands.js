(function () {
  'use strict';
  const endpoint = String(window.DOMPETKU_TELEGRAM_ENDPOINT || '').trim();
  const button = document.getElementById('connectTelegramBtn');
  let busy = false;
  let pollTimer = null;
  let pollInFlight = false;

  function randomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => chars[b % chars.length]).join('');
  }
  function randomSecret() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }
  function post(payload) {
    if (!endpoint) throw new Error('URL Apps Script belum diisi di telegram-config.js.');
    return fetch(endpoint, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  }
  async function connect() {
    if (busy) return;
    busy = true;
    if (button) { button.disabled = true; button.textContent = 'Membuat kode…'; }
    try {
      if (!window.firebase || !firebase.auth().currentUser) throw new Error('Silakan login ke Dompetku terlebih dahulu.');
      if (!endpoint) throw new Error('Isi URL Web App Apps Script pada telegram-config.js terlebih dahulu.');
      const user = firebase.auth().currentUser;
      const idToken = await user.getIdToken(true);
      const code = randomCode();
      const secret = randomSecret();
      await post({ action: 'createLink', idToken, code, pollSecret: secret });
      localStorage.setItem('dompetku_tg_poll_secret_' + user.uid, secret);
      alert('Kode penghubung: ' + code + '\n\nBuka bot Telegram Dompetku, lalu kirim:\n/link ' + code + '\n\nKode berlaku 10 menit.');
      startPolling();
    } catch (err) {
      alert(err && err.message ? err.message : 'Gagal membuat kode penghubung.');
    } finally {
      busy = false;
      if (button) { button.disabled = false; button.textContent = '✈ Hubungkan Telegram'; }
    }
  }
  function poll() {
    if (pollInFlight || !endpoint || !window.firebase) return;
    const user = firebase.auth().currentUser;
    if (!user) return;
    const secret = localStorage.getItem('dompetku_tg_poll_secret_' + user.uid);
    if (!secret) return;
    pollInFlight = true;
    window.dompetkuPollCallback = async function (result) {
      try {
        if (result && result.ok && Array.isArray(result.items)) {
          const token = await user.getIdToken();
          for (const tx of result.items) {
            if (window.dompetkuApplyTelegramTransaction(tx)) {
              await post({ action: 'ack', idToken: token, id: tx.id });
            }
          }
        }
      } catch (err) {
        console.warn('Sinkronisasi transaksi Telegram:', err);
      } finally {
        pollInFlight = false;
      }
    };
    const script = document.createElement('script');
    script.src = endpoint + (endpoint.includes('?') ? '&' : '?') +
      'action=poll&callback=dompetkuPollCallback&uid=' + encodeURIComponent(user.uid) +
      '&secret=' + encodeURIComponent(secret) + '&_=' + Date.now();
    script.onerror = function () { pollInFlight = false; };
    document.head.appendChild(script);
    setTimeout(function () { try { script.remove(); } catch (_) {} }, 10000);
  }
  function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    poll();
    pollTimer = setInterval(poll, 12000);
  }
  if (button) button.addEventListener('click', connect);
  if (window.firebase) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) startPolling();
      else if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    });
  }
})();
