/** @jsxImportSource jsx-xml */
import { render } from "jsx-xml";
import RSSItem from "./RSSItem";
import { type Image } from "../../build";

export const rss = (images: Image[]) => {
  return render(
    <RSS lastPostDate={images[0].date}>
      {images.map((image) => (
        <RSSItem Image={image} />
      ))}
    </RSS>
  ).end({ headless: true });
};
function RSS({ children, lastPostDate }: any) {
  return (
    <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
      <channel>
        <title>Radiquum Photos</title>
        <description>Online Gallery of @radiquum</description>
        <link>https://radiquum.wah.su/photos/</link>
        <language>en-us</language>
        <category>Photography</category>
        <copyright>CC BY-SA 4.0</copyright>
        <atom:link href="https://radiquum.wah.su/photos/feed.xml" rel="self" type="application/rss+xml" />
        <lastBuildDate>{new Date().toUTCString()}</lastBuildDate>
        <pubDate>{new Date(lastPostDate).toUTCString()}</pubDate>
        {children}
      </channel>
    </rss>
  );
}
