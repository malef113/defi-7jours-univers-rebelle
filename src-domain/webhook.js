import { DEFAULT_CHALLENGE, DEFAULT_WEBHOOK } from "./challenge-config.js";
import { resolveEnrollmentProgress } from "./enrollment.js";

export function buildWebhookPayload(eventType, input = {}) {
  const challenge = input.challenge || DEFAULT_CHALLENGE;
  const enrollment = input.enrollment || null;
  const progress =
    input.progress ||
    resolveEnrollmentProgress(enrollment, {
      challenge,
      completions: input.completions || {},
      now: input.now
    });

  return {
    webhook_version: DEFAULT_WEBHOOK.version,
    event_type: eventType,
    event_id: input.event_id || makeEventId(),
    occurred_at: input.occurred_at || new Date().toISOString(),
    source_platform: DEFAULT_WEBHOOK.source_platform,
    source_app: DEFAULT_WEBHOOK.source_app,
    challenge: {
      challenge_id: challenge.id,
      slug: challenge.slug,
      title: challenge.title,
      access_model: challenge.access_model,
      price: challenge.price,
      vip_enabled: challenge.vip_enabled,
      unlock_mode: challenge.unlock_mode,
      unlock_time: challenge.unlock_time,
      timezone: challenge.timezone,
      total_days: challenge.total_days,
      post_challenge_access_days: challenge.post_challenge_access_days
    },
    enrollment: {
      enrollment_id: enrollment?.id || null,
      contact_id: enrollment?.contact_id || null,
      email: enrollment?.email || null,
      first_name: enrollment?.first_name || null,
      access_model: enrollment?.access_model || challenge.access_model,
      access_status: progress.access_status,
      payment_status: enrollment?.payment_status || null,
      enrolled_at: enrollment?.enrolled_at || null,
      challenge_start_at: enrollment?.challenge_start_at || null,
      current_day: progress.current_day,
      current_step: progress.current_step,
      timezone: enrollment?.timezone || challenge.timezone,
      day_schedule: progress.day_schedule,
      unlocked_days: progress.unlocked_days,
      locked_days: progress.locked_days,
      next_unlock_at: progress.next_unlock_at,
      challenge_end_at: enrollment?.challenge_end_at || null,
      access_expires_at: enrollment?.access_expires_at || null,
      magic_link_token: enrollment?.magic_link_token || null,
      magic_link_expires_at: enrollment?.magic_link_expires_at || null,
      direct_access_link: enrollment?.direct_access_link || null
    },
    details: input.details || {}
  };
}

function makeEventId() {
  const random =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `event_${random}`;
}

