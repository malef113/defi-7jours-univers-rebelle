# Plan de portage Lovable

Ce document sert de garde-fou pour porter le prototype HTML du Défi vers Lovable/TanStack sans réinterpréter le produit.

## Repo et routes

- Repo source: `defi-7jours-univers-rebelle`
- Ne pas toucher au repo Génie Rebelle.
- Vue client pure:
  - `/`
  - domaine: `defi-7jours.universrebelle.com`
- Vue client pré-live avec menu hamburger:
  - `/prototypeclient`
- Vue construction:
  - `/admin`

## Principe d'architecture

Le frontend ne doit pas décider seul de la journée courante. Il affiche les états retournés par les server routes:

- `current_day`
- `current_step`
- `unlocked_days`
- `locked_days`
- `next_unlock_at`
- `access_status`
- `visible_blocks`

## Modules source à porter

Les modules dans `/src-domain` sont la base portable:

- `challenge-config.js`: modèles d'accès, config par défaut, règles.
- `challenge-content.js`: contenu structuré et blocs.
- `timezone.js`: calculs timezone.
- `access.js`: paiement, VIP, cadence, visibilité.
- `enrollment.js`: inscription, calendrier, progression, expiration.
- `webhook.js`: payload GHL complet.

Dans Lovable, ces fichiers peuvent devenir des modules TypeScript:

- `src/domain/challenge-config.ts`
- `src/domain/challenge-content.ts`
- `src/domain/timezone.ts`
- `src/domain/access.ts`
- `src/domain/enrollment.ts`
- `src/domain/webhook.ts`

## Server routes attendues

### `GET /api/challenges/current`

Retourne le défi actif, son modèle d'accès, ses jours et la config admin minimale.

### `POST /api/enrollments`

Crée une inscription et retourne:

- enrollment
- progression
- direct_access_link
- payload webhook envoyé à GHL

### `GET /api/enrollments/resolve?token=...`

Résout le token de lien courriel et retourne la bonne journée automatiquement.

### `POST /api/progress`

Enregistre une action de progression:

- video_completed
- sales_video_completed
- day_completed
- checklist_item_toggled

### `POST /api/challenge-webhook-preview`

Relais serveur vers GHL. Ne pas poster directement vers GHL depuis le navigateur.

## Modèles d'accès

### `free`

- Inscription gratuite.
- Cadence active.
- Aucun bloc VIP.
- Aucun CTA VIP.

### `paid`

- Paiement requis avant entrée.
- Toutes les journées accessibles par défaut si `unlock_mode = all`.
- Aucune page d'attente par défaut.
- Aucun bloc VIP.

### `free_with_vip`

- Inscription gratuite possible.
- Cadence progressive pour gratuits.
- VIP accéléré si `vip_enabled = true`.
- Blocs VIP visibles seulement dans ce modèle.

## Règles vidéo

- Vidéo de contenu: peut être obligatoire avant de compléter une journée.
- Vidéo de vente: obligatoire seulement pour les jours avec conversion si la règle est activée.
- Les jours de conversion commencent par `conversion_start_day`, actuellement jour 5.

## QA obligatoire

- Inscription à 15h13: jour 1 immédiat, jour 2 le lendemain à 8h dans `America/Toronto`.
- `paid + unlock all`: toutes les journées accessibles après paiement.
- `free`: cadence active et jours futurs verrouillés.
- `free_with_vip`: VIP caché si `vip_enabled = false`.
- Deux jours après la fin: `access_status = expired`.
- Token courriel: ouvre automatiquement la bonne journée.
- Payload GHL: contient `day_schedule`, `next_unlock_at`, `challenge_end_at`, `access_expires_at`, `direct_access_link`.
