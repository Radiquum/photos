import { type Image } from "../build";

interface YearPhotosProps {
  year: string;
  images: Image[];
}

export default function YearPhotos({ year, images }: YearPhotosProps) {
  return (
    <div className="hidden">
      <h2 className="text-2xl font-bold xl:text-3xl 2xl:text-4xl inter-semibold mb-4">
        {year}
      </h2>

      <div
        className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 grid-flow-row-dense gap-2"
        id={`gallery-${year}`}
        data-type="gallery"
        data-year={year}
      >
        {images.map((image) => {
          const aspectRatio = image.width / image.height;
          return (
            <a
              href={image.image}
              className={`w-full h-full hidden ${
                aspectRatio < 0.95 ? "" : aspectRatio > 1.05 ? "lg:[grid-column:span_2]" : "aspect-square"
              }`}
              key={`${year}-${image.id}`}
              data-slide-name={image.id}
              data-src={image.thumbnail[2048]}
              data-srcset={`${image.thumbnail[512]} 480w, ${image.thumbnail[1024]} 1440w, ${image.thumbnail[2048]} 2001w`}
              data-sizes="(max-width: 1000x) 480px,
                        (max-width: 2000px) 1440px,
                        2001px"
              data-download-url={image.image}
              data-type="image"
              data-tags={image.tags.join(",")}
            >
              <img
                src={image.thumbnail[512]}
                srcSet={`${image.thumbnail[512]} 480w, ${image.thumbnail[1024]} 1440w, ${image.thumbnail[2048]} 2001w`}
                sizes="(max-width: 1000px) 480px,
                    (max-width: 2000px) 1440px,
                    2001px"
                className="w-full h-full object-cover rounded-sm"
                loading="lazy"
                alt={image.alt}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
