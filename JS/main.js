let myAudio = document.querySelector("audio");
let myText = document.querySelector(".myP");
let containerBox = document.querySelector(".contentbox");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let play = document.querySelector(".play");

let mySection = document.querySelector(".audio-form");



window.addEventListener('scroll', () => {
  if (window.scrollY > 250) {
    mySection.classList.add("show")
  } else {
    mySection.classList.remove("show");
  }
})
function changeSurah() {
  fetch("https://api.quran.gading.dev/surah")
    .then(Response => Response.json())
    .then(data => {
      for (let surah in data.data) {
        containerBox.innerHTML +=
          `
          <div class="box" data-search="${data.data[surah].name.long}" data-search2="${data.data[surah].name.short}" data-search3="${data.data[surah].name.transliteration.en}">
          <h2>${data.data[surah].name.long}</h2>
          <p>${data.data[surah].name.transliteration.en}</p>
          </div>
          `
      }
      let myBoxes = document.querySelectorAll(".box");
      let mySearch = document.getElementById("search");
      mySearch.addEventListener("keyup", () => {

        let result = mySearch.value;
        let myValue = result.toLowerCase();

        myBoxes.forEach(box => {
          if (myValue === box.dataset.search) {
            box.style.display = "block"
          } else {
            box.style.display = "none";
          }
          if (myValue === box.dataset.search2) {
            box.style.display = "block"
          } else {
            box.style.display = "none";
          }
          if (result !== "") {
            return false;
          } else {
            myBoxes.forEach(box => {
              box.style.display = "block";
            })
          }

        })
      })
      let theAudio,
        audioText;
      myBoxes.forEach((box, index) => {
        box.addEventListener("click", () => {
          fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
            .then(Response => Response.json())
            .then(data => {
              let verses = data.data.verses;
              theAudio = [];
              audioText = [];
              verses.forEach(verse => {
                audioText.push(verse.text.arab);
                theAudio.push(verse.audio.primary);
              })
              myAudio.addEventListener('ended', () => {
                ayahIndex++;
                if (ayahIndex < theAudio.length) {
                  changeAyah(ayahIndex)
                } else {
                  ayahIndex = 0;
                  changeAyah(ayahIndex)
                  myAudio.pause();
                }
              })
              let ayahIndex = 0;
              next.addEventListener('click', () => {
                if (ayahIndex < audioText.length - 1) {
                  ayahIndex++;
                } else {
                  ayahIndex = 0;
                }
                changeAyah(ayahIndex)
              })
              prev.addEventListener('click', () => {
                if (ayahIndex === 0) {
                  return false;
                } else {
                  ayahIndex--
                }
                changeAyah(ayahIndex)
              })
              let isPlaying = false;
              playButton()
              function playButton() {
                if (isPlaying) {
                  myAudio.pause();
                  play.innerHTML = `<i class="fa-solid fa-play"></i>`
                  isPlaying = false;
                } else {
                  myAudio.play();
                  play.innerHTML = `<i class="fa-solid fa-pause"></i>`
                  isPlaying = true;
                }
              }
              play.addEventListener('click', playButton);
              changeAyah(ayahIndex)
              function changeAyah(index) {
                myAudio.src = theAudio[index];
                myText.innerHTML = audioText[index];
              }
            })
        })
      })
    })
}

changeSurah()