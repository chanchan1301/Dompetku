(function () {
  'use strict';
  function post(type, payload) {
    var endpoint = String(window.DOMPETKU_TELEGRAM_ENDPOINT || '').trim();
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(endpoint)) return Promise.resolve(false);
    return fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ type: type }, payload || {}))
    }).then(function () { return true; }).catch(function (err) {
      console.warn('Notifikasi Telegram Dompetku gagal dikirim:', err);
      return false;
    });
  }
  window.dompetkuTelegramNotifyTransaction = function (tx) {
    tx = tx || {};
    return post('transaction', { transaction: {
      kind: tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      title: tx.title || 'Transaksi', amount: Number(tx.amount) || 0,
      category: tx.category || '-', date: tx.date || '-'
    }});
  };
  window.dompetkuTelegramNotifyGold = function (gold) {
    gold = gold || {};
    return post('gold', { gold: {
      grams: Number(gold.grams) || 0, cost: Number(gold.cost) || 0,
      date: gold.date || '-', note: gold.note || '-'
    }});
  };
})();
