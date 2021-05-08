/// <reference types="cypress" />
/// <reference types="../../cypress" />

describe("Labwork", () => {
	before(() => {
		cy.visit("http://localhost:8000");
		cy.clearCookies();
		cy.resetEverything();
		cy.reload();
		cy.wait(1000);
		cy.get(".no-server-mode").click();
		cy.getByTestId("new-user-name")
			.type("Alex")
			.type("{enter}");
		cy.ensureLoginType("no-server");
		cy.goToPage("settings");
		cy.solveMath();
		cy.getByTestId("labwork-toggle").click();
		cy.goToPage("labwork");
	});

	const labworks = ["ABC", "DEF", "XYZ", "MNO"];
	const labs = [
		{ name: "One", contact: "1234" },
		{ name: "Two", contact: "5678" }
	];

	describe("creating/viewing labworks", () => {
		it("creating labworks", () => {
			cy.goToPage("patients");
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("patient-name").type("Michael Scott");
			cy.closePanel();
			cy.goToPage("labwork");
			labworks.forEach((name, i) => {
				cy.get(`[title="Add new"]`).click();
				cy.getByTestId("lw-title")
					.clear()
					.type(name);
				cy.get(".lw-patient input")
					.clear()
					.type("Mi");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();

				let teethNum = i + 1;
				while (teethNum--) {
					cy.get(".lw-teeth input").type((teethNum + 1).toString());
					cy.get(".ms-Suggestions-item")
						.first()
						.click();
				}
				cy.get(".lw-staff input")
					.clear()
					.type("a");
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.clickTabByIcon("TestBeaker");
				const lab = i % 2 === 0 ? labs[0] : labs[1];
				cy.get(".lab-name input").type(lab.name);
				cy.get(".ms-Suggestions-item")
					.first()
					.click();
				cy.getByTestId("lab-contact")
					.clear()
					.type(lab.contact);
				cy.closePanel();
			});
		});
		it("viewing", () => {
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", labworks.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "1 units for Michael Scott");
			first.should("contain.text", "Alex");
			first.should("contain.text", "One");
		});
		it("clickable lab name", () => {
			cy.get(".label.clickable")
				.first()
				.click();
			cy.get(".data-table tbody tr").should("have.length", 2);
			cy.get(".label.clickable")
				.first()
				.should("have.class", "highlighted");
			cy.get(".label.clickable")
				.first()
				.click();
			cy.get(".data-table tbody tr").should(
				"have.length",
				labworks.length
			);
		});
		it("sorting", () => {
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", labworks.length);
			all.last().should("contain.text", "XYZ");
		});
		it("Editing", () => {
			const newTitle = "BB NEW TITLE";
			cy.get(".data-table tbody tr .clickable")
				.eq(2)
				.click();
			cy.getByTestId("lw-title")
				.clear()
				.type(newTitle);
			cy.closePanel();
			cy.get(".data-table tbody tr")
				.eq(1)
				.should("contain.text", newTitle);
		});
		it("Lab contact auto completion", () => {
			cy.get(".data-table tbody tr .clickable.no-label")
				.eq(1)
				.click();
			cy.clickTabByIcon("TestBeaker");
			cy.getByTestId("lab-contact").should("have.value", labs[1].contact);
			cy.get(".ms-TagItem .ms-TagItem-close").click();
			cy.getByTestId("lab-contact").should("have.value", "");
			cy.get(".lab-name input").type(labs[0].name);
			cy.get(".ms-Suggestions-item")
				.first()
				.click();
			cy.getByTestId("lab-contact").should("have.value", labs[0].contact);
			cy.closePanel();
		});
		it("Deleting from table", () => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("lw-title").type("000000");
			cy.closePanel();
			cy.get(".data-table tbody tr .delete-button")
				.eq(0)
				.click();
			cy.getByTestId("modal-confirm").click();
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", labworks.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "1 units for Michael Scott");
			first.should("contain.text", "Alex");
			first.should("contain.text", "One");
		});
		it("Deleting from panel", () => {
			cy.get(`[title="Add new"]`).click();
			cy.getByTestId("lw-title").type("000000");
			cy.closePanel();
			cy.get(".data-table tbody tr .clickable")
				.eq(0)
				.click();
			cy.clickTabByIcon("trash");
			cy.get("button.delete").click();
			const all = cy.get(".data-table tbody tr");
			all.should("have.length", labworks.length);
			const first = cy.get(".data-table tbody tr").first();
			first.should("contain.text", "1 units for Michael Scott");
			first.should("contain.text", "Alex");
			first.should("contain.text", "One");
		});
	});
});
