export default function Header() {
  return (
    <header className="bg-[#FF478B] text-white w-full rounded-b-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between container mx-auto p-4 gap-4">
        <a href="/" className="flex items-center gap-4">
          <img
            src="https://radiquum.wah.su/static/avatar_512.jpg"
            alt=""
            className="w-16 h-16 rounded-lg"
          />
          <h1 className="text-2xl font-bold xl:text-3xl 2xl:text-4xl inter-semibold">
            KENTAI RADIQUUM
          </h1>
        </a>
        <a href="./feed.xml" className="hidden md:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ffffff"
              d="M5 21q-.825 0-1.412-.587T3 19t.588-1.412T5 17t1.413.588T7 19t-.587 1.413T5 21m12 0q0-2.925-1.1-5.462t-3-4.438t-4.437-3T3 7V4q3.55 0 6.625 1.325t5.4 3.65t3.65 5.4T20 21zm-6 0q0-1.675-.625-3.113T8.65 15.35t-2.537-1.725T3 13v-3q2.3 0 4.288.863t3.487 2.362t2.363 3.488T14 21z"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}
