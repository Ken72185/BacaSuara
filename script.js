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
    const kata = e.results[0][0].transcript.toLowerCase();
    ngomong("Anda mengatakan " + kata);
  };
}

function bacaFoto(e) {
  const foto = e.target.files[0];
  if (!foto) return;

  ngomong("Sedang memproses gambar");

  Tesseract.recognize(foto, 'ind')
    .then(res => {
      const teks = res.data.text.toUpperCase();

      // DETEKSI UANG
      if (teks.includes("BANK INDONESIA") || teks.includes("RUPIAH")) {
        deteksiUang(teks);
      } else {
        ngomong(teks.trim() || "Teks tidak terbaca");
      }
    });
}

function deteksiUang(teks) {
  const daftar = [
    { value: 1000, kata: "seribu" },
    { value: 2000, kata: "dua ribu" },
    { value: 5000, kata: "lima ribu" },
    { value: 10000, kata: "sepuluh ribu" },
    { value: 20000, kata: "dua puluh ribu" },
    { value: 50000, kata: "lima puluh ribu" },
    { value: 100000, kata: "seratus ribu" }
  ];

  for (let u of daftar) {
    if (teks.includes(u.value.toString())) {
      ngomong("Ini uang " + u.kata + " rupiah");
      return;
    }
  }

  ngomong("Uang terdeteksi, tapi nominal tidak jelas");
}
    .then(res => {
      const teks = res.data.text.trim();
      ngomong(teks || "Teks tidak terbaca");
    });
}

