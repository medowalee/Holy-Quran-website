const apiUrl = "https://mp3quran.net/api/v3";
const language = "ar";

async function getReciters() {
  const chooseReciter = document.querySelector("#chooseReciter");
  const res = await fetch(`${apiUrl}/reciters?language=${language}`);
  const data = await res.json();

  chooseReciter.innerHTML = `<option value="">اختر قارئ</option>`
  data.reciters.forEach(
    (reciters) =>
      (chooseReciter.innerHTML += `<option value="${reciters.id}">${reciters.name}</option>`)
  );

  chooseReciter.addEventListener("change", (e) => getMoshaf(e.target.value));
}

getReciters();

async function getMoshaf(reciter) {
  const chooseMoshaf = document.querySelector("#chooseMoshaf");

  const res = await fetch(
    `${apiUrl}/reciters?language=${language}&reciter=${reciter}`
  );
  const data = await res.json();
  const moshafs = data.reciters[0].moshaf;

  chooseMoshaf.innerHTML = `<option value="">اختر روية</option>`
  moshafs.forEach((moshaf) => {
    chooseMoshaf.innerHTML += `<option  value="${moshaf.id}"  data-server="${moshaf.server}"  data-surahList="${moshaf.surah_list}"  >${moshaf.name}</option>`;
  });

    chooseMoshaf.addEventListener('change', e => {
      const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex]
      const surahserver = selectedMoshaf.dataset.server;
      const surahlist = selectedMoshaf.dataset.surahlist;

      getSurah(surahserver, surahlist)
    })
}

async function getSurah(surahserver, surahlist) {
  const chooseSurah = document.querySelector("#chooseSurah")



  const res = await fetch(`${apiUrl}/suwar`)
  const data = await res.json();
  const surahNmes = await data.suwar;

  surahlist = surahlist.split(',')

  chooseSurah.innerHTML = `<option value="">اختر السورة</option>` 
  surahlist.forEach(surah => {
    const padSurah = surah.padStart(3, '0')
    

    surahNmes.forEach(surahNme => {
      if (surahNme.id == surah) {
        chooseSurah.innerHTML += `<option value="${surahserver}${padSurah}.mp3">${surahNme.name}</option>`;
      }
    })
  })



  chooseSurah.addEventListener('change', e => {
    const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]

    playSurah(selectedSurah.value)
  })
  
}

function playSurah(surahMp3) {
  const audioPlayer = document.querySelector("#audioPlayer")
  audioPlayer.src = surahMp3;
  audioPlayer.play()
  
}


function playLive(channel) {
  if(Hls.isSupported()) {
    var video = document.getElementById('liveVideo');
    var hls = new Hls();
    hls.loadSource(`${channel}`);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      video.play();
  });
 }
}