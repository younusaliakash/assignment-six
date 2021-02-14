const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const search = document.getElementById("search");
// let duration = document.getElementById("duration").value || 1000;
// selected image
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
  spinner()
};

const getImages = (query) => {
  spinner()
  const countDownTimeStart = performance.now()
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => {showImages(data.hits)
      showFoundItemNumber (data.hits.length)})
    .catch((err) => console.log(err));
    const countDownTimeEnd = performance.now()
    const timeSpend = countDownTimeEnd - countDownTimeStart;
    searchTime(timeSpend)
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
  selectedPicture(sliders.length);
};
var timer;
const createSlider = () => {
  spinner()
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    spinner()
    return;
  }
  let duration = document.getElementById("duration").value || 1000;
  let sliderDuration = Math.abs(duration)
  if(sliderDuration < 1000){
    sliderDuration = 1000;
  }
  spinner()
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `
    <h4 id="slider-text" class="d-flex justify-content-center mb-3 bg-light">You are Watching ${sliders.length} Pictures Slider</h4>
    <img class="slider-img w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
    searchStatus(false)
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, sliderDuration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

search.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchTheResult();
  }
});
searchBtn.addEventListener("click", function () {
  searchTheResult();
});

const searchTheResult = () => {
  document.getElementById("duration").value = ""
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  getImages(search.value);
  sliders.length = 0;
  document.getElementById("selected-number").innerText= 0;
};

sliderBtn.addEventListener("click",  () => createSlider());

//spinner loading
const spinner = () =>{
  const spinnerSpin = document.getElementById('spinner');
  spinnerSpin.classList.toggle('d-none')

}

const searchTime = (totalTime) =>{
  searchStatus(true)
  const searchingTime = totalTime.toFixed(2)
  document.getElementById('search-time').innerText = searchingTime;
}

const showFoundItemNumber = (foundItemsNumber) =>{
  document.getElementById('found-items').innerText = foundItemsNumber;
}

const searchStatus = (boolean) => {
  const searchInfo =document.getElementById("search-info");
  if (boolean) { 
  searchInfo.style.display = "block";}
  else{
    searchInfo.style.display = "none"
  }
}

const selectedPicture = (numberOfselectPicture) => {
  document.getElementById("selected-number").innerText= numberOfselectPicture;
  const searchInfo =document.getElementById("select-status");
  if (numberOfselectPicture > 0){
    searchInfo.style.display = "block";
  }else{
    searchInfo.style.display = "none";
  }
}
