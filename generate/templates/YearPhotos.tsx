import { type Image } from "../build";

interface YearPhotosProps {
  year: string;
  images: Image[];
}

export default function YearPhotos({ year, images }: YearPhotosProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold xl:text-3xl 2xl:text-4xl inter-semibold mb-4">
        {year}
      </h2>

      <div
        className="grid grid-cols-6 grid-flow-row-dense gap-2"
        id={`gallery-${year}`}
        data-type="gallery"
        data-year={year}
      >
        {images.map((image) => {
          const aspectRatio = image.width / image.height;
          return (
            <a
              href={image.image}
              className={`w-full h-full ${
                aspectRatio < 0.95 ? "[grid-row:span_2] aspect-[1/2]" : aspectRatio > 1.05 ? "[grid-column:span_2] aspect-[2/1]" : "aspect-square"
              }`}
              key={`${year}-${image.id}`}
              data-slide-name={image.id}
              data-src={image.thumbnail[2048]}
              data-lg-size={`512-100-480, 1200-513-960, 2048-1201`}
              data-responsive={`${image.thumbnail[512]} 480, ${image.thumbnail[1024]} 960`}
              data-srcset={`${image.thumbnail[512]} 480w, ${image.thumbnail[1024]} 960w, ${image.thumbnail[2048]} 1920w`}
              data-sizes="(max-width: 600px) 480px,
                        (max-width: 1200px) 960px,
                        1920px"
              data-download-url={image.image}
            >
              <img
                src={image.thumbnail[512]}
                srcSet={`${image.thumbnail[512]} 480w, ${image.thumbnail[1024]} 960w, ${image.thumbnail[2048]} 1920w`}
                sizes="(max-width: 600px) 480px,
                    (max-width: 1200px) 960px,
                    1920px"
                className="w-full h-full object-cover"
                alt={image.alt}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
