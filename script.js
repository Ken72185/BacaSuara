const status = document.getElementById("status");

function ngomong(teks) {
  status.innerText = teks;
  const u = new SpeechSynthesisUtterance(teks);
  u.lang = "id-ID";
  speechSynthesis.speak(u);
}

function mulai() {
  if (!('webkitSpeechRecognition' in window)) {
    ngomong("Browser tidak mendukung pengenalan suara");
    return;
  }

  ngomong("Silakan berbicara");

  const rec = new webkitSpeechRecognition();
  rec.lang = "id-ID";
  rec.start();

  rec.onresult = (e) => {
    const kata = e.results[0][0].transcript;
    ngomong("Anda mengatakan " + kata);
  };

  rec.onerror = () => ngomong("Terjadi kesalahan");
}

function bacaFoto(e) {
  const foto = e.target.files[0];
  if (!foto) return;

  ngomong("Sedang membaca teks");

  Tesseract.recognize(foto, 'ind')
    .then(res => {
      const teks = res.data.text.trim();
      ngomong(teks || "Teks tidak terbaca");
    });
}

