const galleries = document.querySelectorAll('[data-type="gallery"]');

galleries.forEach((item, idx) => {
  lightGallery(item, {
    // plugins: [lgThumbnail, lgHash, lgShare, lgFullscreen, lgZoom],
    plugins: [lgThumbnail, lgHash, lgZoom],
    // speed: 500,
    // thumbnail: true,
    // animateThumb: true,
    // zoomFromOrigin: true,
    // allowMediaOverlap: false,
    // mode: 'lg-zoom-in-out',
    // galleryId: Number(item.getAttribute('data-year')),
    hash: true,
    customSlideName: true,
  });
});
