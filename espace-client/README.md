# Espace client Launch48

Onboarding (questionnaire) + suivi de production, pour tous les projets clients.
Application Next.js **isolée** : elle ne sert que `/espace/[token]` et `/admin`.
Le site vitrine à la racine du repo (Vite) n'est pas touché.

---

## Pourquoi une app séparée

Le repo `launch48.fr` est un site **statique** (Vite + vanilla JS + GSAP, 21 pages
HTML). Les Server Components et Server Actions demandés par le cahier des charges
n'existent pas sans Next.js. Plutôt que de migrer 10 000 lignes de CSS et le
système de slots `content.html` — avec le risque SEO et perf que ça implique —
l'espace client vit dans son propre dossier, avec son propre `package.json`.

Les tokens de design (`#091019`, `#46e4ff`, Sora, Space Grotesk…) sont repris
à l'identique de `src/styles.css` dans `app/globals.css`.

---

## Mise en route

### 1. Supabase

Crée un projet Supabase, puis colle dans **SQL Editor**, **dans cet ordre** :

1. `supabase/migration.sql` — les 4 tables, le bucket privé `client-assets`,
   RLS partout, et les droits du rôle `anon` retirés.
2. `supabase/migration-002-taches.sql` — ce qui transforme une tâche en demande
   adressée au client : explication, livrable attendu, dossier de dépôt,
   échéance, jalon, mot du client, et le statut `review` (« à valider »).

> Les deux fichiers sont idempotents : tu peux les relancer sans casse. Sur une
> base déjà en production, la 002 s'applique à chaud — elle n'ajoute que des
> colonnes nullables et n'élargit la contrainte de statut que dans le sens
> permissif.

### 2. Variables d'environnement

```bash
cp .env.example .env.local
```

Puis remplis :

| Variable | Où la trouver |
| --- | --- |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` |
| `ADMIN_PASSWORD` | ce que tu veux |
| `ADMIN_SESSION_SECRET` | `openssl rand -hex 32` |

⚠️ Aucune variable n'est préfixée `NEXT_PUBLIC_`. La clé `service_role` ne sort
jamais du serveur.

### 3. Lancer

```bash
npm install && npm run dev
```

`http://localhost:3000/admin`

> `@supabase/supabase-js` réclame **Node 22+**. Sur Node 20 ça fonctionne mais
> affiche un avertissement de dépréciation. Vercel est en Node 22 par défaut.

---

## Mode démo (sans Supabase)

Pour montrer l'interface à un client, faire une revue de design ou des captures
sans brancher de base :

```bash
echo "DEMO_MODE=1" >> .env.local && npm run dev
```

Un projet fictif est servi depuis `lib/demo-data.ts`. **Ses tâches sont
générées depuis le premier lot de `lib/task-packs.ts`** : ce qu'on regarde en
démo est exactement ce qui sera importé en vrai, et enrichir un lot met
l'aperçu à jour tout seul. Quelques tâches sont forcées dans un autre statut
pour que l'interface montre ses cinq états plutôt que deux.

**Lecture seule** : les Server Actions se contentent de naviguer, rien n'est
écrit.

- Espace client : `/espace/22222222-2222-4222-8222-222222222222`
- Admin : `/admin` (mot de passe = ton `ADMIN_PASSWORD`)

À ne jamais activer en production.

---

## Le quotidien

### Créer un projet

`/admin` → **Nouveau projet**. Le token uuid est généré automatiquement et les
tâches du pack choisi sont créées d'office depuis `lib/task-templates.ts`.

### Envoyer le lien

Sur la fiche projet, bouton **Copier le lien** :
`https://…/espace/<token>`. C'est le seul secret : pas de compte, pas de mot de
passe côté client. Un token inconnu ou mal formé renvoie un 404, et toute l'app
est en `noindex, nofollow` (`app/robots.ts` + metadata du layout).

### Envoyer des tâches au client

Onglet **Tâches** de la fiche projet. Trois façons d'alimenter la liste :

- **Envoyer une tâche** — un formulaire complet en bas de page : l'intitulé, le
  *pourquoi* (lu tel quel par le client), le **livrable attendu**, la phase, le
  jalon, l'échéance. Elle apparaît dans son espace immédiatement.
- **Importer un lot** — les listes prêtes à l'emploi de `lib/task-packs.ts`.
  L'import est idempotent par intitulé : réimporter un lot enrichi n'engendre
  pas de doublons.
