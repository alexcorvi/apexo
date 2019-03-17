import { Language } from "./language.interface";

export const ar: Language = {
	code: "ar",
	RTL: true,
	terms: {
		/**========================================
		 * Home page
		 */

		Welcome: "",
		Missed: "",
		Paid: "",
		Outstanding: "",
		"Today's Appointments": "",
		"Tomorrow's Appointments": "",
		Appointment: "",
		Operators: "",

		/**========================================
		 * Menu Items
		 */

		Home: "",
		settings: "",
		treatments: "",
		patients: "",
		prescriptions: "",
		staff: "",
		orthodontic: "",
		appointments: "",
		statistics: "",

		/**========================================
		 * Basic
		 */
		Patient: "",
		Started: "",
		"Next Appointment": "",
		"Search Patients...": "",
		"More options": "",
		"There's no data at this section yet": "",
		"Didn't find anything that matches your search criteria": "",
		"Please enter your PIN": "",
		"Incorrect PIN provided": "",
		Confirm: "",
		Cancel: "",
		Logout: "",
		"Switch User": "",
		Appointments: "",
		"This patient does not have any appointment": "",
		"Book New Appointment": "",

		/**========================================
		 * Calendar
		 */
		SU: "",
		MO: "",
		TU: "",
		WE: "",
		TH: "",
		FR: "",
		SA: "",
		Sunday: "",
		Monday: "",
		Tuesday: "",
		Wednesday: "",
		Thursday: "",
		Friday: "",
		Saturday: "",
		Jan: "",
		Feb: "",
		Mar: "",
		Apr: "",
		May: "",
		Jun: "",
		Jul: "",
		Aug: "",
		Sep: "",
		Oct: "",
		Nov: "",
		Dec: "",
		"No Appointments today": "",
		"Add New": "",
		"All appointments": "",
		"My appointments only": "",
		"Type to filter": "",
		"Date:": "",
		"Select a date...": "",

		/**========================================
		 * Editing Appointment
		 */
		With: "",
		"other appointment": "",
		"Select a date": "",
		"Time:": "",
		"Operating Staff:": "",
		"Case Details": "",
		Details: "",
		Treatment: "",
		"Units number": "",
		"Involved Teeth": "",
		"Enter tooth number": "",
		Prescription: "",
		"Enter prescription": "",
		"Expenses & Price": "",
		"Time (Hours, minutes, seconds)": "",
		Start: "",
		"Time value": "",
		Expenses: "",
		"Final Price": "",
		Profit: "",
		"Profit percentage": "",
		Unpaid: "",
		Done: "",
		"Not Done": "",
		Delete: "",
		"Attachments are not available while you're offline.": "",
		"Are you sure you want to delete this appointment?": "",

		/**========================================
		 * Searching and filtering
		 */
		search: "",
		"Nothing found": "",
		Filter: "",
		Results: "",
		"out of": "",
		"Search Patients": "",
		"Load More": "",

		/**========================================
		 * Orthodontics
		 */
		"Orthodontic Patient": "",
		"Patient Details": "",
		"Dental History": "",
		"Extraoral Features": "",
		"Lips competency": "",
		"Facial profile": "",
		"Oral hygiene": "",
		"Jaw to Jaw Relationship": "",
		"Intercuspal Relationships": "",
		"Space Analysis: Upper Dentition": "",
		"Space Analysis: Lower Dentition": "",
		"Problems List": "",
		"Type to add": "",
		"Progress gallery": "",
		"Treatment plan": "",
		"Teeth to extract": "",
		"Teeth to fill": "",
		"Appliances & Modifications": "",
		Description: "",
		"New Appliance / Modification": "",
		"Cephalometric History": "",
		"New Analysis": "",
		Orthograph: "",
		"Open orthograph": "",
		"Orthodontic case will be deleted": "",

		/**========================================
		 * Dental History
		 */
		"View graphic chart": "",
		"View sorted table": "",
		sound: "",
		filled: "",
		compromised: "",
		endo: "",
		missing: "",
		rotated: "",
		displaced: "",
		"gum-recessed": "",
		"History notes": "",

		/**========================================
		 * Patient details
		 */
		"Last Appointment": "",
		Label: "",
		male: "",
		female: "",
		"years old": "",
		"Not registered": "",
		"Birth Year / Age": "",
		Gender: "",
		Male: "",
		Female: "",
		Phone: "",
		Email: "",
		Address: "",
		Labels: "",
		"Notes and medical history": "",
		Notes: "",
		"All of the patient": "",
		"'s data will be deleted along with": "",
		"of appointments": "",

		/**========================================
		 * Prescriptions
		 * */
		"Item name": "",
		Dose: "",
		Frequency: "",
		Form: "",
		"Prescription details": "",
		"Dosage in mg": "",
		"Times per day": "",
		"Units per time": "",
		"Item form": "",
		"Are you sure you want to delete the prescription?": "",

		/**========================================
		 * Settings
		 */
		Language: "",
		"Financial Settings": "",
		"Time expenses (per hour)": "",
		"Currency Symbol": "",
		"This symbol you enter here will be used across your application.": "",
		// tslint:disable-next-line:max-line-length
		"When time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses. So here you can put the electricity, rent, and other time dependent expenses.":
			"",
		"Optional Modules and features": "",
		"Prescriptions Module Enabled": "",
		"Prescriptions Module Disabled": "",
		"Orthodontic Module Enabled": "",
		"Orthodontic Module Disabled": "",
		"Statistics Module Enabled": "",
		"Statistics Module Disabled": "",
		"Time Tracking Enabled": "",
		"Time Tracking Disabled": "",
		"Have staff contact details": "",
		"Don't have staff contact details": "",
		"Optional input: patient email": "",
		"Optional input: patient address": "",
		"Optional input: orthodontic case sheet": "",
		"Optional input: orthodontic treatment plan": "",
		"Embedded app: cephalometric analysis": "",
		"Embedded app: Orthograph": "",
		"Orthograph Dropbox Access Token": "",
		"Learn more": "",
		"The access token used to save and retrieve Orthograph data.": "",
		"Backup and restore": "",
		"Using this section you can download a file representing all of your clinic data, use this file - later, to restore the same data.":
			"",
		"Run compaction": "",
		"Download a backup": "",
		"Restore from file": "",
		"Automated backup": "",
		// tslint:disable-next-line:max-line-length
		"Using automated backups you can set your application to automatically backup your data and store it in Dropbox. To turn on automated backups, enter your app access token.":
			"",
		"Backup frequency": "",
		Daily: "",
		Weekly: "",
		Monthly: "",
		"How many backups to retain": "",
		"Dropbox access token": "",
		Backup: "",
		Actions: "",

		/**========================================
		 * Staff page
		 */

		"Staff Member": "",
		"upcoming appointments": "",
		"appointments for": "",
		"Operates on patients": "",
		"Doesn't operate on patients": "",
		Name: "",
		"Days on duty": "",
		"Login PIN": "",
		"Contact Details": "",
		"Phone Number": "",
		"Level and permission": "",
		"You can't edit your own level and permissions": "",
		"Can view staff page": "",
		"Can not view staff page": "",
		"Can view patients page": "",
		"Can not view patients page": "",
		"Can view orthodontics page": "",
		"Can not view orthodontics page": "",
		"Can view appointments page": "",
		"Can not view appointments page": "",
		"Can view treatments page": "",
		"Can not view treatments page": "",
		"Can view prescriptions page": "",
		"Can not view prescriptions page": "",
		"Can view statistics page": "",
		"Can not view statistics page": "",
		"Can view settings page": "",
		"Can not view settings page": "",
		"Can edit staff page": "",
		"Can not edit staff page": "",
		"Can edit patients page": "",
		"Can not edit patients page": "",
		"Can edit orthodontics page": "",
		"Can not edit orthodontics page": "",
		"Can edit appointments page": "",
		"Can not edit appointments page": "",
		"Can edit treatments page": "",
		"Can not edit treatments page": "",
		"Can edit prescriptions page": "",
		"Can not edit prescriptions page": "",
		"Can edit settings page": "",
		"Can not edit settings page": "",
		"Upcoming Appointments": "",
		"Are you sure you want to delete": "",

		/**========================================
		 * Statistics page
		 */
		Age: "",
		"Patients' Age": "",
		"Appointments By Date": "",
		Payments: "",
		Profits: "",
		"Finances by date": "",
		"Patients' Gender": "",
		"Most Applied Treatments": "",
		"Most Involved Teeth": "",
		"Treatments by gender": "",
		"Applied times": "",
		"Treatments by profits": "",
		"Filter By Staff Member": "",
		"All Members": "",
		From: "",
		To: "",
		"Quick stats": "",

		/**========================================
		 * Treatments page
		 */
		"Expenses/unit": "",
		"Done appointments": "",
		"Upcoming appointments": "",
		"per unit": "",
		done: "",
		upcoming: "",
		"Treatment details": "",
		"Treatment title": "",
		"Treatment expenses (per unit)": "",
		"will be deleted": ""
	}
};