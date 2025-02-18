import WebSocket from "ws";
import fs from "fs";
import chokidar from "chokidar";
import exec from "child_process";
import express from "express";
import { Log } from "./utils";
import path from "path";
import { WebSocketServer } from "ws";

let triggered = 0;
const delay = 1000;

let WSclients: any[] = [];

const log = new Log();

function onChange() {
  if (triggered != 0 && Date.now() - triggered < delay) {
    log.warn(`Rebuild was triggered less than a ${delay}ms ago!`, true);
    return;
  }
  triggered = Date.now();

  exec.exec("bun run build.tsx", (error, stdout, stderr) => {
    if (error) {
      log.error(error.message);
      return;
    }
    if (stderr) {
      log.error(stderr);
      return;
    }
    log.info(stdout);
    if (WSclients.length > 0) {
      log.info("Reloading web page...");
      WSclients.forEach((ws) => ws.send("RELOAD"));
    }
  });
}

function onExit() {
  if (fs.existsSync("out")) fs.rmSync("out", { recursive: true });
  log.info("Deleted 'out' folder");
  process.exit(0);
}

const watcher = chokidar.watch(["./templates", "./build.tsx"], {
  ignored: (filePath, stats) => filePath.endsWith("watch.ts"),
  atomic: true,
  awaitWriteFinish: true,
  persistent: true,
});

function startServerWithRebuild() {
  const app = express();
  const folder = path.join(__dirname, "/out");
  const wss = new WebSocketServer({ port: 3001 });

  process.env.ENVIRONMENT = "dev";

  wss.on("connection", (ws: WebSocket) => {
    WSclients.push(ws);
    log.info(`Client ${WSclients.length} connected`);
    ws.send("CONNECTED");
  });

  process.on("SIGINT", () => {
    log.info("Gracefully shutdown and cleanup...");
    onExit();
  });

  app.use(express.static(folder));
  app.listen(3000, () => {
    log.info(`Serving files from folder ${folder}`);
    log.info("Express server is running on port 3000: http://127.0.0.1:3000");

    watcher
      .on("add", (path) => {
        log.info(`File ${path} has been added, rebuilding...`);
        onChange();
      })
      .on("change", (path) => {
        log.info(`File ${path} has been changed, rebuilding...`);
        onChange();
      })
      .on("unlink", (path) => {
        log.info(`File ${path} has been removed, rebuilding...`);
        onChange();
      });
  });
  app.on("close", () => {
    log.info("Server closed");
  });
}

startServerWithRebuild();
