const status = document.getElementById("status");
let sedangNgomong = false;

function ngomong(teks) {
  if (sedangNgomong) speechSynthesis.cancel();

  sedangNgomong = true;
  status.innerText = teks;

  const u = new SpeechSynthesisUtterance(teks);
  u.lang = "id-ID";

  u.onend = () => {
    sedangNgomong = false;
  };

  speechSynthesis.speak(u);
}

function mulai() {
  // trigger manual biar browser ngizinin suara
  ngomong("Mode perintah suara aktif");

  if (!('webkitSpeechRecognition' in window)) {
    ngomong("Browser tidak mendukung pengenalan suara");
    return;
  }

  const rec = new webkitSpeechRecognition();
  rec.lang = "id-ID";
  rec.start();

  rec.onresult = (e) => {
    const kata = e.results[0][0].transcript.toLowerCase();
    ngomong("Anda mengatakan " + kata);
  };

  rec.onerror = () => ngomong("Terjadi kesalahan mikrofon");
}

function bacaFoto(e) {
  const foto = e.target.files[0];
  if (!foto) return;

  ngomong("Sedang membaca gambar");

  Tesseract.recognize(foto, 'ind')
    .then(res => {
      const teks = res.data.text.trim().toUpperCase();

      if (teks.includes("RUPIAH") || teks.includes("BANK INDONESIA")) {
        deteksiUang(teks);
      } else {
        ngomong(teks || "Teks tidak terbaca");
      }
    });
}

function deteksiUang(teks) {
  const daftar = {
    "1000": "seribu",
    "2000": "dua ribu",
    "5000": "lima ribu",
    "10000": "sepuluh ribu",
    "20000": "dua puluh ribu",
    "50000": "lima puluh ribu",
    "100000": "seratus ribu"
  };

  for (let angka in daftar) {
    if (teks.includes(angka)) {
      ngomong("Ini uang " + daftar[angka] + " rupiah");
      return;
    }
  }

  ngomong("Uang terdeteksi, nominal tidak jelas");
}

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

