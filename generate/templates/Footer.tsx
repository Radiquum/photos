export default function Footer() {
    return (
        <div className="bg-[#262626] text-white w-full rounded-t-lg">
            <div className="container mx-auto p-4 flex flex-col md:flex-row md:items-center">
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="flex gap-2 items-center">
                    <p>Licensed Under CC BY-SA 4.0</p>
                    <img alt="CC BY-SA 4.0" src="https://licensebuttons.net/l/by-sa/4.0/88x31.png" className="w-24" />
                </a>
            </div>
        </div>
    )
}