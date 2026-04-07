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
