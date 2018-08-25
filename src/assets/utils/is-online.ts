import { checkServer } from './check-server';
export async function isOnline(server: string) {
	if (!navigator.onLine) {
		return false;
	}
	return await checkServer(server);
}
