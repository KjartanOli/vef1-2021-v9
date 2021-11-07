// föllin í þessari skrá hafa circular dependencies
/* eslint-disable no-use-before-define */
import { fetchNews } from "./news.js";
import { el, empty } from "./helpers.js";
/**
 * Föll sem sjá um að kalla í `fetchNews` og birta viðmót:
 * - Loading state meðan gögn eru sótt
 * - Villu state ef villa kemur upp við að sækja gögn
 * - Birta gögnin ef allt OK
 * Fyrir gögnin eru líka búnir til takkar sem leyfa að fara milli forsíðu og
 * flokks *án þess* að nota sjálfgefna <a href> virkni—við tökum yfir og sjáum
 * um sjálf með History API.
 */

async function renderCategory(container, data, link, limit = Infinity) {
	const title = el("h1", data.title);
	title.classList.add("news__title");
	container.appendChild(title);

	const list = el("li");
	list.classList.add("news__list");
	// Ef einhver vill rífast við mig um að ++i sé ekki í lagi í for lykkju skal ég rífast við hann/hana eins lengi og þau vilja
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < limit && i < data.items.length; ++i) {
		const item = data.items[i];
		const a = el("a", item.title);
		a.setAttribute("href", item.link);
		const listItem = el("li", a);
		listItem.classList.add("news__item");
		list.appendChild(listItem);
	}

	container.appendChild(list);
	container.appendChild(link);
}

/**
 * Útbýr takka sem sýnir tiltekinn frétta flokk
 * @param {string} id ID flokksins sem á að fara á
 * @returns {HTMLElement} Element með takka sem fer á frétta flokk
 */
function createCategoryLink(id, container, newsItemLimit) {
	const link = el("a", "Allar fréttir");
	link.setAttribute("href", `/?category=${id}`);
	link.classList.add("news__link");
	link.addEventListener(
		"click",
		handleCategoryClick(
			id,
			container,
			createCategoryBackLink(container, newsItemLimit),
			newsItemLimit
		)
	);

	return el("p", link);
}

/**
 * Sækir gögn fyrir flokk og birtir í DOM.
 * @param {string} id ID á category sem við erum að sækja
 * @param {HTMLElement} parent Element sem setja á flokkinn í
 * @param {HTMLELement | null} [link=null] Linkur sem á að setja eftir fréttum
 * @param {number} [limit=Infinity] Hámarks fjöldi frétta til að sýna
 */
export async function fetchAndRenderCategory(
	id,
	parent,
	link = null,
	limit = Infinity
) {
	const section = el("section", el("p", "Sæki gögn…"));
	section.classList.add("news");
	parent.appendChild(section);
	fetchNews(id)
		.then((data) => {
			empty(section);
			if (!data) {
				section.appendChild(el("p", "Villa kom upp"));
				return;
			}
			renderCategory(section, data, link, limit);
		})
		.catch(() => {
			empty(parent);
			parent.appendChild(el("p", "Villa kom upp"));
		});
}

/**
 * Sækir grunnlista af fréttum, síðan hvern flokk fyrir sig og birtir nýjustu
 * N fréttir úr þeim flokk með `fetchAndRenderCategory()`
 * @param {HTMLElement} container Element sem mun innihalda allar fréttir
 * @param {number} newsItemLimit Hámark fjöldi frétta sem á að birta í yfirliti
 */
export async function fetchAndRenderLists(container, newsItemLimit) {
	// Byrjum á að birta loading skilaboð
	container.appendChild(el("p", "Sæki lista af fréttum…"));
	// Birtum þau beint á container
	// Sækjum yfirlit með öllum flokkum, hér þarf að hugsa um Promises!
	fetchNews()
		.then((data) => {
			empty(container);
			for (const item of data) {
				const link = el("a", "Allar fréttir");
				link.setAttribute("href", `/?category=${item.id}`);
				fetchAndRenderCategory(
					item.id,
					container,
					createCategoryLink(item.id, container, newsItemLimit),
					newsItemLimit
				);
			}
		})
		.catch(() => {
			empty(container);
			container.appendChild(el("p", "Villa kom upp"));
		});
}

/**
 * Eins og `handleCategoryClick`, nema býr til link sem fer á forsíðu.
 *
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {function} Fall sem bundið er við click event á link/takka
 */
export function handleBackClick(container, newsItemLimit) {
	return (e) => {
		e.preventDefault();

		window.history.replaceState(null, null, "/");
		empty(container);
		fetchAndRenderLists(container, newsItemLimit);
	};
}

/**
 * Útbýr takka sem fer á forsíðu.
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {HTMLElement} Element með takka sem fer á forsíðu
 */
export function createCategoryBackLink(container, newsItemLimit) {
	const link = el("a", "Til baka");
	link.classList.add("news__link");
	link.addEventListener("click", handleBackClick(container, newsItemLimit));

	return el("p", link);
}

/**
 * Sér um smell á flokk og birtir flokkinn *á sömu síðu* og við erum á.
 * Þarf að:
 * - Stoppa sjálfgefna hegðun <a href>
 * - Tæma `container` þ.a. ekki sé verið að setja efni ofan í annað efni
 * - Útbúa link sem fer til baka frá flokk á forsíðu, þess vegna þarf `newsItemLimit`
 * - Sækja og birta flokk
 * - Bæta við færslu í `history` þ.a. back takki virki
 *
 * Notum lokun þ.a. við getum útbúið föll fyrir alla flokka með einu falli. Notkun:
 * ```
 * link.addEventListener('click', handleCategoryClick(categoryId, container, newsItemLimit));
 * ```
 *
 * @param {string} id ID á flokk sem birta á eftir að smellt er
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {function} Fall sem bundið er við click event á link/takka
 */
function handleCategoryClick(id, container, newsItemLimit) {
	return (e) => {
		e.preventDefault();

		window.history.pushState(null, null, `?category=${id}`);
		empty(container);
		fetchAndRenderCategory(id, container, newsItemLimit);
	};
}
