/** Slóð á frétta vefþjónustu */
const NEWS_API = "https://vef2-2021-ruv-rss-json-proxy.herokuapp.com/";

/**
 * Hlutur sem heldur utan um in-memory „cache“ af gögnum í minni á client (í vafra).
 * Nýtir það að þegar forrit er keyrt mun `fetchNews` fallið *alltaf* keyra þar sem `cache` er í
 * scope, og það verður alltaf sami hluturinn. Við getum því bætt við niðurstöðum í hlutinn með
 * vel þekktum „lykli“ (cache key), við næstu köll getum við athugað hvort hlutur innihaldi þennan
 * lykil og skilað þá þeirri niðurstöðu í stað þess að gera sama kall aftur.
 */
const cache = {};

/**
 * Sækir fréttir frá vefþjónustu. Geymir í in-memory cache gögn eftir `id`.
 * @param {string} [id=''] ID á fréttaflokk til að sækja, sjálgefið tómi (grunn) flokkurinn
 * @returns {Promise<Array<object> | null>} Promise sem verður uppfyllt með fylki af fréttum.
 *           Skilar `null` ef villa kom upp við að sækja gögn.
 */
export async function fetchNews(id = "") {
	const cahcheKey = id || "index";
	if (cahcheKey in cache) {
		return cache[cahcheKey];
	}

	try {
		const url = new URL(id, NEWS_API);
		let data = await fetch(url);
		if (data.status >= 400) {
			// retry once
			data = await fetch(url);
			if (data.status >= 400) {
				return null;
			}
		}
		// let data = await fetch(new URL(`${id}/?error=1`, NEWS_API));
		data = data.json();
		cache[cahcheKey] = data;
		return data;
	} catch (e) {
		console.error(e);
		return null;
	}
}
