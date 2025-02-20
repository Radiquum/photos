import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { cert } from "firebase-admin/app";
import { Log } from "./utils";
import { renderToString } from "react-dom/server";
import fs from "fs";
import exec from "child_process";
import Base from "./templates/Base";
import Header from "./templates/Header";
import YearPhotos from "./templates/YearPhotos";

const log = new Log();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
}
if (!process.env.FIREBASE_COLLECTION) {
  throw new Error("FIREBASE_COLLECTION is not set");
}

const ENDPOINT = process.env.AWS_ENDPOINT || "";
const BUCKET = process.env.AWS_BUCKET || "";

const ENVIRONMENT = process.env.ENVIRONMENT || "prod";

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT as string);
const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

export interface Url {
  name: string;
  value: string;
}

interface ThumbnailSize {
  "512": string;
  "1024": string;
  "2048": string;
}

export interface Image {
  id: string;
  image: string;
  thumbnail: ThumbnailSize;
  alt: string;
  tags: string[];
  urls: Url[];
  mimetype: string;
  width: number;
  height: number;
  date: number;
}

export type Years = Record<string, Image[]>;

let tags: string[] = [];
let items: Record<string, Image[]> = {};

function addTag(tag: string) {
  if (tags.includes(tag)) {
    return;
  }
  tags.push(tag);
}

if (
  !fs.existsSync("data") ||
  !fs.existsSync("data/tags.json") ||
  !fs.existsSync("data/items.json")
) {
  log.warn("data/tags.json or data/items.json does not exist");
  await db
    .collection(process.env.FIREBASE_COLLECTION as string)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data() as Image;
        data.tags.forEach((tag: string) => {
          addTag(tag);
        });

        const year: string = new Date(data.date).getFullYear().toString();
        if (!(year in items)) {
          items[year] = [];
        }

        const ext = doc.id.split(".").pop() as string;
        const path = doc.id.split(".")[0] as string;

        items[year].push({
          id: doc.id,
          image: `${ENDPOINT}/${BUCKET}/${path}/${path}.${ext}`,
          thumbnail: {
            "512": `${ENDPOINT}/${BUCKET}/${path}/${path}-512.${ext}`,
            "1024": `${ENDPOINT}/${BUCKET}/${path}/${path}-1024.${ext}`,
            "2048": `${ENDPOINT}/${BUCKET}/${path}/${path}-2048.${ext}`
          },
          alt: data.alt,
          tags: data.tags,
          urls: data.urls,
          mimetype: data.mimetype,
          width: data.width,
          height: data.height,
          date: data.date,
        });
      });
    });
  if (!fs.existsSync("data")) fs.mkdirSync("data");
  fs.writeFileSync("data/tags.json", JSON.stringify(tags));
  fs.writeFileSync("data/items.json", JSON.stringify(items));
} else {
  log.warn("using cached data");
  tags = JSON.parse(fs.readFileSync("data/tags.json", "utf-8"));
  items = JSON.parse(fs.readFileSync("data/items.json", "utf-8"));
}

Object.keys(items).forEach((year) => {
  items[year].sort((a, b) => b.date - a.date);
});

const html = renderToString(
  <Base isDev={ENVIRONMENT == "dev"}>
    <Header />
    <div className="container mx-auto p-4">
      {Object.keys(items).sort().reverse().map((year) => (
        <YearPhotos
          year={year}
          images={items[year]}
          key={`${year}-container`}
        />
      ))}
    </div>
  </Base>
);

if (!fs.existsSync("out")) fs.mkdirSync("out");
if (!fs.existsSync("out/static")) fs.mkdirSync("out/static");
if (!fs.existsSync("out/static/js")) fs.mkdirSync("out/static/js");
if (!fs.existsSync("out/static/css")) fs.mkdirSync("out/static/css");

fs.cpSync("static", "out/static", { recursive: true });
if (ENVIRONMENT == "dev") {
  fs.cpSync("static_dev/hotreload.js", "out/static/js/hotreload.js");
} else {
  log.info("Minifying resources...");
  exec.exec(
    "bun run tailwindcss -i static_dev/input.css -o out/static/css/tailwind.css --build --minify",
    (error, stdout, stderr) => {
      if (error) {
        log.error(error.message);
        return;
      }
      if (stderr) {
        log.error(stderr);
        return;
      }
      log.info(stdout);
    }
  );
}
fs.writeFileSync("out/index.html", `<!DOCTYPE html />${html}`);
log.info("Build finished!");
