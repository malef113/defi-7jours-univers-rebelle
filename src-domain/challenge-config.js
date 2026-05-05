export const ACCESS_MODELS = Object.freeze({
  FREE: "free",
  PAID: "paid",
  FREE_WITH_VIP: "free_with_vip"
});

export const UNLOCK_MODES = Object.freeze({
  ALL: "all",
  DAILY_8AM: "daily_8am"
});

export const VISIBILITY_RULES = Object.freeze({
  ALWAYS: "always",
  FREE_USERS_ONLY: "free_users_only",
  PAID_USERS_ONLY: "paid_users_only",
  VIP_USERS_ONLY: "vip_users_only",
  NON_VIP_USERS_ONLY: "non_vip_users_only",
  ACCESS_MODEL_FREE_ONLY: "access_model_free_only",
  ACCESS_MODEL_PAID_ONLY: "access_model_paid_only",
  ACCESS_MODEL_FREE_WITH_VIP_ONLY: "access_model_free_with_vip_only",
  HIDDEN: "hidden"
});

export const DEFAULT_CHALLENGE = Object.freeze({
  id: "hc-defi-presence-sociale-7-jours",
  slug: "defi-7jours",
  title: "Défi présence sociale sur 7 jours",
  subtitle: "7 jours pour prendre plus de place sur les réseaux",
  status: "draft",
  access_model: ACCESS_MODELS.PAID,
  price: "7$",
  vip_enabled: false,
  vip_price: "7$",
  unlock_mode: UNLOCK_MODES.ALL,
  unlock_delay_hours: 24,
  unlock_time: "08:00",
  timezone: "America/Toronto",
  total_days: 7,
  post_challenge_access_days: 2,
  created_at: "2026-04-23T00:00:00.000Z",
  updated_at: "2026-05-05T00:00:00.000Z"
});

export const DEFAULT_PAYMENT = Object.freeze({
  required: true,
  status: "pending",
  checkout_url: "",
  simulation_mode: true
});

export const DEFAULT_WEBHOOK = Object.freeze({
  version: "1.0",
  source_platform: "lovable",
  source_app: "defi-7jours-univers-rebelle"
});

