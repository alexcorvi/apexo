import { raw } from "./raw";
export const ar: typeof raw = {
	/**========================================
	 * common
	 */
	patient: "مريض",
	appointment: "موعد",
	treatment: "علاج",
	logout: "تسجيل الخروج",
	operators: "الاطباء",
	missed: "فائت",
	"who are you?": "من انت؟",
	"switch user": "تبديل المستخدم",
	expenses: "تكاليف",
	profit: "ربح",
	male: "ذكر",
	female: "انثى",
	label: "وسم",
	"years old": "سنة",
	"not registered": "غير مسجل",
	today: "اليوم",
	tomorrow: "غدًا",
	yesterday: "أمس",
	welcome: "مرحبًا",
	visit: "زيارة",
	date: "تاريخ",
	from: "منذ",
	until: "حتى",
	age: "العمر",
	payments: "الدفوعات",
	upcoming: "قادم",
	done: "منجز",
	"not done": "غير منجز",
	started: "بدأ",
	"not started yet": "لم يبدأ بعد",
	finished: "تم",
	"not finished yet": "لم يتم بعد",
	"no appointments today": "لا مواعيد لليوم",
	days: "أيام",
	register: "تسجيل",
	login: "دخول",
	reload: "اعادة تحميل",
	confirm: "تأكيد",
	cancel: "الغاء",
	stop: "ايقاف",
	start: "بدء",
	delete: "حذف",
	save: "حفظ",
	with: "مع",
	time: "الوقت",
	next: "التالي",
	previous: "السابق",
	total: "المجموع",
	payment: "دفعة",
	"basic info": "معلومات اولية",
	visits: "زيارات",
	gallery: "معرض الصور",

	/**========================================
	 * Appointments tables
	 */
	"appointments for today": "مواعد اليوم",
	"appointments for tomorrow": "مواعد الغد",
	"appointments for this week": "مواعيد هذا الاسبوع",
	"there are no appointments for tomorrow": "لا مواعيد للغد",
	"there are no appointments for today": "لا مواعيد لليوم",
	"all upcoming appointments": "المواعيد القادمة",
	"no upcoming appointments": "لا مواعيد قادمة",

	/**========================================
	 * menu items
	 */

	home: "الرئيسية",
	settings: "الاعدادات",
	treatments: "الاستطبابات",
	patients: "المرضى",
	prescriptions: "الوصفات",
	staff: "الكادر",
	orthodontic: "التقويم",
	appointments: "المواعيد",
	statistics: "الاحصائيات",

	/**========================================
	 * section title
	 */
	"case details": "تفاصيل الحالة",
	"expenses & price": "التكاليف والسعر",
	"extra-oral features": "الملاحظات خارج فم",
	"jaw - jaw relationships": "العلاقة بين الفكين",
	"intercuspal - interincisal relationships": "العلاقة بين القواطع",
	"upper arch space analysis": "تحليل المسافة للفك العلوي",
	"lower arch space analysis": "تحليل المسافة للفك السفلي",
	problems: "المشاكل",
	"treatment plan": "الخطة العلاجية",
	records: "الزيارات",
	"notes for the next visit": "ملاحظات للزيارة القادمة",
	"permanent teeth": "الاسنان الدائمية",
	"deciduous teeth": "الاسنان اللبنية",
	"patient gallery": "صور المريض",
	"patient appointments": "مواعيد المريض",
	"contact info": "معلومات الاتصال",
	"other notes": "ملاحظات اخرى",
	"prescription details": "تفاصيل الوصفة",
	"general setting": "اعدادات عامة",
	"financial settings": "اعدادات مالية",
	"optional modules and features": "ميزات اختيارية",
	"backup and restore": "الحفظ والاسترجاع",
	"automated backup and restore": "حفظ واسترجاع تلقائي",
	"login pin": "رمز الدخول",
	permission: "التفويض",
	"upcoming appointments": "المواعيد القادمة",
	"quick stats": "احصائيات سريعة",
	"treatment details": "تفاصيل العلاج",
	"treatments by profits": "الاستطبابات بحسب الربح",
	"treatments by gender": "الاستطبابات بحسب الجنس",
	"most involved teeth": "اكثر الاسنان علاجًا",
	"most applied treatments": "اكثر الاستطبابات تطبيقًا",
	"patients' gender": "جنس المرضى",
	"finances by date": "التفاصيل المالية بحسب التاريخ",
	"appointments by date": "المواعيد حسب التاريخ",
	"patients' age": "عمر المرضى",
	"other problems": "مشاكل اخرى",

	/**========================================
	 * message bars
	 */
	"no data in this section yet, you can add new data by clicking the button above":
		"لا بيانات في هذا القسم حتى الان",
	"did not find anything that matches your search criteria":
		"لا يوجد بيانات مطابقة للبحث الذي اجريته",
	"you're offline. use the latest username/password you've successfully used on this machine to login to this server":
		"لست على اتصال، قم باستخدام اخر معلومات قمت بادخالها على هذا السيرفر",
	"the case sheet of this patient does not show any problems that needs orthodontic treatment":
		"تفاصيل الحالة لهذا المريض لا تتضمن اي مشاكل ليتم علاجها",
	"a valid dropbox access token is required for this section":
		"يتطلب هذا القسم رمز دروبوكس صالح للاستخدام",
	"this patient does not seem to have any problems or concerns, have you filled the case sheet?":
		"تفاصيل الحالة لهذا المريض لا تتضمن اي مشاكل ليتم علاجها",
	"a treatment plan must be before starting the treatment":
		"يجب وضع خطة علاجية قبل البدأ بالعلاج",
	"you can not access orthodontic records while offline":
		"لا يمكنك فتح زيارات التقويم ان لم تكن على اتصال بالانترنت",
	"no visits recorded yet! add a new visit using the button below":
		"لم يتم تسجيل اي زيارة حتى الأن",
	"this patient does not seem to have any photo record uploaded, press the plus sign button below to start uploading":
		"لم يتم رفع اي صورة لهذا المريض حتى الان، اضفط علامة الـ + للبدء برفع صورة",
	"you can not access patient gallery while offline":
		"لا يمكنك فتح معرض الصور للمرضى ما لم تكن على اتصال بالانترنت",
	"this patient does not have any appointment":
		"لم يتم تسجيل اي موعد لهذا المريض",
	"backup and restore functionality are not available while you're offline":
		"عمليات الخزن الاحتياطي والاسترجاع تتطلب اتصالا بالانترنت",
	"choose the main language of display menus and items":
		"اختر لغة العرض والقوائم",
	"set the date format to be used across this application":
		"اختر صيغة الوقت المناسبة",
	"this access token is used to store files across the application, like backups and images":
		"هذا الرمز يستخدم لحفظ الملفات مثل الصور وملفات الخزن الاحتياطي",
	// tslint:disable-next-line:max-line-length
	"when time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses so here you can put the electricity, rent, and other time dependent expenses":
		"يمكنك استخدام هذه الخاصية لحساب الوقت لكل موعد، وبالتالي سيتم اضافة تكلفة الوقت الى التكلفة الاجمالية للموعد، والتي قد تتضمن الايجار والكهرباء وغيرها",
	"this symbol you enter here will be used across your application":
		"الرمز المدخل هنا سيتم استخدامه كرمز العملة في كافة انحاء التطبيق",
	"only you can edit this pin, and it can only be 4 numbers":
		"يمكنك انت فقط تحرير هذا الرمز، ويشترط ان يتكون من اربع ارقام لا غير",
	"you can't edit your own level and permissions":
		"لا يمكنك تحرير التفويضات الخاصة بك",
	"there are no upcoming appointments for this staff member":
		"لا يوجد مواعيد قادمة لعنصر الكادر هذا",
	"might not be available on this day": "قد لا يكون متواجدًا لهذا اليوم",
	"price is too low": "سعر العلاج قليل جدًا",
	"you need to add treatments in the treatments section before being able to book new appointments":
		"يجب اضافة استطبابات قبل ان يمكنك من اضافة مواعيد",
	"click a thumbnail to expand it": "اضفط على اي صورة لتكبيرها",

	/**========================================
	 * toggles
	 */
	"operates on patients": "يعمل على المرضى",
	"doesn't operate on patients": "لا يعمل على المرضى",
	"can view staff page": "يمكنه عرض الكادر",
	"can not view staff page": "لا يمكنه عرض الكادر",
	"can view patients page": "يمكنه عرض المرضى",
	"can not view patients page": "لا يمكنه عرض المرضى",
	"can view orthodontics page": "يمكنه عرض مرضى التقويم",
	"can not view orthodontics page": "لا يمكنه عرض مرضى التقويم",
	"can view appointments page": "يمكنه عرض المواعيد",
	"can not view appointments page": "لا يمكنه عرض المواعيد",
	"can view treatments page": "يمكنه عرض الاستطبابات",
	"can not view treatments page": "لا يمكنه عرض الاستطبابات",
	"can view prescriptions page": "يمكنه عرض الوصفات",
	"can not view prescriptions page": "لا يمكنه عرض الوصات",
	"can view statistics page": "يمكنه عرض الاحصائيات",
	"can not view statistics page": "لا يمكنه عرض الاحصائيات",
	"can view settings page": "يمكنه عرض الاعدادات",
	"can not view settings page": "لا يمكنه عرض الاعدادات",
	"can edit staff page": "يمكنه تحرير الكادر",
	"can not edit staff page": "لا يمكنه تحرير الكادر",
	"can edit patients page": "يمكنه تحرير المرضى",
	"can not edit patients page": "لا يمكنه تحرير المرضى",
	"can edit orthodontics page": "يمكنه تحرير مرضى التقويم",
	"can not edit orthodontics page": "لا يمكنه تحرير مرضى التقويم",
	"can edit appointments page": "يمكنه تحرير المواعيد",
	"can not edit appointments page": "لا يمكنه تحرير المواعيد",
	"can edit treatments page": "يمكنه تحرير العلاجات",
	"can not edit treatments page": "لا يمكنه تحرير العلاجات",
	"can edit prescriptions page": "يمكنه تحرير الوصفات",
	"can not edit prescriptions page": "لا يمكنه تحرير الوصفات",
	"can edit settings page": "يمكنه تحرير الاعدادات",
	"can not edit settings page": "لا يمكنه تحرير الاعدادات",
	"all appointments": "جميع المواعيد",
	"my appointments only": "مواعيدي فقط",
	"view graphic chart": "عرض على شكل مخطط",
	"view sorted table": "عرض على شكل جدول",
	"prescriptions module enabled": "تفعيل صفحة الوصفات",
	"prescriptions module disabled": "تعطيل صفحة الوصفات",
	"orthodontic module enabled": "تفعيل صفحة التقويم",
	"orthodontic module disabled": "تعطيل صفحة التقويم",
	"statistics module enabled": "تفعيل صفحة الاحصاء",
	"statistics module disabled": "تعطيل صفحة الاحصاء",
	"labwork module enabled": "تفعيل صفحة المختبر",
	"labwork module disabled": "تعطيل صفحة المختبر",
	"time tracking enabled": "تفعيل خاصية تتبع الوقت",
	"time tracking disabled": "تعطيل خاصية تتبع الوقت",

	/**========================================
	 * prompts
	 */
	'all unsaved data will be lost. all data will be removed and replaced by the backup file. type "yes" to confirm':
		"جميع البيانات سيتم حذفها واستبدالها بالبيانات الموجودة في النسخة الاحتياطية، أكتب yes للتاكيد",
	"please enter file name": "يرجى كتابة اسم للملف",
	"please enter your pin": "يرجى ادخال رمز الدخول",
	"are you sure you want to delete this appointment?":
		"هل انت متاكد من حذف هذا الموعد",
	"orthodontic case will be deleted":
		"حالة المراجع التقويمية سيتم حذفها بجميع بياناتها",
	"all of the patient": "جميع ما يخص المريض",
	"'s data will be deleted along with": "من بيانات سيتم حذفها ومن ضمنها",
	"of appointments": "مواعيد",
	"are you sure you want to delete the prescription?":
		"هل انت متاكد من حذف الوصفة؟",
	"are you sure you want to delete": "هل انت متأكد من الحذف؟",
	"will be deleted": "سيتم حذفه",
	"this visit data will be deleted along with all photos and notes":
		"سيتم حذف الزيارة بكل بياناتها",

	/**========================================
	 * messages
	 */
	"invalid file": "ملف غير صالح",
	"invalid pin provided": "رمز دخول غير صالح",
	"restoration cancelled": "تم الغاء الاسترجاع",

	/**========================================
	 * buttons
	 */
	"load more": "حمل المزيد",
	"more options": "المزيد من الخيارات",
	"print prescription": "طباعة الوصفة",
	"time value": "قيمة الوقت",
	"add new": "اضافة جديد",
	"add visit": "اضافة زيارة",
	"book new appointment": "حجز موعد",
	"run compaction": "تقليص حجم البيانات",
	"download a backup": "تحميل نسخة احتياطية",
	"restore from file": "استرجاع من ملف",
	"overlay prev": "تراكب السابق",
	"overlay next": "تراكب اللاحق",
	grid: "عرض الشبكة",
	overlay: "تراكب",
	"access offline": "الوصول بدون اتصال",

	/**========================================
	 * inputs
	 */
	"type here": "اكتب هنا",
	search: "بحث",
	zoom: "تكبير",
	rotation: "تدوير",
	"register as new staff member": "تسجيل كـكادر جديد",
	"server location": "عنوان السيرفر",
	username: "اسم المستخدم",
	password: "كلمة السر",
	"please wait": "يرجى الانتظار",
	details: "التفاصيل",
	"units number": "عدد الوحدات",
	price: "السعر",
	paid: "تم دفع",
	overpaid: "زيادة دفع",
	outstanding: "متبقي",
	"patient concerns": "مقلقات المريض",
	"patient concern": "مشكلة المريض",
	"visit number": "رقم الزيارة",
	"visit date": "تاريخ الزيارة",
	appliance: "تفاصيل الجهاز",
	"no appliance info": "لا تفاصيل للجهاز",
	"no comment on this photo": "لا تعليقات على هذه الصورة",
	comment: "تعليق",
	"add note": "اضافة هامش",
	"history notes": "هوامش",
	name: "الاسم",
	"birth year / age": "العمر أو سنة الميلاد",
	gender: "الجنس",
	phone: "رقم الهاتف",
	email: "البريد الالكتروني",
	address: "العنوان",
	notes: "الهوامش",
	"item name": "اسم العنصر",
	"dosage in mg": "الجرعة بالملغرام",
	"times per day": "المرات لكل يوم",
	"units per time": "الوحدات لكل مرة",
	"item form": "صيغة الدواء",
	language: "اللغة",
	"date format": "صيغة التاريخ",
	"dropbox access token": "رمز الدروبوكس",
	"time expenses (per hour)": "تكلفة الوقت - لكل ساعة",
	"currency symbol": "رمز العملة",
	"backup frequency": "تكرارات النسخ الاحتياطي",
	"how many backups to retain": "عدد ملفات النسخ الاحتياطي",
	"phone number": "رقم الهاتف",
	"treatment title": "اسم الاستطباب",
	"treatment expenses (per unit)": "تكلفة الاستطباب لكل وحدة",
	"select treatment": "اختر الاستطباب",
	"select a date": "اختر التاريخ",
	"operating staff": "الكادر العامل",
	"no staff found": "لا يوجد كادر وفقًا لما ادخلته",
	"select involved teeth": "اختر الاسنان",
	"no teeth found": "لا يوجد اسنان وفقًا لما ادخلته",
	"select prescription": "اختر الوصفة",
	"no prescription found": "لا يوجد وصفة وفقًا لما ادخلته",
	"select patient": "اختر المريض",
	"no patient found": "لا يوجد مريض وفقًا لما ادخلته",
	"time (hours, minutes, seconds)": "الوقت (ساعة - دقيقة - ثانية)",
	prescription: "الوصفة",
	"involved teeth": "الاسنان المعالجة",
	"cross/scissors bite": "اطباق متصالب",
	"patient name": "اسم المريض",
	labels: "الوسوم",
	"days on duty": "ايام الدوام",
	"lips competency": "اطباق الشفاه",
	"facial profile": "تقويسة الوجه",
	"oral hygiene": "نظافة الفم والاسنان",
	"skeletal relationship": "العلاقة الجمجمية",
	"molars relationship": "العلاقة بين الاسنان الخلفية",
	"canine relationship": "العلاقة بين الانياب",
	class: "صنف",
	condition: "الوضع",
	"tooth condition": "وضع السن",
	"tooth history": "هوامش السن",
	"filter by staff member": "تصفية حسب الكادر",
	"nasio-labial angle": "زاوية بين الشفاه والانف",
	overjet: "بروز",
	overbite: "تراكب العضة",
	"space available": "المساحة المتوفرة",
	"space required": "المساحة المطلوبة",
	"week ends on": "ينتهي الاسبوع في اليوم",
	"on which day the week ends": "في أي يوم ينتهي الاسبوع؟",
	"create or choose patient": "اختر مريض او انشئ جديد",
	upload: "رفع",

	/**========================================
	 * dropdown options
	 */

	"competent lips": "علاقة شفهية متكاملة",
	"incompetent lips": "علاقة شفهية غير متكاملة",
	"potentially competent lips": "علاقة شفهية يمكن لها التكامل",
	"brachycephalic profile": "وجه مستعرض",
	"dolichocephalic profile": "وجه مطول",
	"mesocephalic profile": "وجهة ذو طول سائد",
	"good oral hygiene": "نظافة جيدة للفم",
	"bad oral hygiene": "نظافة سيئة للفم",
	"moderate oral hygiene": "نظافة معتدلة للفم",
	ampoule: "امبول",
	capsule: "كبسول",
	tablet: "حب",
	pill: "حب",
	gel: "جيل",
	lotion: "غسول",
	syrup: "شراب",
	powder: "باودر",
	mouthwash: "غسول فموي",
	suspension: "مستحضر",
	toothpaste: "معجون اسنان",
	daily: "يوميًا",
	weekly: "اسبوعيًا",
	monthly: "شهريًا",
	never: "أبدًا",

	/**========================================
	 * tooltips
	 */

	"flip horizontal": "قلب افقي",
	"flip vertical": "قلب عمودي",
	"rotate clockwise": "دوران مع عقارب الساعة",
	"rotate anti-clockwise": "دوران عكس عقارب الساعة",
	"sync with server": "مزامنة مع السيرفر",
	"server is unavailable": "السيرفر غير متوفر",
	"can't login to server": "لا يمكن الدخول للسيرفر",
	"user panel": "لوحة المستخدم",
	"patient details": "تفاصيل المريض",
	"dental history": "هوامش الاسنان",
	"orthodontic case sheet": "تفاصيل التقويم",
	"view grid": "عرض الشبكة",
	"add photo": "اضافة صورة",
	"delete visit": "حذف زيارة",
	restore: "استرجاع",
	"level and permission": "التفويضات والترخيصات",
	"staff member details": "معلومات الكادر",

	/**========================================
	 * dental history
	 */
	sound: "سليم",
	filled: "محشو",
	compromised: "منخور",
	endo: "محشو جذريًا",
	missing: "مفقود",
	rotated: "مستدار",
	displaced: "خارج الفك",
	"gum-recessed": "انحسار لثوي",

	/**========================================
	 * table headings
	 */

	"orthodontic patient": "المريض",
	dose: "الجرعة",
	frequency: "التكرار",
	form: "الصيغة",
	"staff member": "الكادر",
	"contact details": "معلومات الاتصال",
	profits: "الارباح",
	"expenses/unit": "التكاليف لكل وحدة",
	"done appointments": "المواعيد المنجزة",

	/**========================================
	 * units of measurement
	 */
	mg: "ملغ",
	mm: "ملم",
	degrees: "درجات",

	/**========================================
	 * calendar
	 */
	january: "يناير",
	february: "فبراير",
	march: "مارس",
	april: "ابريل",
	june: "يونيو",
	july: "يوليو",
	august: "اغسطس",
	september: "سبتمبر",
	october: "اوكتوبر",
	november: "نوفمر",
	december: "ديسمبر",
	sunday: "الاحد",
	monday: "الاثنين",
	tuesday: "الثلاثاء",
	wednesday: "الاربعاء",
	thursday: "الخميس",
	friday: "الجمعة",
	saturday: "السبت",
	su: "اح",
	mo: "اث",
	tu: "ثلا",
	we: "ار",
	th: "خم",
	fr: "جم",
	sa: "سب",
	jan: "ينا",
	feb: "فيب",
	mar: "مار",
	apr: "ابر",
	may: "ماي",
	jun: "يون",
	jul: "يول",
	aug: "اغس",
	sep: "سيب",
	oct: "اوك",
	nov: "نوف",
	dec: "ديس",

	/**========================================
	 * editing appointment
	 */
	"other appointment": "مواعيد اخرى",
	"enter tooth number": "ادخل رقم السن",
	"enter prescription": "ادخل الوصفة",
	"profit percentage": "نسبة الربح",
	unpaid: "غير مدفوع",

	/**========================================
	 * searching and filtering
	 */

	"out of": "من اصل",

	/**========================================
	 * settings
	 */
	backup: "نسخ احتياطي",
	actions: "عمليات",
	"settings are locked": "الاعدادات مغلقة",
	"to prevent unintentional changes, solve the mathematical equation to unlock":
		"لمنع التغييرات الغير مقصودة تم قفل الاعدادات، قم بحل المعادلة ادناه لفتحها",
	/**========================================
	 * other
	 */

	crowding: "تراكب",
	spacing: "فراغات",
	"appointments for": "مواعيد لـ",
	"no phone number": "لا رقم هاتف",
	"no email": "لا بريد الكتروني",
	"no next appointment": "لا مواعيد قادمة",
	"no last appointment": "لا مواعيد سابقة",
	"payments made": "دفوعات تمت",
	"outstanding amount": "مبلغ مدان",
	"overpaid amount": "دفوعات زائدة",
	"no outstanding amount": "لا مبلغ مدان",
	"started treatment": "بدأ العلاج",
	"has not started yet": "لم يبدأ العلاج بعد",
	"finished treatment": "انهى العلاج",
	"has not finished yet": "لم ينهي العلاج بعد",
	"upper arch crowding by": "تراكب الاسنان العلوية بـ",
	"lower arch crowding by": "تراكب الاسنان السفلية بـ",
	"upper arch spacing by": "فراغات الاسنان العلوية بـ",
	"lower arch spacing by": "فراغات الاسنان السفلية بـ",
	"target & expectations": "النتائج المرغوبة والتوقعات",
	"no target info": "لا نتائج ولا توقعات",

	/**========================================
	 * statistics page
	 */
	"applied times": "مرات التطبيق",
	"all staff members": "جميع الكادر",

	/**========================================
	 * treatments page
	 */
	"per unit": "لكل وحدة",

	/**========================================
	 * labworks pages
	 */
	labwork: "عمل مختبري",
	dates: "تواريخ",
	laboratory: "مختبر",
	"case title": "عنوان للحالة",
	lab: "مختبر",
	"lab details": "تفاصيل المختبر",
	"laboratory name": "اسم المختبر",
	"lab contact": "طريقة التواصل للمختبر",
	"no laboratory found": "لا يوجد مختبر طبقًا لما ادخلته",
	sent: "مرسل",
	"not sent": "غير مرسل",
	"sent date": "تاريخ الارسال",
	received: "مستلم",
	"not received": "غير مستلم",
	"received date": "تاريخ الاستلام",
};

export default ar;
