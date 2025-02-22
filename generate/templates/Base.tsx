import Footer from "./Footer";
import Header from "./Header";

interface BaseProps {
  children: React.ReactNode;
  isDev?: boolean;
}

export default function Base({ children, isDev }: BaseProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Radiquum/Photos</title>
        <link rel="stylesheet" href="./static/css/tailwind.css" />
        {isDev ? <script src="/static/js/hotreload.js"></script> : ""}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />


        <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/lightgallery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/plugins/share/lg-share.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/plugins/thumbnail/lg-thumbnail.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/plugins/zoom/lg-zoom.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/plugins/hash/lg-hash.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/plugins/fullscreen/lg-fullscreen.min.js"></script>

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lightgallery.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-share.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-thumbnail.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-zoom.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-fullscreen.min.css" />

        <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kentai Radiquum" />
        <meta property="og:url" content="https://radiquum.wah.su" />
        <meta property="og:image" content="https://radiquum.wah.su/static/opengraph.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:description"
            content="Online gallery of Kentai Radiquum" />
        <meta property="og:image:width" content="1203" />
        <meta property="og:image:height" content="627" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kentai Radiquum" />
        <meta name="twitter:site" content="@radiquum" />
        <meta name="twitter:description"
            content="Online gallery of Kentai Radiquum" />
        <meta name="twitter:image" content="https://radiquum.wah.su/static/opengraph.png" />

        <script defer data-domain="radiquum.wah.su/photos" data-api="https://a.wah.su/api/event" src="https://a.wah.su/js/script.js"></script>
      </head>
      <body className="bg-[#121B2C] text-white min-h-screen flex flex-col">
        <Header />
        {children}
        <Footer />
        <script src="./static/js/initGalleries.js" />
        </body>
    </html>
  );
}
