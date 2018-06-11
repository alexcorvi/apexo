import { data } from '../../modules';
import { login } from '../login/data.login';

export async function report({ domain, error }: { domain: string; error: string }) {
	const state = JSON.stringify(data);
	const clinic = login.clinicID;
	const doctor = data.doctorsData.doctors.list[data.doctorsData.doctors.getIndexByID(login.currentDoctorID)];
	const rep = `
	New Error Report: ${new Date().toDateString()}
		domain: ${domain}
		error: ${error}
		clinic: ${login.clinicID}
		doctor: ${JSON.stringify(doctor.toJSON())}
		state: ${state}
	`;
	const reportRes = await login.request<{ ok: number; n: number }>({
		namespace: 'issues',
		subPath: 'auto_report',
		method: 'POST',
		data: { rep }
	});
	console.log(reportRes);
}
