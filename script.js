const statusEl = document.getElementById("status");
const imgInput = document.getElementById("img");

/* ===== TEXT TO SPEECH ===== */
function speak(text){
  statusEl.innerText = text;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "id-ID";
  speechSynthesis.speak(u);
}

/* ===== VOICE COMMAND ===== */
function startVoice(){
  speak("Suara aktif. Silakan bicara.");

  if(!('webkitSpeechRecognition' in window)){
    speak("Browser tidak mendukung pengenalan suara");
    return;
  }

  const rec = new webkitSpeechRecognition();
  rec.lang = "id-ID";
  rec.start();

  rec.onresult = e=>{
    const text = e.results[0][0].transcript.toLowerCase();
    speak("Anda mengatakan " + text);
  };

  rec.onerror = ()=> speak("Mikrofon error");
}

/* ===== OCR + BACA UANG ===== */
imgInput.onchange = ()=>{
  const file = imgInput.files[0];
  if(!file) return;

  speak("Sedang membaca gambar");

  Tesseract.recognize(file,'ind')
    .then(r=>{
      const t = r.data.text.toUpperCase();

      if(t.includes("RUPIAH") || t.includes("BANK INDONESIA")){
        detectMoney(t);
      }else{
        speak(t.trim() || "Teks tidak terbaca");
      }
    })
    .catch(()=>{
      speak("Gagal membaca gambar");
    });
};

function detectMoney(t){
  const map = {
    "1000":"seribu",
    "2000":"dua ribu",
    "5000":"lima ribu",
    "10000":"sepuluh ribu",
    "20000":"dua puluh ribu",
    "50000":"lima puluh ribu",
    "100000":"seratus ribu"
  };

  for(let k in map){
    if(t.includes(k)){
      speak("Ini uang " + map[k] + " rupiah");
      return;
    }
  }
  speak("Uang terdeteksi, nominal tidak jelas");
}
