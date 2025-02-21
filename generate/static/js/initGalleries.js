const url = new URL(window.location.href);
let tags = url.searchParams.get("tag") || "";
if (tags.length > 0) {
  tags = tags.split(",");
} else {
  tags = [];
}
let availableTags = [];

const galleries = document.querySelectorAll('[data-type="gallery"]');
let tagsButtons = document.querySelectorAll('[data-type="tag"]');
let allTagsButton = document.querySelector('[data-type="tag"][data-tag="all"]');
let Images = document.querySelectorAll('[data-type="image"]');

Images.forEach((item) => {
  const imTags = item.dataset.tags.split(",") || [];
  const foundTags = [];

  for (let i = 0; i < imTags.length; i++) {
    if (tags.includes(imTags[i]) || tags.length == 0) {
      foundTags.push(imTags[i]);
    }
  }

  if (foundTags.length == 0 || foundTags.length < tags.length) {
    item.remove();
  } else {
    item.classList.remove("hidden");
    for (let i = 0; i < imTags.length; i++) {
      if (!availableTags.includes(imTags[i])) {
        availableTags.push(imTags[i]);
      }
    }
  }
});

allTagsButton.addEventListener("click", () => {
  removeTags();
});

if (tags.length == 0) {
  allTagsButton.classList.remove("bg-gray-800");
  allTagsButton.classList.add("bg-gray-600");
}

tagsButtons.forEach((item) => {
  if (item.dataset.tag != "all") {
    item.addEventListener("click", () => {
      toggleTag(item.dataset.tag);
    });
  }
  if (tags.includes(item.dataset.tag)) {
    item.classList.remove("bg-gray-800");
    item.classList.add("bg-gray-600");
  }
  if (!availableTags.includes(item.dataset.tag) && item.dataset.tag != "all") {
    item.remove();
  } else {
    item.classList.remove("hidden");
  }
});

function removeTags() {
  const url = new URL(window.location.href);
  url.searchParams.delete("tag");
  window.history.pushState({}, "", url);
  window.location.reload();
}

function toggleTag(tag) {
  if (tags.includes(tag)) {
    tags = tags.filter((item) => item !== tag);
  } else {
    tags.push(tag);
  }

  tags = tags.join(",");
  url.searchParams.set("tag", tags);
  window.history.pushState({}, "", url);
  window.location.reload();
}

galleries.forEach((item, idx) => {
  if (item.children.length == 0) {
    item.parentElement.remove();
  } else {
    item.parentElement.classList.remove("hidden");

    lightGallery(item, {
      plugins: [lgThumbnail, lgHash, lgShare, lgFullscreen, lgZoom],
      speed: 500,
      thumbnail: true,
      download: true,
      animateThumb: true,
      zoomFromOrigin: false,
      toggleThumb: false,
      galleryId: Number(item.getAttribute("data-year")),
      hash: true,
      customSlideName: true,
      mobileSettings: { controls: true, showCloseIcon: true, download: true },
    });
  }
});
