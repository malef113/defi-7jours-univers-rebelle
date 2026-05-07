# Défi 7 jours Univers Rebelle

Prototype HTML/CSS/JS autonome pour l'expérience Défi présence sociale sur 7 jours.

## Démarrage local

```bash
npm start
```

Routes utiles:

- `http://localhost:3000/`
- `http://localhost:3000/admin`
- `http://localhost:3000/prototypeclient`

## Matrice des vues

Vue client pure:

- `/`
- `https://defi-7jours.universrebelle.com/`

Vue construction:

- `/admin`

Vue client pré-live avec menu hamburger:

- `/prototypeclient`

Règle de sécurité: `/` doit être une vue cliente pure sans outils dev, stats, payloads ni menu pré-live.
`/prototypeclient` affiche la même expérience cliente, mais avec le menu hamburger de navigation interne.
`/admin` sert uniquement à la construction du défi.

## Notes Lovable

- Point d'entrée principal: `public/challenge-7-jours.html`
- Serveur local minimal: `server.mjs`
- Route cible prévue: `/`
- Domaine cible prévu: `defi-7jours.universrebelle.com`
- Webhook V1: le client poste vers `/api/challenge-webhook-preview`, et la route serveur relaie le payload vers GHL.
- Webhook GHL par défaut: `https://services.leadconnectorhq.com/hooks/KhjV9dtw5xLa0kFbZvbD/webhook-trigger/3db39325-2a63-41fa-8452-b63a90fb5a25`
- En Lovable/TanStack, conserver ce modèle: ne pas poster directement vers GHL depuis le navigateur; utiliser la server route pour éviter les blocages CORS.
- VIP est contrôlé par `APP_CONFIG.vipOffer.enabled` dans `public/challenge-7-jours.html`.
- État actuel: VIP désactivé (`enabled: false`). Aucun bloc, CTA ou accès VIP ne doit être visible ni actif.
- L'accès au défi est maintenant payant par défaut: `APP_CONFIG.paidAccess.required: true`, prix `7$`.
- Tant que le checkout final n'est pas fourni, `APP_CONFIG.paidAccess.simulationMode: true` permet de tester le flow localement sans réactiver le VIP.
- `/admin` permet de tester le nombre de jours, le premier jour de conversion, le modèle d'accès (`free`, `paid`, `free_with_vip`), les IDs vidéo et les règles de visionnement.
- À l'inscription, un `enrollment` est créé localement avec calendrier complet (`day_schedule`), date de fin, expiration deux jours après la fin et lien direct tokenisé.
- Le payload webhook inclut maintenant le calendrier complet, la progression, le statut de paiement, le modèle d'accès et le lien direct prévu pour les courriels GHL.

## Fondation portable pour Lovable

- `src-domain/` contient la logique métier extraite en JS pur, prête à porter en modules TypeScript dans Lovable/TanStack.
- `test/domain.test.mjs` couvre les scénarios critiques: cadence 8h AM, paiement, expiration, VIP off, visibilité de blocs et payload GHL.
- `docs/lovable-porting-plan.md` décrit les routes serveur, les responsabilités frontend/backend et l'ordre de portage recommandé.

```bash
npm test
```
