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

      <div className="" id={`gallery-${year}`} data-type="gallery" data-year={year}>
        {images.map((image) => (
          <a
            href={image.image}
            className="lg:w-1/3 lg:h-1/3 sm:w-1/2 sm:h-1/2 p-2"
            key={`${year}-${image.id}`}
            data-slide-name={image.id}
          >
            <img
              src={image.thumbnail}
              className="w-full h-full object-cover rounded-lg"
              alt={image.alt}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
