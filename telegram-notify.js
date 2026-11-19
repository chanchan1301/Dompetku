(function () {
  const endpoint = window.DOMPETKU_TELEGRAM_ENDPOINT || '';
  function send(payload) {
    if (!endpoint || endpoint.includes('ISI_URL_WEB_APP_APPS_SCRIPT')) {
      console.info('Telegram belum dikonfigurasi.');
      return;
    }
    // Apps Script menerima text/plain agar permintaan lintas domain dapat dikirim
    // tanpa membaca respons (mode no-cors).
    fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(err => console.warn('Notifikasi Telegram gagal dikirim:', err));
  }
  window.dompetkuTelegramNotifyTransaction = function (tx) {
    if (!tx) return;
    send({
      type: 'transaction',
      transaction: {
        title: String(tx.title || 'Transaksi').slice(0, 80),
        category: String(tx.category || '-').slice(0, 50),
        date: String(tx.date || ''),
        kind: tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        amount: Math.max(0, Number(tx.amount) || 0)
      }
    });
  };
  window.dompetkuTelegramNotifyGold = function (gold) {
    if (!gold) return;
    send({
      type: 'gold',
      gold: {
        date: String(gold.date || ''),
        grams: Math.max(0, Number(gold.grams) || 0),
        cost: Math.max(0, Number(gold.cost) || 0),
        note: String(gold.note || 'Tabungan emas').slice(0, 80)
      }
    });
  };
})();
