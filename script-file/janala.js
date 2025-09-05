const createElement = (arr) => {
    const createHtmlElement = arr.map((arrPss) => `<button class="btn btn-soft btn-primary">${arrPss}</button>`)
    return(createHtmlElement.join(" "));
}

// speak
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// loading-spinner 
const loadingSpinner = (stats) => {
    if (stats === true) {
        document.getElementById("loading-spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("loading-spinner").classList.add("hidden");
    }
}

const loadLesson = () => {
    const lesson = "https://openapi.programming-hero.com/api/levels/all"
    fetch(lesson)
    .then( res => res.json())
    .then(jsonData => displayLoad(jsonData.data))
}

const removeActive = () => {
    const lessonBtn = document.querySelectorAll(".lesson-btn")
    lessonBtn.forEach(btns => {
        btns.classList.remove("active")
    });
}

const loadWord = (id) => {
    loadingSpinner(true);
    const wordUrl = `https://openapi.programming-hero.com/api/level/${id}
`
    fetch(wordUrl)
    .then(res => res.json())
    .then(wordData => {
    removeActive()
    const clickBtn = document.getElementById(`lesson-btn-${id}`);
    clickBtn.classList.add("active");
    displayWordData(wordData.data);
})
}

const loadWordDetails = async(id) => {
    const wordDetailsUrl =` https://openapi.programming-hero.com/api/word/${id}`
    console.log(wordDetailsUrl);
    const res = await fetch(wordDetailsUrl)
    const detailsWord = await res.json()
    displayWordDetails(detailsWord.data);
}

const displayWordDetails = (wordDetails) => {
    const detailsModal = document.getElementById("details-modal");
    detailsModal.innerHTML = `
    <div class="modal-box w-full">
                  <h3 class="text-2xl font-bold ">${wordDetails.word} (<i class="fa-solid fa-microphone-lines"></i>:${wordDetails.pronunciation})</h3>
                  <p class="pt-4 pb-2 font-semibold text-xl">Meaning</p>
                  <p class="pb-4 hind-siliguri-font text-xl font-medium">${wordDetails.meaning}</p>
                  <p class=" font-semibold text-xl pb-2 ">Example</p>
                  <p class="pb-4 text-xl">${wordDetails.sentence}</p>
                  <p class="hind-siliguri-font font-medium text-xl pb-2 ">সমার্থক শব্দ গুলো</p>

                  <div class="text-xl">${createElement(wordDetails.synonyms)}</div>
                  
                  <button class="btn btn-active btn-primary mt-12 font-medium text-sm">Complete Learning</button>
                  <div class="modal-action">
                    <form method="dialog">
        
                      <button class="btn">Close</button>
                    </form>
                  </div>
                  </div>
    `
    document.getElementById("my_modal_5").showModal()
}

const displayWordData = (displayData) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    if (displayData.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full p-14 hind-siliguri-font space-y-5">
             <img class="mx-auto h-24" src="assets/alert-error.png" alt="error-image">
             <p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
             <h3 class="text-[#292524] font-medium text-4xl mt-3">নেক্সট Lesson এ যান</h3>
        </div>
        `;
        
    }
    for (const data of displayData) {
        const wordDiv = document.createElement("div")
        console.log(wordDiv);
        wordDiv.innerHTML = `
            <div class="card-item bg-white p-3 md:p-14 text-center rounded-xl h-[100%]">
              <h1 class="font-bold text-3xl">${data.word ? data.word : "শব্দ পাওয়া যায়নি"}</h1>
              <p class="text-xl my-6">Meaning /Pronunciation</p>
              <p class="text-[#18181B] font-semibold text-3xl mb-14 hind-siliguri-font">"${data.meaning ? data.meaning : "অর্থ পাওয়া যায়নি"}/${data.pronunciation ? data.pronunciation : "pronunciation পাওয়া যায়নি"}"</p>
              <div class="icons flex justify-between">
                <button id="info-btn" onclick="loadWordDetails(${data.id}),my_modal_5.showModal()" class=" rounded-md p-3 bg-[#e8f4ff] hover:bg-primary hover:text-white">
                 <i class="fa-solid fa-circle-info "></i>
                </button>

                <button id="volume-btn" onclick="pronounceWord('${data.word}')" class=" rounded-md p-3 bg-[#e8f4ff] hover:bg-primary hover:text-white">
                 <i class="fa-solid fa-volume-high "></i>
                </button>
              </div>
            </div>

        `
        wordContainer.appendChild(wordDiv)
    };
    loadingSpinner(false);
};


const displayLoad = (items) => {
    const allBtns = document.getElementById("all-btns");
    allBtns.innerHTML = "";
   for (const item of items) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${item.level_no}" onclick = "loadWord(${item.level_no})" class="btn btn-outline btn-primary font-semibold my-3 lesson-btn">
        <i class="fa-solid fa-book-open text-xl"></i>Lesson -${item.level_no}
        </button>
    `
    allBtns.appendChild(btnDiv)
   }
}

loadLesson()

document.getElementById("search-btn").addEventListener("click", () => {
    removeActive();
    const searchInput = document.getElementById("search-input");
    const searchValue = searchInput.value.trim().toLowerCase();
    console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
        const allData = data.data;
        const filterData = allData.filter((word) => word.word.toLowerCase().includes(searchValue));
       displayWordData(filterData)
    })
})