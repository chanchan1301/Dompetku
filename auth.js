(function(){
  const $ = id => document.getElementById(id);
  const screen = $('authScreen');
  const app = document.querySelector('.app');
  let mode = 'login';
  let auth = null;
  const cfg = window.DOMPETKU_FIREBASE_CONFIG || {};
  const configured = cfg.apiKey && !String(cfg.apiKey).startsWith('ISI_') && cfg.projectId && !String(cfg.projectId).startsWith('ISI_') && cfg.appId && !String(cfg.appId).startsWith('ISI_');
  function showError(message){ $('authError').textContent = message || ''; }
  function setMode(next){
    mode=next;
    $('loginTab').classList.toggle('active',mode==='login');
    $('registerTab').classList.toggle('active',mode==='register');
    $('authTitle').textContent=mode==='login'?'Selamat datang!':'Buat akun Dompetku';
    $('authSubtitle').textContent=mode==='login'?'Masuk untuk membuka dan mengelola keuanganmu.':'Daftar menggunakan email dan kata sandi.';
    $('confirmField').hidden=mode!=='register';
    $('authConfirm').required=mode==='register';
    $('authPassword').autocomplete=mode==='login'?'current-password':'new-password';
    $('authSubmit').textContent=mode==='login'?'Masuk':'Buat akun';
    showError();
  }
  $('loginTab').addEventListener('click',()=>setMode('login'));
  $('registerTab').addEventListener('click',()=>setMode('register'));
  function activate(user){
    const old=localStorage.getItem('dompetku_active_uid');
    if(old!==user.uid){ localStorage.setItem('dompetku_active_uid',user.uid); location.reload(); return; }
    $('signedInUser').textContent=user.email || 'Akun aktif';
    screen.style.display='none'; app.style.removeProperty('display');
  }
  function friendlyError(e){
    const code=e && e.code || '';
    const map={
      'auth/invalid-email':'Format email tidak valid.',
      'auth/user-disabled':'Akun ini dinonaktifkan.',
      'auth/user-not-found':'Akun tidak ditemukan. Silakan daftar terlebih dahulu.',
      'auth/wrong-password':'Kata sandi salah.',
      'auth/invalid-credential':'Email atau kata sandi salah.',
      'auth/email-already-in-use':'Email sudah terdaftar. Silakan masuk.',
      'auth/weak-password':'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.',
      'auth/too-many-requests':'Terlalu banyak percobaan. Coba lagi beberapa saat.',
      'auth/network-request-failed':'Koneksi internet bermasalah. Periksa jaringanmu.'
    };
    return map[code] || 'Tidak dapat memproses akun. Periksa konfigurasi Firebase dan coba lagi.';
  }
  if(!configured || !window.firebase){
    screen.style.display='grid'; app.style.display='none'; $('firebaseSetupHint').hidden=false;
    $('authSubmit').disabled=true; $('authSubmit').textContent='Konfigurasi diperlukan';
    $('authHint').hidden=true;
    return;
  }
  try{ if(!firebase.apps.length) firebase.initializeApp(cfg); auth=firebase.auth(); }
  catch(e){ showError('Konfigurasi Firebase tidak valid. Periksa firebase-config.js.'); $('authSubmit').disabled=true; return; }
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
  auth.onAuthStateChanged(user=>{
    if(user){ activate(user); }
    else { localStorage.removeItem('dompetku_active_uid'); screen.style.display='grid'; app.style.display='none'; }
  });
  $('authForm').addEventListener('submit',async e=>{
    e.preventDefault(); showError();
    const email=$('authEmail').value.trim();
    const password=$('authPassword').value;
    const confirm=$('authConfirm').value;
    if(mode==='register' && password!==confirm){ showError('Konfirmasi kata sandi tidak sama.'); return; }
    $('authSubmit').disabled=true; $('authSubmit').textContent='Memproses…';
    try{
      if(mode==='register') await auth.createUserWithEmailAndPassword(email,password);
      else await auth.signInWithEmailAndPassword(email,password);
    }catch(err){ showError(friendlyError(err)); }
    finally{ $('authSubmit').disabled=false; $('authSubmit').textContent=mode==='login'?'Masuk':'Buat akun'; }
  });
  $('logoutBtn').addEventListener('click',async()=>{
    if(!confirm('Keluar dari akun Dompetku?')) return;
    try{ await auth.signOut(); }catch(e){ alert('Gagal keluar. Periksa koneksi internet.'); }
  });
})();
