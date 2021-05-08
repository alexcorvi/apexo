$(function () {
	/*!
	 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
	 * Copyright 2011-2014 Twitter, Inc.
	 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
	 * details, see http://creativecommons.org/licenses/by/3.0/.
	 */
	!(function (a) {
		a(function () {
			if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
				var b = document.createElement("style");
				b.appendChild(
					document.createTextNode(
						"@-ms-viewport{width:auto!important}"
					)
				),
					document.querySelector("head").appendChild(b);
			}
			{
				var c = a(window),
					d = a(document.body);
				a(".navbar").outerHeight(!0) + 10;
			}
			d.scrollspy({ target: ".bs-docs-sidebar" }),
				c.on("load", function () {
					d.scrollspy("refresh");
				}),
				a(".bs-docs-container [href=#]").click(function (a) {
					a.preventDefault();
				}),
				setTimeout(function () {
					var b = a(".bs-docs-sidebar");
					b.affix({
						offset: {
							top: function () {
								var c = b.offset().top,
									d = parseInt(
										b.children(0).css("margin-top"),
										10
									),
									e = a(".bs-docs-nav").height();
								return (this.top = c - e - d);
							},
							bottom: function () {
								return (this.bottom = a(
									".bs-docs-footer"
								).outerHeight(!0));
							},
						},
					});
				}, 100),
				setTimeout(function () {
					a(".bs-top").affix();
				}, 100);
		});
	})(jQuery);
});

function trianglify(color1, color2, seed) {
	var header = $("#content");
	var pattern = Trianglify({
		width: window.screen.width | header.outerWidth(),
		height: header.outerHeight(),
		cell_size: 90,
		seed: seed,
		x_colors: [color1, color2],
	});

	header.css("background-image", "url(" + pattern.png() + ")");
}

async function fetchMD(relativePath, linesToDelete) {
	return (await (await fetch(relativePath)).text())
		.split(/\n/)
		.filter((x, i) => i >= linesToDelete)
		.join("\n");
}

async function placeMDContent(relativePath, linesToDelete, elementID) {
	let content = await fetchMD(relativePath, linesToDelete);
	document.getElementById(elementID).innerHTML = marked(content);
}

async function loadContent() {
	await placeMDContent("./docs/00-intro.md", 1, "intro-content");
	await placeMDContent("./docs/01-front.md", 1, "front-content");
	await placeMDContent("./docs/02-server.md", 1, "server-content");
	await placeMDContent("./docs/03-dropbox.md", 1, "dropbox-content");
	await placeMDContent("./docs/04-translation.md", 1, "translation-content");
	await placeMDContent("./CHANGELOG.md", 1, "changelog-content");
	await placeMDContent("./CONTRIBUTING.md", 1, "contributing-content");
	await placeMDContent("./CODE_OF_CONDUCT.md", 1, "code-of-conduct-content");

	var html = "";

	$(".bs-docs-section").each(function () {
		var h1 = $(this).find("h1[id]").first(),
			h23 = $(this).find("h2[id], h3[id]:not([data-no-menu])");

		if (h1.length) {
			html +=
				'<li><a href="#' +
				h1[0].id +
				'">' +
				h1.clone().children().remove().end().text() +
				"</a>";

			if (h23.length) {
				html += '<ul class="nav">';
				h23.each(function () {
					html +=
						'<li><a href="#' +
						this.id +
						'">' +
						$(this).clone().children().remove().end().text() +
						"</a></li>";
				});
				html += "</ul>";
			}

			html += "</li>";
		}
	});

	if (html == "") {
		$("[role=complementary]").hide();
		$("[role=main]").toggleClass("col-md-9 col-md-12");
	} else {
		$(".bs-docs-sidenav").html(html);
	}

	// add heading anchors
	$("h1[id], h2[id], h3[id], h4[id], h5[id]").each(function () {
		$(this).prepend('<a href="#' + this.id + '" class="anchor-link">§</i>');
	});

	// enable bootbox
	$("[data-bootbox]").on("click", function () {
		var $target = $("#" + $(this).data("bootbox"));
		bootbox.alert({
			title: $target.attr("title"),
			message: $target.html(),
			size: $(this).data("bootbox-size"),
		});
	});
}

loadContent();
