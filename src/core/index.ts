import { connectToDB } from './db';
import { ChooseDoctor } from './login/choose-doctor';
import { HeaderComponent } from './header/header';
import { LoginComponent } from './login/login';
import { MainComponent } from './main/main';
import { MenuComponent } from './menu/menu';
import { Prompt } from './prompts/class.prompt';
import { PromptsComponent } from './prompts/prompts';
import { RouterComponent } from './router/router';
import { UserComponent } from './user/user';
import { login, LoginStep } from './login/data.login';
import { menu } from './menu/data.menu';
import { messaging } from './messaging/messaging';
import { prompts } from './prompts/data.prompts';
import { router } from './router/data.router';
import { user } from './user/data.user';
import { modals } from './modal/data.modal';
import { ModalsComponent } from './modal/modal';

// API
export const API = {
	menu,
	router,
	Prompt,
	prompts,
	messaging,
	connectToDB,
	login,
	user,
	LoginStep,
	modals
};

// Components
export const components = {
	HeaderComponent,
	MainComponent,
	MenuComponent,
	PromptsComponent,
	RouterComponent,
	LoginComponent,
	UserComponent,
	ChooseDoctor,
	ModalsComponent
};

(window as any).API = API;
