export default function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="container mx-auto">
      <div className="flex overflow-x-auto px-4 py-2 gap-2 scrollbar-thin scrollbar-corner-rounded-sm scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <button
          className="bg-gray-800 rounded-lg px-4 py-1 text-sm"
          key="all"
          data-type="tag"
          data-tag="all"
        >
          all
        </button>
        <button
          className="bg-gray-800 rounded-lg px-4 py-1 text-sm"
          key="all"
          data-type="tag"
          data-tag="portrait"
        >
          portrait
        </button>
        <button
          className="bg-gray-800 rounded-lg px-4 py-1 text-sm"
          key="all"
          data-type="tag"
          data-tag="landscape"
        >
          landscape
        </button>
        <button
          className="bg-gray-800 rounded-lg px-4 py-1 text-sm"
          key="all"
          data-type="tag"
          data-tag="square"
        >
          square
        </button>
        {tags.map((tag) => (
          <button
            className="bg-gray-800 rounded-lg px-4 py-1 text-sm hidden"
            key={tag}
            data-type="tag"
            data-tag={tag}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
