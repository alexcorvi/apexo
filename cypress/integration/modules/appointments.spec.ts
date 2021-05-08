/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("Appointments", () => {
	describe("Appointment editor", () => {
		const patients = ["PA", "PB"];
		const treatments = ["TA", "TB"];
		before(() => {
			cy.visit("http://localhost:8000");
			cy.clearCookies();
			cy.resetEverything();
			cy.reload();
			cy.wait(1000);
			cy.get(".no-server-mode").click();
			cy.getByTestId("new-user-name")
				.type("SA")
				.type("{enter}");
			cy.ensureLoginType("no-server");
			cy.goToPage("settings");
			cy.solveMath();
			cy.getByTestId("time-tracking-toggle").click();
			cy.goToPage("patients");
			patients.forEach(patientName => {
				cy.get(`[title="Add new"]`).click();
				cy.getByTestId("patient-name").type(patientName);
				cy.closePanel();
			});
			cy.goToPage("treatments");
			treatments.forEach(treatmentName => {
				cy.get(`[title="Add new"]`).click();
				cy.getByTestId("treatment-title").type(treatmentName);
				cy.closePanel();
			});
			cy.goToPage("staff");
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("staff-name").type("SB");
			cy.closePanel();
			cy.goToPage("patients");
		});
		describe("Appointment editor", () => {
			it("setting date/time", () => {
				cy.get(".action-button.appointments")
					.first()
					.click();
				cy.chooseFromDropdown("new-appointment", 1);
				cy.pickDate("appointment-date", "tomorrow");
				cy.chooseFromDropdown("ae-hr", "05");
				cy.chooseFromDropdown("ae-mn", "30");
				cy.chooseFromDropdown("ae-am", "pm");
				cy.closePanel();
				cy.chooseFromDropdown("new-appointment", 2);
				cy.pickDate("appointment-date", "next-month");
				cy.chooseFromDropdown("ae-hr", "01");
				cy.chooseFromDropdown("ae-mn", "00");
				cy.chooseFromDropdown("ae-am", "am");
				cy.closePanel();
				const aptA = cy.get(".hat-time").first();
				aptA.should("contain.text", "Tomorrow");
				aptA.should("contain.text", "5:30");
				aptA.should("contain.text", "PM");
				const aptB = cy.get(".hat-time").eq(1);
				aptB.should("contain.text", "1 ");
				aptB.should("contain.text", "1:00");
				aptB.should("contain.text", "AM");
			});
			it("setting operating staff", () => {
				cy.get(".hat-time")
					.eq(0)
					.click();
				cy.get(".operating-staff input").type("SA");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.closePanel();
				cy.get(".hat-time")
					.eq(1)
					.click();
				cy.get(".operating-staff input").type("SB");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.closePanel();
				cy.get(".appointments-list .profile-squared")
					.eq(0)
					.should("contain.text", "SA");
				cy.get(".appointments-list .profile-squared")
					.eq(1)
					.should("contain.text", "SB");
			});
			it("setting case details", () => {
				cy.get(".appointment-body .ms-Persona .ms-Persona-primaryText")
					.eq(0)
					.should("have.text", "TA");
				cy.get(
					".appointment-body .ms-Persona .ms-Persona-secondaryText"
				)
					.eq(0)
					.should("have.text", "SA");
				cy.get(".appointment-body .ms-Persona .ms-Persona-primaryText")
					.eq(1)
					.should("have.text", "TB");
				cy.get(
					".appointment-body .ms-Persona .ms-Persona-secondaryText"
				)
					.eq(1)
					.should("have.text", "SB");
				cy.get(".hat-time")
					.eq(0)
					.click();
				cy.clickTabByIcon("Cricket");
				cy.getByTestId("case-details").type("AAAAAAA");

				cy.chooseFromDropdown("treatment-type", "TB");
				cy.getByTestId("units-num")
					.clear()
					.type("2");
				cy.get(".involved-teeth input").type("12");
				cy.get(".ms-Suggestions-item")
					.eq(0)
					.click();
				cy.get(".involved-teeth input").type("11");
				cy.get(".ms-Suggestions-item")
					.eq(0)
					.click();
				cy.closePanel();
				cy.get(".hat-time")
					.eq(1)
					.click();
				cy.clickTabByIcon("Cricket");
				cy.getByTestId("case-details").type("BBBBBBB");
				cy.chooseFromDropdown("treatment-type", "TA");
				cy.getByTestId("units-num")
					.clear()
					.type("1");
				cy.get(".involved-teeth input").type("22");
				cy.get(".ms-Suggestions-item")
					.eq(0)
					.click();
				cy.get(".involved-teeth input").type("21");
				cy.get(".ms-Suggestions-item")
					.eq(0)
					.click();
				cy.closePanel();
				cy.get(".appointment-body .ms-Persona .ms-Persona-primaryText")
					.eq(0)
					.should("have.text", "TB");
				cy.get(
					".appointment-body .ms-Persona .ms-Persona-secondaryText"
				)
					.eq(0)
					.should("have.text", "SA");
				cy.get(".appointment-body .ms-Persona .ms-Persona-primaryText")
					.eq(1)
					.should("have.text", "TA");
				cy.get(
					".appointment-body .ms-Persona .ms-Persona-secondaryText"
				)
					.eq(1)
					.should("have.text", "SB");

				cy.clickItem("SA");
				cy.clickTabByIcon("Cricket");
				cy.getInputByLabel("Details", "textarea").should(
					"have.value",
					"AAAAAAA"
				);
				cy.get(".involved-teeth .ms-TagItem")
					.eq(0)
					.should("contain.text", "11");
				cy.get(".involved-teeth .ms-TagItem")
					.eq(1)
					.should("contain.text", "12");
				cy.closePanel();
				cy.clickItem("SB");
				cy.clickTabByIcon("Cricket");
				cy.getInputByLabel("Details", "textarea").should(
					"have.value",
					"BBBBBBB"
				);
				cy.get(".involved-teeth .ms-TagItem")
					.eq(0)
					.should("contain.text", "21");
				cy.get(".involved-teeth .ms-TagItem")
					.eq(1)
					.should("contain.text", "22");
				cy.closePanel();
			});
			it("time tracking, clicking the start button", () => {
				cy.get(".hat-time")
					.eq(0)
					.click();
				cy.clickTabByIcon("AllCurrency");
				cy.get(".appointment-editor .appendage").click();
				cy.wait(1000);
				cy.get(".appointment-editor .appendage").click();
				cy.getInputByLabel("Expenses + Time value").should(
					"have.value",
					"0.01"
				);
			});
			it("time tracking, manually", () => {
				cy.get(".time-input.hours input")
					.clear()
					.type("1");
				cy.getInputByLabel("Expenses + Time value").should(
					"have.value",
					"5000"
				);
				cy.get(".time-input.hours input").clear();
			});
			it("expenses/price/paid/outstanding/profit", () => {
				cy.closePanel();
				cy.closePanel();
				cy.goToPage("treatments");
				cy.clickItem("TA");
				cy.getByTestId("treatment-expenses").type("1");
				cy.closePanel();
				cy.clickItem("TB");
				cy.getByTestId("treatment-expenses").type("2");
				cy.closePanel();
				cy.goToPage("patients");
				cy.clickItem("PA");
				cy.clickTabByIcon("Calendar");
				// first item
				cy.clickItem("TA");
				cy.clickTabByIcon("AllCurrency");
				cy.getInputByLabel("Expenses + Time value").should(
					"have.value",
					"10"
				);
				cy.getInputByLabel("Profit").should("have.value", "-10");
				cy.getInputByLabel("Price").type("20");
				cy.getInputByLabel("Paid").type("15");
				cy.getInputByLabel("Outstanding").should("have.value", "0");
				cy.getInputByLabel("Profit").should("have.value", "10");
				cy.closePanel();
				// second item
				cy.clickItem("SA");
				cy.pickDate("appointment-date", "yesterday");
				cy.getByTestId("is-done").click();
				cy.clickTabByIcon("AllCurrency");
				cy.getInputByLabel("Expenses + Time value").should(
					"have.value",
					"40"
				);
				cy.getInputByLabel("Profit").should("have.value", "-40");
				cy.getInputByLabel("Price").type("100");
				cy.getInputByLabel("Paid").type("80");
				cy.getInputByLabel("Outstanding").should("have.value", "20");
				cy.getInputByLabel("Profit").should("have.value", "60");
			});
			it("overpayment", () => {
				cy.getInputByLabel("Paid")
					.clear()
					.type("20");
				cy.getInputByLabel("Overpaid").should("have.value", "100");
				cy.closePanel();
			});
		});

		describe("Viewing appointment editor", () => {
			it("hinting number of other appointments", () => {
				cy.clickItem("SA");
				cy.get(".appointment-input.date .insight").should(
					"contain.text",
					"With 0 other"
				);
				cy.closePanel();
				cy.chooseFromDropdown("new-appointment", 1);
				cy.pickDate("appointment-date", "yesterday");
				cy.get(".appointment-input.date .insight").should(
					"contain.text",
					"With 1 other"
				);
				cy.closePanel();
				cy.chooseFromDropdown("new-appointment", 1);
				cy.pickDate("appointment-date", "yesterday");
				cy.get(".appointment-input.date .insight").should(
					"contain.text",
					"With 2 other"
				);
				cy.closePanel();
				cy.chooseFromDropdown("new-appointment", 1);
				cy.pickDate("appointment-date", "yesterday");
				cy.get(".appointment-input.date .insight").should(
					"contain.text",
					"With 3 other"
				);
				cy.clickTabByIcon("trash");
				cy.get(".appointment-editor .delete").click();
				cy.wait(500);
				cy.clickItem("SA");
				cy.get(".appointment-input.date .insight").should(
					"contain.text",
					"With 2 other"
				);
				cy.closePanel();
			});
			it("Disabling 'done' when appointment in the future", () => {
				cy.clickItem("SB");
				cy.get(".ms-Toggle").should("have.class", "is-disabled");
				cy.pickDate("appointment-date", "past-month");
				cy.get(".ms-Toggle").should("not.have.class", "is-disabled");
			});
			it("Error message when staff out ot his days", () => {
				cy.pickDate("appointment-date", "today");
				cy.get(".error-message").should(
					"contain.text",
					"SB might not be available"
				);
				cy.get(".error-message").should(
					"not.contain.text",
					"SA might not be available"
				);
				cy.get(".operating-staff input").type("SA");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.get(".error-message").should(
					"contain.text",
					"SA might not be available"
				);
				cy.closePanel();
				cy.closePanel();
				cy.goToPage("staff");
				cy.clickItem("SA");
				cy.get(".ms-Checkbox-label")
					.contains(
						new Date()
							.toDateString()
							.split(" ")[0]
							.substr(0, 2)
							.toUpperCase()
					)
					.click();
				cy.closePanel();
				cy.clickItem("SB");

				cy.get(".ms-Checkbox-label")
					.contains(
						new Date()
							.toDateString()
							.split(" ")[0]
							.substr(0, 2)
							.toUpperCase()
					)
					.click();
				cy.closePanel();
				cy.goToPage("patients");
				cy.clickItem("PA");
				cy.clickTabByIcon("Calendar");
				cy.clickItem("SA, SB");
				cy.get(".error-message").should("not.be.visible");
				cy.pickDate("appointment-date", "tomorrow");
				cy.get(".error-message").should(
					"contain.text",
					"SB might not be available"
				);
				cy.get(".error-message").should(
					"contain.text",
					"SA might not be available"
				);
			});
			it("Should not warn when the appointment is done or missed", () => {
				cy.pickDate("appointment-date", "yesterday");
				cy.get(".error-message").should("not.be.visible");
				cy.getByTestId("is-done").click();
				cy.pickDate("appointment-date", "tomorrow");
				cy.get(".error-message").should("not.be.visible");
				cy.getByTestId("is-done").click();
				cy.get(".error-message").should(
					"contain.text",
					"SB might not be available"
				);
				cy.get(".error-message").should(
					"contain.text",
					"SA might not be available"
				);
			});
			it("Flipping between outstanding and overpaid", () => {
				cy.clickTabByIcon("AllCurrency");
				cy.getInputByLabel("Outstanding").should("be.visible");
				cy.getInputByLabel("Paid")
					.clear()
					.type("100");
				cy.getInputByLabel("Overpaid").should("be.visible");
			});
			it("Outstanding is zero when the appointment is not done", () => {
				cy.getInputByLabel("Price")
					.clear()
					.type("1");
				cy.getInputByLabel("Paid")
					.clear()
					.type("0");
				cy.getInputByLabel("Outstanding").should("have.value", "0");
				cy.closePanel();
				cy.clickItem("SA, SB");
				cy.pickDate("appointment-date", "yesterday");
				cy.getByTestId("is-done").click();
				cy.clickTabByIcon("AllCurrency");
				cy.getInputByLabel("Outstanding").should("have.value", "10");
			});
			it("Error message when there's outstanding amount", () => {
				cy.getInputByLabel("Price")
					.clear()
					.type("1");
				cy.getInputByLabel("Paid")
					.clear()
					.type("0");
				cy.get(".ms-TextField-errorMessage")
					.contains("outstanding amount")
					.should("be.visible");
			});
			it("Error message when the profit is too low", () => {
				cy.getInputByLabel("Price")
					.clear()
					.type("0");
				cy.get(".ms-TextField-errorMessage")
					.contains("price is too low")
					.should("be.visible");
			});
			it("Error message when there's overpaid amount", () => {
				cy.getInputByLabel("Paid")
					.clear()
					.type("10");
				cy.get(".ms-TextField-errorMessage")
					.contains("overpaid amount")
					.should("be.visible");
				cy.closePanel();
			});
		});

		describe("Deleting appointments", () => {
			it("from appointment editor", () => {
				cy.clickItem("SA, SB");
				cy.clickTabByIcon("trash");
				cy.get(".appointment-editor .delete").click();
				cy.get(".hat-time").should("have.length", 3);
			});
			it("from appointment listing", () => {
				cy.get(".cl-section .delete")
					.eq(0)
					.click();
				cy.clickBtn("Confirm");
				cy.clickItem("PA");
				cy.clickTabByIcon("Calendar");
				cy.get(".hat-time").should("have.length", 2);

				cy.get(".cl-section .delete")
					.eq(0)
					.click();
				cy.clickBtn("Confirm");
				cy.clickItem("PA");
				cy.clickTabByIcon("Calendar");
				cy.get(".hat-time").should("have.length", 1);

				cy.get(".cl-section .delete")
					.eq(0)
					.click();
				cy.clickBtn("Confirm");
			});
		});
	});

	describe.only("on tables", () => {
		const patients = ["PA"];
		const treatments = ["TA", "TB", "TC", "TD"];
		before(() => {
			cy.visit("http://localhost:8000");
			cy.clearCookies();
			cy.resetEverything();
			cy.reload();
			cy.wait(1000);
			cy.get(".no-server-mode").click();
			cy.getByTestId("new-user-name")
				.type("SA")
				.type("{enter}");
			cy.ensureLoginType("no-server");
			cy.goToPage("settings");
			cy.solveMath();
			cy.getByTestId("ortho-toggle").click();
			cy.goToPage("patients");
			patients.forEach(patientName => {
				cy.get(`[title="Add new"]`).click();
				cy.getByTestId("patient-name").type(patientName);
				cy.closePanel();
			});
			cy.goToPage("treatments");
			treatments.forEach(treatmentName => {
				cy.get(`[title="Add new"]`).click();
				cy.getByTestId("treatment-title").type(treatmentName);
				cy.closePanel();
			});
			cy.goToPage("patients");
			cy.clickItem("PA");
			cy.clickTabByIcon("Calendar");

			// an appointment that is past .. but not done
			cy.chooseFromDropdown("new-appointment", "TA");
			cy.pickDate("appointment-date", "past-month");
			cy.getByTestId("is-done").click();
			cy.closePanel();

			// an appointment that is past and done
			cy.chooseFromDropdown("new-appointment", "TB");
			cy.pickDate("appointment-date", "yesterday");
			cy.closePanel();

			// an appointment that is next month and not done
			cy.chooseFromDropdown("new-appointment", "TD");
			cy.pickDate("appointment-date", "next-month");
			cy.closePanel();
			cy.closePanel();
		});

		describe("last/next appointment", () => {
			it("patients page", () => {
				cy.get(".last-next-appointment .profile-squared")
					.eq(0)
					.should("contain.text", "TB");
				cy.get(".last-next-appointment .profile-squared")
					.eq(1)
					.should("contain.text", "TD");
			});
			it("orthodontics page", () => {
				cy.goToPage("orthodontic");
				cy.get(`[title="Add new"]`).click();
				cy.get(".choose-patient input").type("PA");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.closePanel();
				cy.get(".last-next-appointment .profile-squared")
					.eq(0)
					.should("contain.text", "TB");
				cy.get(".last-next-appointment .profile-squared")
					.eq(1)
					.should("contain.text", "TD");
			});
			it("when there's no last/next appointment", () => {
				cy.goToPage("patients");
				cy.clickItem("PA");
				cy.clickTabByIcon("Calendar");
				cy.get(".hat-time")
					.eq(0)
					.click();
				cy.clickTabByIcon("trash");
				cy.get(".appointment-editor .delete").click();
				cy.get(".hat-time")
					.eq(0)
					.click();
				cy.clickTabByIcon("trash");
				cy.get(".appointment-editor .delete").click();
				cy.closePanel();
				cy.get(".last-next-appointment .profile-squared")
					.eq(0)
					.should("contain.text", "No last appointment");
				cy.get(".last-next-appointment .profile-squared")
					.contains("TD")
					.click();
				cy.clickTabByIcon("trash");
				cy.get(".appointment-editor .delete").click();
				cy.get(".last-next-appointment .profile-squared")
					.eq(1)
					.should("contain.text", "No next appointment");
				cy.goToPage("orthodontic");
				cy.get(".last-next-appointment .profile-squared")
					.eq(0)
					.should("contain.text", "No last appointment");
				cy.get(".last-next-appointment .profile-squared")
					.eq(1)
					.should("contain.text", "No next appointment");
			});
			it("staff page", () => {
				cy.goToPage("patients");
				cy.clickItem("PA");
				cy.clickTabByIcon("Calendar");

				// an appointment that is past .. not done
				cy.chooseFromDropdown("new-appointment", "TA");
				cy.pickDate("appointment-date", "past-month");
				cy.get(".operating-staff input").type("SA");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.closePanel();

				// an appointment that is past .. done
				cy.chooseFromDropdown("new-appointment", "TB");
				cy.pickDate("appointment-date", "yesterday");
				cy.getByTestId("is-done").click();
				cy.get(".operating-staff input").type("SA");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.closePanel();

				// an appointment that is next month and not done
				cy.chooseFromDropdown("new-appointment", "TD");
				cy.pickDate("appointment-date", "next-month");
				cy.get(".operating-staff input").type("SA");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.closePanel();
				cy.closePanel();

				cy.goToPage("staff");

				cy.get(".last-next-appointment .profile-squared")
					.eq(0)
					.should("contain.text", "TB");
				cy.get(".last-next-appointment .profile-squared")
					.eq(1)
					.should("contain.text", "TD");
				cy.get(".last-next-appointment .profile-squared")
					.eq(0)
					.click();
				cy.clickTabByIcon("trash");
				cy.get(".appointment-editor .delete").click();
				cy.get(".last-next-appointment .profile-squared")
					.eq(0)
					.should("contain.text", "Missed: ");
			});
		});

		describe("total/outstanding payments", () => {
			before(() => {
				cy.goToPage("patients");
			});
			it("patients page", () => {});
			it("orthodontics page");
		});
	});

	describe("calendar page", () => {
		describe("correct listing", () => {
			it("previous two years, next two years");
			it("months");
			it("days and weekends");
			it("weekend line");
			it("non-duty days being light");
			it("random checking");
		});
		describe("selecting", () => {
			it("selecting year");
			it("selecting month");
			it("selecting day/week");
		});
		describe("Filtering appointments", () => {
			it("textual filtering");
			it("my appointments only");
		});
		describe("Listing appointments in day col", () => {
			it("showing time");
			it("showing done");
			it("showing missed");
			it("showing showing treatment");
			it("showing patient name");
			it("showing staff name");
			it("clicking patient");
		});
	});
});
