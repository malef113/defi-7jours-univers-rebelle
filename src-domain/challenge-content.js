import { VISIBILITY_RULES } from "./challenge-config.js";

export const DEFAULT_DAYS = Object.freeze([
  {
    day_number: 1,
    title: "Clarifier ton message",
    type: "valeur_pure",
    conversion_cashflow: false,
    video: {
      title: "Trouver ton message principal",
      wistia_id: "3l5i8w2z5t",
      completion_required: true
    },
    blocks: [
      {
        block_id: "day-1-cap",
        type: "theorie",
        title: "Cap du jour",
        content:
          "Aujourd'hui, l'objectif est de faire tomber la pression de devoir tout dire. On choisit plutôt un message principal que ton audience peut reconnaître en quelques secondes.",
        sort_order: 10,
        is_enabled: true,
        visibility_rule: VISIBILITY_RULES.ALWAYS
      },
      {
        block_id: "day-1-focus-1",
        type: "theorie",
        title: "Ce qu'on clarifie",
        content:
          "Commence par nommer le problème que ta cliente vit déjà. Ensuite, relie ce problème à une transformation tangible qu'elle désire maintenant, pas plus tard.",
        sort_order: 20,
        is_enabled: true,
        visibility_rule: VISIBILITY_RULES.ALWAYS
      },
      {
        block_id: "day-1-focus-2",
        type: "theorie",
        title: "Ce qu'on cherche à créer",
        content:
          "Un bon contenu ne cherche pas seulement à impressionner. Il cherche à créer de la reconnaissance, de la clarté et une envie de passer à l'action.",
        sort_order: 30,
        is_enabled: true,
        visibility_rule: VISIBILITY_RULES.ALWAYS
      }
    ]
  },
  {
    day_number: 2,
    title: "Rendre ton audience plus précise",
    type: "valeur_pure",
    conversion_cashflow: false,
    video: {
      title: "Arrêter de parler à tout le monde",
      wistia_id: "3l5i8w2z5t",
      completion_required: true
    },
    blocks: []
  },
  {
    day_number: 3,
    title: "Trouver tes angles de contenu",
    type: "valeur_pure",
    conversion_cashflow: false,
    video: {
      title: "Créer des angles qui attirent l'attention",
      wistia_id: "3l5i8w2z5t",
      completion_required: true
    },
    blocks: []
  },
  {
    day_number: 4,
    title: "Créer du contenu d'autorité",
    type: "valeur_pure",
    conversion_cashflow: false,
    video: {
      title: "Créer du contenu qui positionne",
      wistia_id: "3l5i8w2z5t",
      completion_required: true
    },
    blocks: []
  },
  {
    day_number: 5,
    title: "Créer du contenu de connexion",
    type: "valeur_plus_conversion",
    conversion_cashflow: true,
    video: {
      title: "Créer de la connexion sans surpartager",
      wistia_id: "3l5i8w2z5t",
      completion_required: true
    },
    sales_video: {
      title: "Le contenu qui vend commence souvent avant l'offre",
      wistia_id: "",
      completion_required: true
    },
    blocks: [
      {
        block_id: "day-5-cashflow",
        type: "bloc_vente_optionnel",
        title: "Le contenu qui vend commence souvent avant l'offre",
        content:
          "Cashflow t'aide à garder le lien vivant chaque semaine sans repartir de zéro.",
        cta_label: "Voir comment Cashflow peut t'aider",
        cta_url: "https://orders.helenecollette.com/methode-rebelle",
        sort_order: 50,
        is_enabled: true,
        visibility_rule: VISIBILITY_RULES.ACCESS_MODEL_PAID_ONLY
      }
    ]
  },
  {
    day_number: 6,
    title: "Créer des appels à l'action naturels",
    type: "valeur_plus_conversion",
    conversion_cashflow: true,
    video: {
      title: "Vendre sans forcer dans ton contenu",
      wistia_id: "3l5i8w2z5t",
      completion_required: true
    },
    sales_video: {
      title: "Pourquoi tes contenus doivent avoir une suite",
      wistia_id: "",
      completion_required: true
    },
    blocks: []
  },
  {
    day_number: 7,
    title: "Assembler ton mini-système de contenu",
    type: "valeur_plus_conversion",
    conversion_cashflow: true,
    video: {
      title: "Ton plan de contenu simple pour continuer",
      wistia_id: "3l5i8w2z5t",
      completion_required: true
    },
    sales_video: {
      title: "La suite pour ne pas repartir de zéro",
      wistia_id: "",
      completion_required: true
    },
    blocks: []
  }
]);

export function getChallengeDays(days = DEFAULT_DAYS, totalDays = 7) {
  return days.slice(0, totalDays);
}

