import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { cert } from "firebase-admin/app";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
}
if (!process.env.FIREBASE_COLLECTION) {
  throw new Error("FIREBASE_COLLECTION is not set");
}

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

console.log(tags, items);

// console.log(await db.collection("images").count().get().then((snapshot) => {
//     return snapshot.data().count;
// }));
