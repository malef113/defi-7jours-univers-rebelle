import test from "node:test";
import assert from "node:assert/strict";

import {
  ACCESS_MODELS,
  DEFAULT_CHALLENGE,
  UNLOCK_MODES,
  VISIBILITY_RULES,
  buildWebhookPayload,
  createEnrollment,
  isBlockVisible,
  resolveEnrollmentProgress
} from "../src-domain/index.js";

test("inscription à 15h13: jour 1 immédiat et jour 2 demain à 8h Toronto", () => {
  const challenge = {
    ...DEFAULT_CHALLENGE,
    access_model: ACCESS_MODELS.FREE,
    unlock_mode: UNLOCK_MODES.DAILY_8AM
  };
  const enrollment = createEnrollment(
    {
      enrolled_at: "2026-05-01T19:13:00.000Z"
    },
    { challenge, payment: { required: false } }
  );

  assert.equal(enrollment.day_schedule[0].unlock_at, "2026-05-01T19:13:00.000Z");
  assert.equal(enrollment.day_schedule[1].unlock_at, "2026-05-02T12:00:00.000Z");
  assert.equal(enrollment.day_schedule[2].unlock_at, "2026-05-03T12:00:00.000Z");
});

test("paid avec unlock all: toutes les journées sont accessibles après paiement", () => {
  const challenge = {
    ...DEFAULT_CHALLENGE,
    access_model: ACCESS_MODELS.PAID,
    unlock_mode: UNLOCK_MODES.ALL
  };
  const enrollment = {
    ...createEnrollment(
      {
        enrolled_at: "2026-05-01T19:13:00.000Z"
      },
      { challenge, payment: { required: true } }
    ),
    payment_status: "paid",
    access_status: "active"
  };

  const progress = resolveEnrollmentProgress(enrollment, {
    challenge,
    now: "2026-05-01T19:14:00.000Z"
  });

  assert.deepEqual(progress.unlocked_days, [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(progress.locked_days, []);
  assert.equal(progress.current_step, "day-1");
});

test("free cadence: jour 2 reste bloqué avant 8h Toronto", () => {
  const challenge = {
    ...DEFAULT_CHALLENGE,
    access_model: ACCESS_MODELS.FREE,
    unlock_mode: UNLOCK_MODES.DAILY_8AM
  };
  const enrollment = createEnrollment(
    {
      enrolled_at: "2026-05-01T19:13:00.000Z"
    },
    { challenge, payment: { required: false } }
  );

  const progress = resolveEnrollmentProgress(enrollment, {
    challenge,
    now: "2026-05-02T11:59:00.000Z"
  });

  assert.deepEqual(progress.unlocked_days, [1]);
  assert.deepEqual(progress.locked_days, [2, 3, 4, 5, 6, 7]);
  assert.equal(progress.next_unlock_at, "2026-05-02T12:00:00.000Z");
});

test("expiration deux jours après la fin du défi", () => {
  const challenge = {
    ...DEFAULT_CHALLENGE,
    access_model: ACCESS_MODELS.PAID,
    unlock_mode: UNLOCK_MODES.ALL
  };
  const enrollment = {
    ...createEnrollment(
      {
        enrolled_at: "2026-05-01T19:13:00.000Z"
      },
      { challenge, payment: { required: true } }
    ),
    payment_status: "paid",
    access_status: "active"
  };

  const progress = resolveEnrollmentProgress(enrollment, {
    challenge,
    now: "2026-05-11T13:01:00.000Z"
  });

  assert.equal(enrollment.challenge_end_at, "2026-05-08T12:00:00.000Z");
  assert.equal(enrollment.access_expires_at, "2026-05-10T12:00:00.000Z");
  assert.equal(progress.access_status, "expired");
  assert.equal(progress.current_step, "expired");
});

test("visibility: bloc VIP caché si le master flag VIP est off", () => {
  const challenge = {
    ...DEFAULT_CHALLENGE,
    access_model: ACCESS_MODELS.FREE_WITH_VIP,
    vip_enabled: false
  };
  const enrollment = {
    access_tier: "vip",
    payment_status: "not_required"
  };

  assert.equal(
    isBlockVisible(
      {
        is_enabled: true,
        visibility_rule: VISIBILITY_RULES.VIP_USERS_ONLY
      },
      { challenge, enrollment }
    ),
    false
  );
});

test("webhook payload contient le calendrier complet et le lien direct", () => {
  const challenge = {
    ...DEFAULT_CHALLENGE,
    access_model: ACCESS_MODELS.FREE,
    unlock_mode: UNLOCK_MODES.DAILY_8AM
  };
  const enrollment = createEnrollment(
    {
      enrolled_at: "2026-05-01T19:13:00.000Z",
      email: "marie@example.com"
    },
    { challenge, payment: { required: false } }
  );
  const payload = buildWebhookPayload("registration_completed", {
    challenge,
    enrollment,
    now: "2026-05-01T19:14:00.000Z"
  });

  assert.equal(payload.enrollment.email, "marie@example.com");
  assert.equal(payload.enrollment.day_schedule.length, 7);
  assert.match(payload.enrollment.direct_access_link, /token=/);
  assert.equal(payload.enrollment.next_unlock_at, "2026-05-02T12:00:00.000Z");
});

