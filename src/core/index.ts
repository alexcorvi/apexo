import { ChooseUser } from "./login/choose-user";
import { connectToDB } from "./db";
import { ErrorBoundary, MainComponent } from "./main/main";
import { files } from "./files/files";
import { HeaderComponent } from "./header/header";
import { login, LoginStep } from "./login/data.login";
import { LoginComponent } from "./login/login";
import { menu } from "./menu/data.menu";
import { MenuComponent } from "./menu/menu";
import { modals } from "./modal/data.modal";
import { ModalsComponent } from "./modal/modal";
import { Message } from "./messages/class.message";
import { messages } from "./messages/data.messages";
import { MessagesComponent } from "./messages/messages";
import { router } from "./router/data.router";
import { RouterComponent } from "./router/router";
import { user } from "./user/data.user";
import { UserComponent } from "./user/user";
import { backup, restore, DropboxFile } from "../assets/utils/backup";

export { DropboxFile };

// API
export const API = {
	menu,
	router,
	Message,
	messages,
	connectToDB,
	login,
	user,
	LoginStep,
	modals,
	files,
	backup,
	restore
};

// Components
export const components = {
	HeaderComponent,
	MainComponent,
	MenuComponent,
	MessagesComponent,
	RouterComponent,
	LoginComponent,
	UserComponent,
	ChooseUser,
	ModalsComponent,
	ErrorBoundary
};

(window as any).API = API;
