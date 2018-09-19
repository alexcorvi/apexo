import { ChooseDoctor } from './login/choose-doctor';
import { connectToDB } from './db';
import { ErrorBoundary, MainComponent } from './main/main';
import { files } from './files/files';
import { HeaderComponent } from './header/header';
import { login, LoginStep } from './login/data.login';
import { LoginComponent } from './login/login';
import { menu } from './menu/data.menu';
import { MenuComponent } from './menu/menu';
import { modals } from './modal/data.modal';
import { ModalsComponent } from './modal/modal';
import { Prompt } from './prompts/class.prompt';
import { prompts } from './prompts/data.prompts';
import { PromptsComponent } from './prompts/prompts';
import { router } from './router/data.router';
import { RouterComponent } from './router/router';
import { user } from './user/data.user';
import { UserComponent } from './user/user';

// API
export const API = {
	menu,
	router,
	Prompt,
	prompts,
	connectToDB,
	login,
	user,
	LoginStep,
	modals,
	files
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
	ModalsComponent,
	ErrorBoundary
};

(window as any).API = API;
