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
          const date = new Date(image.date);
          const fmtDate = `${date.getDate()}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
          aspectRatio < 0.95 ? image.tags.push("portrait") : aspectRatio > 1.05 ? image.tags.push("landscape") : image.tags.push("square");

          return (
            <a
              href={image.image}
              className={`w-full h-full hidden relative min-h-[228px] ${
                aspectRatio < 0.95
                  ? ""
                  : aspectRatio > 1.05
                  ? "lg:[grid-column:span_2]"
                  : "aspect-square"
              }`}
              key={`${year}-${image.id}`}
              data-slide-name={image.id}
              data-src={image.thumbnail[1024]}
              data-srcset={`${image.thumbnail[512]} 512w, ${image.thumbnail[1024]} 1024w, ${image.thumbnail[2048]} 2048w`}
              data-sizes="(max-width: 1281x) 512px,
                        (max-width: 2400px) 1024px,
                        2048px"
              data-download-url={image.image}
              data-type="image"
              data-tags={image.tags.join(",")}
              data-facebook-text={image.alt || "Photo by @radiquum"}
              data-pinterest-text={image.alt || "Photo by @radiquum"}
              data-tweet-text={image.alt || "Photo by @radiquum"}
              data-reddit-text={image.alt || "Photo by @radiquum"}
              data-bsky-text={image.alt || "Photo by @radiquum.wah.su"}
              data-ms-text={image.alt || "Photo by @radiquum@furry.engineer"}
              data-facebook-share-url={image.image}
              data-twitter-share-url={image.image}
              data-pinterest-share-url={image.image}
              data-reddit-share-url={image.image}
              data-bsky-share-url={image.image}
              data-ms-share-url={image.image}
            >
              <img
                src={image.thumbnail[512]}
                srcSet={`${image.thumbnail[512]} 512w, ${image.thumbnail[1024]} 1024w, ${image.thumbnail[2048]} 2048w`}
                sizes="(max-width: 1281px) 512px,
                    (max-width: 2400px) 1024px,
                    2048px"
                className="w-full h-full object-cover rounded-sm"
                loading="lazy"
                alt={image.alt}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-95% to-transparent pt-8 p-2 invisible" data-overlay="true">
                <div className="flex flex-col md:flex-row md:items-center md:gap-2 text-gray-200 text-xs lg:text-sm">
                  <div>
                    {image.width}x{image.height}
                  </div>
                  <div>{fmtDate}</div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
