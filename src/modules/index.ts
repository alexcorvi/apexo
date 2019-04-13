import "./appointments/components/calendar.scss";
import "./orthodontic/components/ortho-list.scss";
import "./orthodontic/components/records.scss";
import "./patients/components/patients-listing.scss";
import "./prescriptions/components/prescription-table";
import "./settings/components/settings.scss";
import "./statistics/components/statistics.scss";
import "./treatments/components/treatments.scss";
// ^ dynamically imported (code-splitting) styles

export * from "./appointments";
export * from "./orthodontic";
export * from "./patients";
export * from "./prescriptions";
export * from "./settings";
export * from "./staff";
export * from "./statistics";
export * from "./treatments";
export * from "./register-modules";
