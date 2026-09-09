// ---------------------------------------------------------------
// 1. DATA: each photo has an id, category, image url, and caption.
//    Swap these urls for your own photos later — just keep the
//    same object shape (id, category, src, caption).
// ---------------------------------------------------------------
const photos = [
  { id: 1, category: "nature", src: "https://picsum.photos/seed/forest1/600/450", caption: "Pine ridge, early fog" },
  { id: 2, category: "nature", src: "https://picsum.photos/seed/lake2/600/450", caption: "Still lake at dawn" },
  { id: 3, category: "city", src: "https://picsum.photos/seed/city3/600/450", caption: "Rain on Fifth Ave" },
  { id: 4, category: "city", src: "https://picsum.photos/seed/city4/600/450", caption: "Overpass, blue hour" },
  { id: 5, category: "people", src: "https://picsum.photos/seed/person5/600/450", caption: "Portrait, window light" },
  { id: 6, category: "people", src: "https://picsum.photos/seed/person6/600/450", caption: "Hands, workshop" },
  { id: 7, category: "food", src: "https://picsum.photos/seed/food7/600/450", caption: "Sourdough crumb" },
  { id: 8, category: "food", src: "https://picsum.photos/seed/food8/600/450", caption: "Market tomatoes" },
  { id: 9, category: "nature", src: "https://picsum.photos/seed/mountain9/600/450", caption: "Ridge line, noon" },
  { id: 10, category: "city", src: "https://picsum.photos/seed/city10/600/450", caption: "Subway platform" },
  { id: 11, category: "people", src: "https://picsum.photos/seed/person11/600/450", caption: "Street musician" },
  { id: 12, category: "food", src: "https://picsum.photos/seed/food12/600/450", caption: "Coffee, poured" },
];

// ---------------------------------------------------------------
// 2. RENDER: build one .frame element per photo and inject them
//    into the #gallery container.
// ---------------------------------------------------------------
const gallery = document.getElementById("gallery");

function renderGallery(list) {
  gallery.innerHTML = "";
  list.forEach((photo, index) => {
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.dataset.category = photo.category;
    frame.dataset.index = index; // position within the *current* list
    frame.tabIndex = 0;
    frame.innerHTML = `
      <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
      <div class="frame-caption">${photo.caption}</div>
    `;
    frame.addEventListener("click", () => openLightbox(index));
    frame.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openLightbox(index);
    });
    gallery.appendChild(frame);
  });
}

// The list currently visible (changes when a filter is applied)
let currentList = photos;
renderGallery(currentList);

// ---------------------------------------------------------------
// 3. FILTERS: clicking a filter button narrows currentList and
//    re-renders the grid.
// ---------------------------------------------------------------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    currentList = filter === "all" ? photos : photos.filter((p) => p.category === filter);
    renderGallery(currentList);
  });
});

// ---------------------------------------------------------------
// 4. LIGHTBOX: open on click, navigate with next/prev buttons or
//    arrow keys, close with the X button, Escape key, or backdrop.
// ---------------------------------------------------------------
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbCaption = document.getElementById("lbCaption");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let activeIndex = 0;

function openLightbox(index) {
  activeIndex = index;
  updateLightboxImage();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

function updateLightboxImage() {
  const photo = currentList[activeIndex];
  lbImage.src = photo.src;
  lbImage.alt = photo.caption;
  lbCaption.textContent = photo.caption;
}

function showNext() {
  activeIndex = (activeIndex + 1) % currentList.length;
  updateLightboxImage();
}

function showPrev() {
  activeIndex = (activeIndex - 1 + currentList.length) % currentList.length;
  updateLightboxImage();
}

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", showNext);
lbPrev.addEventListener("click", showPrev);

// Click on the dark backdrop (but not the image itself) closes it
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard support: Esc closes, arrow keys navigate
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});
