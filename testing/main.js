const { app, BrowserWindow, ipcMain } = require("electron");
const { watchFile } = require("fs");
const path = require("path");
const fs = require("fs");

let win;

function start() {
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.loadURL("http://localhost:8000");
	win.openDevTools();
	win.maximize();
	win.webContents.executeJavaScript(
		fs.readFileSync("./test.js", { encoding: "utf8" })
	);
	win.webContents.session.clearStorageData();
}

watchFile("./test.js", () => {
	let temp = win;
	start();
	temp.close();
});

app.on("ready", start);

ipcMain.on("clear", () => {
	win.webContents.session.clearStorageData();
	win.reload();
});

ipcMain.on("type", (event, arg) => {
	arg.split("").forEach(x =>
		win.webContents.sendInputEvent({ type: "char", keyCode: x })
	);
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
