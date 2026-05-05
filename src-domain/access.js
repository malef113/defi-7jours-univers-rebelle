import { ACCESS_MODELS, UNLOCK_MODES, VISIBILITY_RULES } from "./challenge-config.js";

export function isPaymentRequired(challenge, payment = {}) {
  return challenge.access_model === ACCESS_MODELS.PAID && Boolean(payment.required);
}

export function hasPaidAccess(enrollment) {
  return enrollment?.payment_status === "paid" || enrollment?.payment_status === "not_required";
}

export function hasVipAccess(enrollment, challenge) {
  return Boolean(challenge.vip_enabled && enrollment?.access_tier === "vip");
}

export function shouldUseCadence(challenge, enrollment) {
  if (challenge.access_model === ACCESS_MODELS.PAID) {
    return challenge.unlock_mode !== UNLOCK_MODES.ALL;
  }

  if (hasVipAccess(enrollment, challenge)) {
    return false;
  }

  return true;
}

export function isBlockVisible(block, context) {
  if (!block?.is_enabled || block.visibility_rule === VISIBILITY_RULES.HIDDEN) {
    return false;
  }

  const rule = block.visibility_rule || VISIBILITY_RULES.ALWAYS;
  const paid = hasPaidAccess(context.enrollment);
  const vip = hasVipAccess(context.enrollment, context.challenge);
  const accessModel = context.challenge.access_model;

  const checks = {
    [VISIBILITY_RULES.ALWAYS]: true,
    [VISIBILITY_RULES.FREE_USERS_ONLY]: !paid && !vip,
    [VISIBILITY_RULES.PAID_USERS_ONLY]: paid,
    [VISIBILITY_RULES.VIP_USERS_ONLY]: vip,
    [VISIBILITY_RULES.NON_VIP_USERS_ONLY]: !vip,
    [VISIBILITY_RULES.ACCESS_MODEL_FREE_ONLY]: accessModel === ACCESS_MODELS.FREE,
    [VISIBILITY_RULES.ACCESS_MODEL_PAID_ONLY]: accessModel === ACCESS_MODELS.PAID,
    [VISIBILITY_RULES.ACCESS_MODEL_FREE_WITH_VIP_ONLY]:
      accessModel === ACCESS_MODELS.FREE_WITH_VIP
  };

  return checks[rule] ?? true;
}

export function visibleBlocks(blocks, context) {
  return blocks
    .filter((block) => isBlockVisible(block, context))
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

