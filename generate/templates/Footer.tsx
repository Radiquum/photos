export default function Footer() {
    return (
        <div className="bg-[#262626] text-white w-full rounded-t-lg">
            <div className="container mx-auto p-4 flex flex-col gap-4">
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="flex gap-2 items-center">
                    <p>Licensed Under CC BY-SA 4.0</p>
                    <img alt="CC BY-SA 4.0" src="https://licensebuttons.net/l/by-sa/4.0/88x31.png" className="w-24" />
                </a>
                <a href="./feed.xml" className="flex gap-2 items-center">
                    <p> {'>'} RSS Feed</p>
                </a>

                <a href="https://t.me/photowah" className="flex gap-2 items-center">
                    <p> {'>'} Photo Telegram Channel</p>
                </a>
                <a href="https://pixey.org/radiquum" className="flex gap-2 items-center">
                    <p> {'>'} Pixey.org</p>
                </a>
            </div>
        </div>
    )
}