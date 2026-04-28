# Défi 7 jours Univers Rebelle

Prototype HTML/CSS/JS autonome pour l'expérience Défi présence sociale sur 7 jours.

## Démarrage local

```bash
npm start
```

Routes utiles:

- `http://localhost:3000/defi-7jours`
- `http://localhost:3000/client/defi-7jours`
- `http://localhost:3000/client/defi-7-jours`
- `http://localhost:3000/prototype/defi-7jours`
- `http://localhost:3000/prototype/defi-7-jours`

## Matrice des vues

Vues client:

- `/`
- `/defi-7jours`
- `/client/defi-7jours`
- `/client/defi-7-jours`
- `https://defi-7jours.universrebelle.com/`

Vue prototype/dev seulement:

- `/prototype/defi-7jours`
- `/prototype/defi-7-jours`

Règle de sécurité: toute route qui ne commence pas par `/prototype/` doit être traitée comme une vue client.

La vue client doit cacher les panneaux d'administration, stats, payloads et outils dev.
La vue prototype/dev peut afficher ces outils pour validation interne.

## Notes Lovable

- Point d'entrée principal: `public/challenge-7-jours.html`
- Serveur local minimal: `server.mjs`
- Route cible prévue: `/defi-7jours`
- Domaine cible prévu: `defi-7jours.universrebelle.com`
