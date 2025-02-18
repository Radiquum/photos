import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { cert } from "firebase-admin/app";
import { Log } from "./utils";
import { renderToString } from "react-dom/server";
import fs from "fs";
import exec from "child_process";
import Base from "./templates/Base";

const log = new Log();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
}
if (!process.env.FIREBASE_COLLECTION) {
  throw new Error("FIREBASE_COLLECTION is not set");
}

const ENVIRONMENT = process.env.ENVIRONMENT || "prod";

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT as string);
const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

interface Url {
  name: string;
  value: string;
}

interface Image {
  id: string;
  alt: string;
  tags: string[];
  urls: Url[];
  mimetype: string;
  width: number;
  height: number;
  date: number;
}

const tags: string[] = [];
const items: Image[] = [];

function addTag(tag: string) {
  if (tags.includes(tag)) {
    return;
  }
  tags.push(tag);
}

await db
  .collection(process.env.FIREBASE_COLLECTION as string)
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      data.tags.forEach((tag: string) => {
        addTag(tag);
      });
      items.push({
        id: doc.id,
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

const html = renderToString(
  <Base isDev={ENVIRONMENT == "dev"}>
    <p>Paragraph.</p>
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

// console.log(await db.collection("images").count().get().then((snapshot) => {
//     return snapshot.data().count;
// }));
