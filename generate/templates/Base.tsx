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
        <link rel="stylesheet" href="/static/css/tailwind.css" />
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-thumbnail.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-share.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-zoom.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-transitions.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightgallery@2.8.2/css/lg-fullscreen.min.css" />

      </head>
      <body className="bg-[#121B2C] text-white">
        {children}
        <script src="/static/js/initGalleries.js" />
        </body>
    </html>
  );
}
