const galleries = document.querySelectorAll('[data-type="gallery"]');

galleries.forEach((item, idx) => {
  lightGallery(item, {
    plugins: [lgThumbnail, lgHash, lgShare, lgFullscreen, lgZoom],
    speed: 500,
    thumbnail: true,
    download: true,
    animateThumb: true,
    zoomFromOrigin: false,
    toggleThumb: false,
    galleryId: Number(item.getAttribute('data-year')),
    hash: true,
    customSlideName: true,
    mobileSettings: { controls: true, showCloseIcon: true, download: true }
  });
});
