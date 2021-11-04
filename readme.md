# Vefforritun 1, 2021, verkefni 9

[Kynning í fyrirlestri](https://youtu.be/z-Z1u4FicgQ)

Verkefni 9 snýst um að tengjast RESTful vefþjónustu sem skilar JSON gögnum með fréttum af ruv.is.

Sækja skal gögnin og birta yfirlit með öllum gefnum flokkum ásamt möguleika á að sjá allar fréttir í hverjum flokk.

Þegar farið er á milli flokka skal _ekki_ nota „venjulega“ `<a href>` virkni, heldur skal yfirskrifa þá hegðun. Verkefnið verður því „[single-page application](https://en.wikipedia.org/wiki/Single-page_application)“.

## Vefþjónusta

[RÚV RSS API proxy](https://github.com/vefforritun/vef2-2021-ruv-rss-json-proxy) veitir aðgang að nýjustu fréttum frá RÚV. Vefþjónustan er sett upp á `https://vef2-2021-ruv-rss-json-proxy.herokuapp.com/`. Þessi vefþjónusta var áður notuð fyrir [React verkefni í vefforitun 2 árið 2021](https://github.com/vefforritun/vef2-2021-v5/).

Af handahófi er vefþjónustan lengi að skila niðurstöðum og/eða skilar villum. Gera skal ráð fyrir því með því að útfæra loading og error state fyrir vefþjónustuköll.

Þegar kallað er í rót vefþjónustu er fréttaflokkum skilað.

Þegar kallað er í `/<heiti á flokk>` er fréttum fyrir þann flokk skilað, t.d. `https://vef2-2021-ruv-rss-json-proxy.herokuapp.com/innlent`.

Sækja þarf þessi gögn með `fetch`. Gera þarf ráð fyrir að gögnin geti tekið langan tíma að berast og jafnvel skilað villu.

Þar sem útfæra skal vef sem SPA þá er óþarfi að sækja gögn oftar en einu sinni. Því skal „cachea“ gögn í minni eftir að þau eru sótt. Sjá skjölun í `./lib/news.js`.

## Single-page app (SPA)

Þegar farið er á milli forsíðu og flokka skal ekki sækja nýja síðu, heldur skal yfirskrifa virkni `<a href>` og nota [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) til að útfæra skiptingu á milli síða. Sérstaklega þarf að passa upp á að back takkinn virki með því að hlusta á [`popstate`](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate) atburðinn.

Forsíða (`/`) sýnir yfirlit. Fyrir hvern flokk skal nota querystring (hægt að sækja úr `window.location.search` og með `URLSearchParams`), t.d. `/?category=innlent`.

## eslint og prettier

Í verkefni er `eslint` og `prettier` uppsett með stillingum fyrir bæði. `eslint` stilling notar `airbnb` sem grunn en setur nokkrar sértækar reglur í `.eslintrc.js`.

Mælt er með að setja upp extension í ritli fyrir `eslint` og `prettier` til að nýta að fullu.

Hægt er að keyra `npm run prettier` til að láta `prettier` laga þær skrá sem hægt er.

Keyra skal `npm run lint` og skila án nokkurra villa.

Leyfilegt er að slökkva á ákveðnum villum _ef ástæða er til_ og skal tilltaka hana.

## Útlit

Gefið er útlit í CSS skrá fyrir útlit í `utlit/`. Leyfilegt er að útfæra sitt eigið svo lengi sem öll virkni er til staðar.

Einnig er myndband sem sýnir virkni, og hvernig eftir að fyrsta fyrirspurn hefur átt sér stað, aðeins fyrirspurnir á vefþjónustu eiga sér stað.

## Útfærsla

- Nota skal `JavaScript modules`.
- Gefinn er grunnur og jsdoc á föllum sem mælt er með að útfæra.
- Ekki er krafa að nota grunn, skrifa má sitt eigið frá grunni.
- Útfæra skal allt sem birtist, fyrir utan gefinn `<header>` og `<footer>` með JavaScript DOM aðgerðum. Ekki skal bæta við `index.html`.
- Þó svo að vefur eigi að vera SPA, þá á að vera hægt að opna beint á `/?category=FLOKKUR` og birta efni

## Mat

- 20% Snyrtilegur JavaScript kóði, engar eslint villur
- 20% Single-page app virkni útfærð
- 30% Gögn sótt frá vefþjónustu, loading state og error state til staðar, cache virkni útfærð
- 30% Allt viðmót smíðað með JavaScript DOM aðgerðum

## Sett fyrir

Verkefni sett fyrir í fyrirlestri mánudaginn 1. nóvember 2021.

## Skil

Skila skal í Canvas í seinasta lagi fyrir lok dags fimmtudaginn 11. nóvember 2021.

Skil skulu innihalda:

- Slóð á GitHub repo fyrir verkefni, og dæmatímakennurum skal hafa verið boðið í repo ([sjá leiðbeiningar](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-user-account/inviting-collaborators-to-a-personal-repository)). Notendanöfn þeirra eru:
  - `alli959`
  - `einarpalsson`
  - `HallurKrist`
  - `oscar6662`
  - `thth168`

## Einkunn

Sett verða fyrir tíu minni verkefni þar sem átta bestu gilda 5% hvert, samtals 40% af lokaeinkunn.

Sett verða fyrir tvö hópverkefni þar sem hvort um sig gildir 10%, samtals 20% af lokaeinkunn.
