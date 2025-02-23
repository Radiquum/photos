/** @jsxImportSource jsx-xml */

import { type Image } from "../../build";

interface RSSItemProps {
  Image: Image;
}

export default function RSSItem({ Image }: RSSItemProps) {
  return (
    <item>
      <title>{Image.id}</title>
      <description>
        {Image.alt}{" "}
        {`<br> <img src="${Image.thumbnail[1024]}" alt="" width="512"> <br>`}
      </description>
      <link>{Image.image}</link>
      <guid isPermaLink="false">{Image.id}</guid>
      <pubDate>{new Date(Image.date).toUTCString()}</pubDate>
    </item>
  );
}
