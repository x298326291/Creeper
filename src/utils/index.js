import { dialog, ipcMain } from "electron";
import { win } from "../background";

import { connect } from "./ssh";
import { copy, mkdir, open, save } from "./fs";
import { deployHandler } from "../run/deploy";

ipcMain.on("connect", (e, param) => {
  connect(param, win);
});

ipcMain.on("move-file", (e, param) => {
  copy(param).then(() => {
    win.send("moveSuccess", `复制文件完成`);
  });
});

ipcMain.on("mkdir", (e, param) => {
  mkdir(param).then(() => {
    win.send("mkdirSuccess", `创建文件夹完成`);
  });
});

ipcMain.on("open-file", (e, param) => {
  open(param).then(res => {
    win.send("openSuccess", res);
  });
});

ipcMain.on("save-file", (e, param) => {
  save(param).then(() => {
    win.send("saveSuccess", "ok");
  });
});

ipcMain.on("open-directory-dialog", () => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"]
    })
    .then(dir => {
      if (dir) {
        win.send("selected-dirname", dir);
      }
    });
});

ipcMain.on("open-jar-file-dialog", () => {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Jar", extensions: ["jar"] }]
    })
    .then(files => {
      if (files) {
        win.send("selected-file", files);
      }
    });
});

ipcMain.on("open-core-file-dialog", () => {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Jar", extensions: ["jar"] }]
    })
    .then(files => {
      if (files) {
        win.send("selected-core-file", files);
      }
    });
});

ipcMain.on("open-zip-file-dialog", () => {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Zip", extensions: ["zip"] }]
    })
    .then(files => {
      if (files) {
        win.send("selected-zip", files);
      }
    });
});

ipcMain.on("run-handler", (e, app, mods) => {
  deployHandler(app, mods);
});
