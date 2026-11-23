# Launch48

Site vitrine one-page (Vite + Vanilla JS + GSAP) pour l'offre **"Site vitrine / One-page en 48h"**.

## Lancer le projet

```bash
npm i
npm run dev
```

Build de production :

```bash
npm run build
npm run preview
```

## Modifier le contenu (ULTRA IMPORTANT)

Tout le contenu éditable est dans :

- `public/content.html`

Tu peux modifier :

- titres, paragraphes, listes
- prix
- étapes workflow/process
- FAQ
- labels CTA + liens
- email + réseaux
- SEO (title/description/OG) + JSON-LD

Le JS charge `public/content.html`, parse les `data-slot` puis injecte automatiquement dans le template.

## Slots et liens

- Texte : `data-slot="hero.title"`
- Lien :
  - label `data-slot="hero.primaryCta.label"`
  - URL `data-slot="hero.primaryCta.href"`

## Fallback contenu

Si `content.html` ne charge pas, le site affiche un fallback minimal et un message d'avertissement.

## Déploiement Vercel

1. Push le dossier sur GitHub.
2. Import du repo dans Vercel.
3. Framework preset: **Vite**.
4. Commandes par défaut :
   - Build: `npm run build`
   - Output: `dist`
5. Déployer.

### En-têtes de sécurité (`vercel.json`)

`vercel.json` ne doit contenir que des clés connues de Vercel : une clé de
commentaire comme `"//"` fait échouer la validation et bloque tout déploiement.
Les explications vivent donc ici.

> Headers de sécurité du site vitrine. Volontairement pas de cleanUrls ni de
> trailingSlash : les pages légales vivent en /xxx.html et le reste en /xxx/,
> activer l'un ou l'autre ferait basculer toutes les URLs en 308 et
> désaccorderait les balises canonical.
>
> La CSP autorise exactement ce que le site utilise, rien de plus :
>   script-src  'unsafe-inline' est nécessaire (amorce gtag, ld+json, classe
>               .js dans le <head>) — un nonce est impossible en statique.
>   frame-src   calendar.google.com pour le widget de réservation.
>   form-action formspree.io, endpoint des trois formulaires.
>   font-src    'self' seulement : les polices sont auto-hébergées.
> Si tu ajoutes un outil tiers, il faut l'ajouter ici sinon il sera bloqué.
> Les mêmes en-têtes sont rejoués par vite.config.js en dev, pour ne pas
> découvrir un blocage seulement en production.

## Remplacer CTA, email, réseaux

Dans `public/content.html`, édite :

- `hero.primaryCta.href`
- `hero.secondaryCta.href`
- `pricing.primaryCta.href`
- `pricing.secondaryCta.href`
- `footer.email`
- `footer.social1.label` / `footer.social1.href`
- `footer.social2.label` / `footer.social2.href`
- `footer.social3.label` / `footer.social3.href`

## Accessibilité & perf

- Focus visibles clavier
- Respect `prefers-reduced-motion`
- Animations GPU-friendly
- Sans backend, prêt pour Lighthouse 90+ si médias légers
