const galleries = document.querySelectorAll('[data-type="gallery"]');

galleries.forEach((item, idx) => {
  lightGallery(item, {
    plugins: [lgThumbnail, lgHash, lgShare, lgFullscreen, lgZoom],
    speed: 500,
    thumbnail: true,
    animateThumb: false,
    zoomFromOrigin: false,
    toggleThumb: true,
    galleryId: Number(item.getAttribute('data-year')),
    hash: true,
    customSlideName: true,
  });
});