- **Le seed du pack** à la création du projet, comme avant.

Le champ **livrable attendu** est ce qui change tout. Rempli, la tâche affiche
côté client le bouton de dépôt et passe par `review` (« à valider ») au lieu
d'être terminée sur parole. Vide, c'est une simple décision à prendre — le
client la coche, elle est finie.

Le bouton **Prévenir le client** rédige l'e-mail listant les tâches ouvertes et
l'ouvre dans ton client mail. Pas de service transactionnel à payer, et le
message part de ta vraie adresse, dans ton vrai fil de discussion.

### Le dossier de dépôt Google Drive

Les livrables ne transitent pas par l'app : 100 fiches produits en photo se
comptent en gigaoctets, très au-delà du bucket Supabase et de la limite de corps
des Server Actions.

1. Crée un dossier Drive et partage-le **en écriture** avec l'adresse du client.
2. Colle son lien dans **Fiche → Dossier de dépôt (Google Drive)**.
3. Optionnel : une tâche peut avoir son propre sous-dossier, saisi sur la tâche.
   Sans lui, elle retombe sur le dossier du projet.

Seul `https:` est accepté, à l'écriture comme à l'affichage (`lib/drive.ts`) :
le lien est rendu cliquable dans l'espace client, une faute de frappe ne doit
pas pouvoir produire un `javascript:`.

Sans dossier renseigné, rien ne casse — les tâches à livrable affichent « le
dossier de dépôt n'est pas encore ouvert », et l'onglet Tâches te le rappelle.

### La boucle complète

```
   toi                        le client                     toi
 ────────────────────────────────────────────────────────────────────
 crée la tâche       →   la lit, dépose sur Drive,   →   « à valider »
 (+ livrable)            clique « j'ai déposé »          dans l'admin
                                                          ↓
                                            valides  ──→  terminé
                                            ou renvoies ─→  à faire
```

Une tâche sans livrable saute l'étape de validation : le client la coche, c'est
terminé. Il peut revenir sur sa déclaration tant que tu n'as rien validé ; une
fois validée par toi, seul l'admin peut la rouvrir.

### Suivre l'avancement

- `/admin` : tableau de tous les projets — pack, statut, % d'avancement, nombre
  de manquants, date du dernier update.
- `/admin/projet/<id>` : éditer la fiche, lire toutes les réponses, télécharger
  les fichiers (URL signée 1 h), éditer / ajouter / réordonner / supprimer les
  tâches, changer les statuts.

Côté client, trois écrans :

| | |
| --- | --- |
| `/espace/<token>` | l'accueil : un message, une action |
| `…/suivi` | le tableau de bord — l'anneau d'avancement, puis **trois blocs** |
| `…/taches` | sa liste à lui, dépliée, groupée par urgence. C'est le lien qu'on met dans l'e-mail |

Le tableau de bord tient en trois blocs, et rien d'autre :

1. **Ce que j'attends de toi** — rangé par thème (le stock, les photos, les
   pages légales…), cartes repliées, dépliables là où il veut agir.
2. **Ce sur quoi je travaille** — notre part, en lecture seule. Elle est là
   pour qu'il sache à quoi on passe notre temps, et pourquoi telle de ses
   tâches débloque telle des nôtres.
3. **Ce qui est déjà fait** — l'acquis des deux côtés, replié par thème.

Chaque bloc a sa couleur — ambre, cyan, vert — et elle ne sert qu'à ça :
répondre à « à qui est la balle » avant qu'un mot ait été lu.

Le vocabulaire y est traduit. `PHASES` porte un `clientLabel` à côté du
libellé métier : « Intégration front » devient « Les pages du site »,
« Connexion boutique » devient « La boutique et le panier ». Le pack et le
statut interne du projet ne sont pas affichés du tout — ils ne veulent rien
dire pour quelqu'un qui monte une boutique.

---

## Les trois fichiers à éditer

### `lib/brief-schema.ts` — le questionnaire

Source de vérité unique. Il pilote **à la fois** le rendu du formulaire, le
calcul des éléments manquants et l'affichage des réponses en admin. Ajouter une
question = ajouter un objet dans `FIELDS`. Rien d'autre à toucher.

⚠️ Ne renomme jamais une `key` déjà en production : c'est la clé de stockage
dans `form_answers.data` et dans `assets.field_key`.

