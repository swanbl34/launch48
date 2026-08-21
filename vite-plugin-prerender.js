/**
 * Plugin Vite — pré-rendu des pages verticales
 *
 * PROBLÈME RÉSOLU
 * `/offres/` et les 8 pages sectorielles ne contenaient qu'un `<div id="app">`
 * vide : 69 à 105 octets de `<body>`, aucun `<h1>`, titre et description posés
 * par JavaScript après chargement. Ce sont précisément les pages faites pour
 * capter la recherche par métier. Un robot qui n'exécute pas JavaScript n'y
 * voyait rien, et un visiteur voyait un écran vide le temps du bundle.
 *
 * COMMENT
 * Au build, on lit `data-page` et `data-offer-slug` sur le `<body>`, on appelle
 * `renderPage()` — les mêmes gabarits que le navigateur, via un module pur — et
 * on écrit le résultat dans le fichier : contenu dans `#app`, titre et
 * description dans le `<head>`.
 *
 * `offers-data.js` reste l'unique source de vérité. Il n'y a pas de HTML
 * dupliqué à tenir à jour, donc pas de dérive possible entre le document servi
 * et ce que le navigateur aurait produit.
 *
 * EN DÉVELOPPEMENT
 * Le hook ne tourne qu'au build (`apply: 'build'`). En `vite dev`, les pages
 * restent rendues par le navigateur — c'est le chemin de repli que
 * `verticales.js` conserve, et ça évite de re-rendre à chaque rechargement à
 * chaud. Pour voir le résultat pré-rendu : `npm run build && npx vite preview`.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Origine utilisée pour `og:url`, que le navigateur déduisait de location.href. */
const ORIGIN = 'https://launch48.fr';

/** Échappe ce qui part dans un attribut HTML. */
const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Échappe ce qui part dans du texte (le contenu de <title>). */
const escapeText = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Amorce des apparitions au scroll, à poser dans le `<head>`.
 *
 * La règle `.js [data-reveal]` du socle masque les blocs avant leur apparition.
 * Avant le pré-rendu, `verticales.js` posait la classe `js` juste avant
 * d'injecter le contenu : rien n'était encore affiché, donc aucun risque.
 *
 * Maintenant que le contenu est dans le fichier, la poser depuis le module —
 * qui s'exécute après l'analyse du document — afficherait la page puis la
 * masquerait : un clignotement. Il faut donc la poser de façon synchrone, avant
 * la première peinture. C'est exactement le motif déjà utilisé par la home.
 *
 * Le garde-fou compte autant que la classe : si le module ne démarre jamais
 * (erreur JS, réseau coupé, bundle bloqué), la classe est retirée et tout
 * redevient visible. Une page pré-rendue ne doit jamais rester masquée par une
 * animation qui n'arrivera pas.
 */
const REVEAL_BOOTSTRAP = `    <script>
      // Injecté par vite-plugin-prerender.js — voir ce fichier pour le pourquoi.
      document.documentElement.classList.add('js');
      setTimeout(function () {
        if (!document.documentElement.dataset.verticalReady) {
          document.documentElement.classList.remove('js');
        }
      }, 2500);
    </script>
`;

/**
 * Remplace le contenu d'une balise meta existante, ou n'y touche pas.
 *
 * On ne crée pas la balise si elle est absente : chaque page verticale a déjà
 * ses `<meta>` dans le HTML, et en ajouter une en double serait pire que de
 * laisser celle qui existe.
 */
const setMetaContent = (html, selector, value) => {
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")([^"]*)(")`, 'i');
  return pattern.test(html) ? html.replace(pattern, `$1${escapeAttr(value)}$3`) : html;
};

export default function prerenderVerticals() {
  return {
    name: 'launch48-prerender-verticals',
    apply: 'build',
    enforce: 'post',

    async transformIndexHtml(html, ctx) {
      // Le marqueur du `<body>` désigne les pages concernées. Les autres pages
      // (home, devis, call, blog, légales) sont déjà statiques : on passe.
      const bodyTag = html.match(/<body[^>]*>/i)?.[0] ?? '';
      const pageType = bodyTag.match(/data-page="([^"]*)"/i)?.[1];
      if (!pageType) return html;

      const slugMatch = bodyTag.match(/data-offer-slug="([^"]*)"/i);
      const offerSlug = slugMatch?.[1] ?? '';

      // Le point de montage doit être vide : s'il contient déjà quelque chose,
      // c'est qu'une autre étape a rendu la page, et on ne l'écrase pas.
      const mount = /(<div id="app"\s*>)(\s*)(<\/div>)/i;
      if (!mount.test(html)) {
        this.warn(
          `${ctx.path} porte data-page="${pageType}" mais aucun <div id="app"></div> vide : page laissée telle quelle.`,
        );
        return html;
      }

      // Import dynamique : le module est pur, mais le résoudre au chargement du
      // plugin ferait échouer la config si le fichier bougeait.
      const { renderPage } = await import(resolve(HERE, 'src/verticales-render.js'));
      const { title, description, html: markup } = renderPage(pageType, offerSlug);

      let out = html.replace(mount, `$1${markup}$3`);

      // Titre et description : ils n'existaient que dans le JavaScript.
      out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`);
      out = setMetaContent(out, 'name="description"', description);
      out = setMetaContent(out, 'property="og:title"', title);
      out = setMetaContent(out, 'property="og:description"', description);
      out = setMetaContent(
        out,
        'property="og:url"',
        `${ORIGIN}/${ctx.path.replace(/^\/+/, '').replace(/index\.html$/, '')}`,
      );

      // Le contenu étant désormais dans le fichier, les apparitions au scroll
      // ont besoin d'être amorcées avant la première peinture.
      out = out.replace(/(<head[^>]*>\n?)/i, `$1${REVEAL_BOOTSTRAP}`);

      return out;
    },
  };
}
