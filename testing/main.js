const { app, BrowserWindow, ipcMain } = require("electron");
const { watchFile } = require("fs");
const path = require("path");

let win;

function start() {
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: false,
			preload: __dirname + "/test.js"
		}
	});
	win.loadURL("http://localhost:8000");
	win.openDevTools();
	win.maximize();
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

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
