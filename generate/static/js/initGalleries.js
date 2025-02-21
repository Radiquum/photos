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
      extraProps: [
        "redditText",
        "bskyText",
        "msText",
        "redditShareUrl",
        "bskyShareUrl",
        "msShareUrl",
      ],
      additionalShareOptions: [
        {
          selector: ".lg-share-reddit",
          dropdownHTML:
            '<li class="lg-share-item-reddit"><a class="lg-share-reddit" target="_blank"><span class="lg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="#ff4500" d="M373 138.6c-25.2 0-46.3-17.5-51.9-41c-30.6 4.3-54.2 30.7-54.2 62.4v.2c47.4 1.8 90.6 15.1 124.9 36.3c12.6-9.7 28.4-15.5 45.5-15.5c41.3 0 74.7 33.4 74.7 74.7c0 29.8-17.4 55.5-42.7 67.5c-2.4 86.8-97 156.6-213.2 156.6S45.5 410.1 43 323.4c-25.4-11.9-43-37.7-43-67.7C0 214.4 33.4 181 74.7 181c17.2 0 33 5.8 45.7 15.6c34-21.1 76.8-34.4 123.7-36.4v-.3c0-44.3 33.7-80.9 76.8-85.5C325.8 50.2 347.2 32 373 32c29.4 0 53.3 23.9 53.3 53.3s-23.9 53.3-53.3 53.3M157.5 255.3c-20.9 0-38.9 20.8-40.2 47.9s17.1 38.1 38 38.1s36.6-9.8 37.8-36.9s-14.7-49.1-35.7-49.1zM395 303.1c-1.2-27.1-19.2-47.9-40.2-47.9s-36.9 22-35.7 49.1s16.9 36.9 37.8 36.9s39.3-11 38-38.1zm-60.1 70.8c1.5-3.6-1-7.7-4.9-8.1c-23-2.3-47.9-3.6-73.8-3.6s-50.8 1.3-73.8 3.6c-3.9.4-6.4 4.5-4.9 8.1c12.9 30.8 43.3 52.4 78.7 52.4s65.8-21.6 78.7-52.4"/></svg></span><span class="lg-dropdown-text">Reddit</span></a></li>',
          generateLink: (galleryItem) => {
            const url =
              galleryItem.redditShareUrl ||
              encodeURIComponent(window.location.href);
            const title = galleryItem.redditText;
            const redditShareLink = `https://reddit.com/submit?url=${url}&title=${title}`;
            return redditShareLink;
          },
        },
        {
          selector: ".lg-share-bsky",
          dropdownHTML:
            '<li class="lg-share-item-bsky"><a class="lg-share-bsky" target="_blank"><span class="lg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="#0085ff" d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2c-18.2 64.8-84.4 81.4-143.3 71.3C456 322 482.2 380 425.6 438c-107.4 110.2-154.3-27.6-166.3-62.9c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"/></svg></span><span class="lg-dropdown-text">Bluesky</span></a></li>',
          generateLink: (galleryItem) => {
            const url =
              galleryItem.bskyShareUrl ||
              encodeURIComponent(window.location.href);
            const title = galleryItem.bskyText;
            const bskyShareLink = `https://bsky.app/intent/compose?text=${title}%20${url}`;
            return bskyShareLink;
          },
        },
        {
          selector: ".lg-share-ms",
          dropdownHTML:
            '<li class="lg-share-item-ms"><a class="lg-share-ms" target="_blank"><span class="lg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512"><path fill="#8c8dff" d="M433 179.11c0-97.2-63.71-125.7-63.71-125.7c-62.52-28.7-228.56-28.4-290.48 0c0 0-63.72 28.5-63.72 125.7c0 115.7-6.6 259.4 105.63 289.1c40.51 10.7 75.32 13 103.33 11.4c50.81-2.8 79.32-18.1 79.32-18.1l-1.7-36.9s-36.31 11.4-77.12 10.1c-40.41-1.4-83-4.4-89.63-54a102.5 102.5 0 0 1-.9-13.9c85.63 20.9 158.65 9.1 178.75 6.7c56.12-6.7 105-41.3 111.23-72.9c9.8-49.8 9-121.5 9-121.5m-75.12 125.2h-46.63v-114.2c0-49.7-64-51.6-64 6.9v62.5h-46.33V197c0-58.5-64-56.6-64-6.9v114.2H90.19c0-122.1-5.2-147.9 18.41-175c25.9-28.9 79.82-30.8 103.83 6.1l11.6 19.5l11.6-19.5c24.11-37.1 78.12-34.8 103.83-6.1c23.71 27.3 18.4 53 18.4 175z"/></svg></span><span class="lg-dropdown-text">Mastodon</span></a></li>',
          generateLink: (galleryItem) => {
            const url =
              galleryItem.msShareUrl ||
              encodeURIComponent(window.location.href);
            const title = galleryItem.msText;
            const msShareLink = `https://tootpick.org/#text=${title}%20${url}`;
            return msShareLink;
          },
        },
      ],
    });
  }
});