### `lib/task-templates.ts` — les tâches par défaut

`STANDARD` est la référence ; `light` et `pousse` en dérivent par filtrage /
ajout, pour éviter la duplication. Modifier un template **ne touche pas** les
projets existants : le seed n'a lieu qu'à la création.

`PHASES` vit ici aussi. Elle couvre les deux moitiés du projet — ce qu'on
construit (cadrage, design, intégration, boutique, recette, mise en ligne) et ce
que le client rassemble (identité, contenus, photographies, textes légaux,
stock, logistique). Ajouter une phase ne pollue aucun projet existant :
`phaseViews()` ne montre que celles où le projet a réellement des tâches.

### `lib/task-packs.ts` — les lots à envoyer en cours de route

Un *pack* est le squelette de production, créé une fois à l'ouverture. Un *lot*
est un paquet de demandes qu'on pousse au client quand il devient pertinent —
le contenu, le stock, le légal — et qu'on importe depuis l'onglet Tâches.

Chaque tâche d'un lot porte son `description`, son `deliverable`, son
`milestone` et, pour les acquis, `status: 'done'` : c'est ce qui permet
d'alimenter d'un coup les tâches achevées d'un projet déjà bien avancé.

---

## Choix faits en cours de route

Là où le cahier des charges laissait le champ libre, voici ce qui a été tranché
au plus simple :

- **Booléens bloquants.** Un `bool` requis compte comme rempli dès qu'il est
  répondu — « assujetti TVA : non » est une réponse valable. Sauf pour les
  « accès transmis ? » (registrar, Shopify, Storefront) où `false` **est** le
  blocage : ces champs portent le flag `blockingWhenFalse` dans le schéma.
- **Une question à la fois sur mobile.** Fait en CSS pur (`scroll-snap` +
  hauteur de champ calée sur le viewport), sans JS ni état client. Si le
  comportement ne plaît pas, supprime le bloc `@media (max-width: 767px)` en fin
  de `app/globals.css`.
- **Éléments manquants.** Champs `required` vides d'abord (cliquables vers
  `?step=N&focus=key`), puis les tâches `status = blocked` (informatives).
- **Forme juridique** et **photos produits** sont des `select` : le cahier des
  charges ne précisait pas le type.
- **Sécurité base.** RLS activé sans aucune policy : tout est fermé sauf
  `service_role`. L'autorisation réelle se fait dans l'app (token porteur pour
  `/espace`, cookie HMAC pour `/admin`).
- **Réordonnancement des tâches** par échange d'`order_index` avec le voisin de
  la même phase. Suffisant à cette échelle, aucune librairie de drag & drop.
- **Suppression d'un projet** : il faut retaper le nom de l'entreprise. Vérifié
  côté serveur, pas en JS.
- **Zéro JS applicatif**, à une exception : le bouton « Copier le lien » en
  admin (`app/_components/CopyButton.tsx`). Tous les formulaires fonctionnent
  en POST + redirect, y compris sans JavaScript.

---

## Déploiement Vercel (depuis le repo launch48)

Le repo contient **deux applications** : le site vitrine (Vite, à la racine) et
l'espace client (Next.js, dans `espace-client/`). Vercel ne sait pas construire
deux frameworks dans un seul projet → il faut **deux projets Vercel branchés sur
le même repo GitHub**, chacun avec son Root Directory.

### 1. Le projet espace client

Vercel → Add New → Project → même repo GitHub qu'aujourd'hui, puis :

