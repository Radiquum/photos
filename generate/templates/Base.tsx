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
        {isDev ? <script src="/static/js/hotreload.js"></script> : ""}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