| Réglage | Valeur |
| --- | --- |
| Root Directory | `espace-client` |
| Framework Preset | Next.js (détecté seul) |
| Build / Install / Output | laisser les valeurs par défaut |
| Node.js Version | 22 ou plus (`engines` du package.json l'impose déjà) |

Puis Settings → Environment Variables, les 4 mêmes que dans `.env.local` :
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET`.

⚠️ Ne mets **jamais** `DEMO_MODE` en production.

Le projet vitrine existant n'a rien à changer : son build à la racine ignore
`espace-client/`.

### 2. Choisir l'URL

**Option A — sous-domaine `espace.launch48.fr` (recommandé)**

Sur le projet espace client : Settings → Domains → ajoute
`espace.launch48.fr`, et crée le CNAME que Vercel t'indique chez ton registrar.

C'est tout. Les liens clients deviennent
`https://espace.launch48.fr/espace/<token>`, l'admin
`https://espace.launch48.fr/admin`.

Rien d'autre à configurer : pas de proxy, pas d'assets à router, pas de CSRF à
déclarer. C'est la raison pour laquelle c'est l'option conseillée.

**Option B — même domaine, `launch48.fr/espace/*`**

Plus élégant côté URL, mais il y a trois pièges. Sur le projet **vitrine**,
crée un `vercel.json` à la racine du repo :

```json
{
  "rewrites": [
    { "source": "/espace/:path*", "destination": "https://<espace>.vercel.app/espace/:path*" },
    { "source": "/admin/:path*",  "destination": "https://<espace>.vercel.app/admin/:path*" },
    { "source": "/_next/:path*",  "destination": "https://<espace>.vercel.app/_next/:path*" }
  ]
}
```

1. **La ligne `/_next/*` est obligatoire.** Sans elle, le CSS et le JS de
   l'espace client renvoient 404 : Next sert ses assets depuis `/_next/`, qui
   ne correspond ni à `/espace/*` ni à `/admin/*`. Le site vitrine étant en
   Vite, il n'utilise pas ce chemin — aucun conflit.
2. **Décommente `allowedOrigins` dans `next.config.ts`** avec ton domaine.
   Next compare l'`Origin` au `Host` pour bloquer le CSRF sur les Server
   Actions ; derrière le rewrite, l'`Origin` vaut `launch48.fr` et le `Host` le
   domaine `.vercel.app` → *toutes* les soumissions de formulaire sont
   rejetées tant que ce n'est pas déclaré.
3. **Le trafic passe par deux projets Vercel**, donc double facturation en
   invocations et une latence supplémentaire.

### 3. Optionnel — éviter de tout reconstruire à chaque push

Par défaut, un push reconstruit les deux projets. Sur le projet **vitrine**,
Settings → Git → Ignored Build Step :

```bash
git diff --quiet HEAD^ HEAD -- . ':(exclude)espace-client'
```

Vercel interprète le code de sortie 0 comme « ne pas construire » : le site
vitrine ne se reconstruit donc que si quelque chose a changé en dehors de
`espace-client/`. Sur le projet espace client, la case
« Only build if there are changes in the Root Directory » fait l'équivalent.

---

## Structure

```
espace-client/
├── app/
│   ├── globals.css                    tokens repris du site vitrine
│   ├── layout.tsx                     fonts + noindex global
│   ├── robots.ts                      disallow: /
│   ├── _components/                   Brand, Bar, CopyButton
│   ├── _components/                   Brand, Bar, Ring, PhaseIcon, Tabs…
│   ├── espace/[token]/
│   │   ├── page.tsx                   écran d'accueil
│   │   ├── suivi/page.tsx             tableau de bord — les trois blocs
│   │   ├── taches/page.tsx            « Mes tâches » : la part du client
│   │   ├── _TaskCard.tsx              la carte d'une tâche (dépliée ou repliable)
│   │   ├── _tabs.ts                   les onglets client, définis une fois
│   │   ├── actions.ts                 save, upload, delete, rendre une tâche
│   │   └── brief/page.tsx             questionnaire 6 étapes + récap
│   └── admin/
│       ├── page.tsx                   login + liste des projets
│       ├── actions.ts                 login, CRUD projets & tâches, import
│       └── projet/[id]/
│           ├── page.tsx               fiche projet + dossier de dépôt
│           └── taches/page.tsx        file « à valider », envoi, édition
├── lib/
│   ├── brief-schema.ts     ← à éditer  définition des 52 champs
│   ├── task-templates.ts   ← à éditer  phases (+ libellés client) et packs
│   ├── task-packs.ts       ← à éditer  lots importables
│   ├── drive.ts                       liens de dépôt (https uniquement)
│   ├── notify.ts                      l'e-mail d'annonce des tâches
│   ├── missing.ts                     calcul des manquants
│   ├── progress.ts                    % global, stats, charge du client
│   ├── auth.ts                        cookie admin signé HMAC
│   ├── supabase.ts                    client service_role
│   ├── data.ts                        lectures
│   ├── brief-values.ts                FormData ↔ jsonb
│   ├── format.ts                      dates, prix, tailles
│   └── types.ts
└── supabase/
    ├── migration.sql                  tables, bucket, RLS
    └── migration-002-taches.sql       livrables, jalons, statut « à valider »
```
