import { DEFAULT_CHALLENGE, DEFAULT_PAYMENT } from "./challenge-config.js";
import { hasPaidAccess, isPaymentRequired, shouldUseCadence } from "./access.js";
import { getTimeZoneParts, makeDateInTimeZone, parseUnlockTime } from "./timezone.js";

export function buildDaySchedule(enrolledAt, challenge = DEFAULT_CHALLENGE) {
  const enrolledDate = new Date(enrolledAt);
  const enrolledParts = getTimeZoneParts(enrolledDate, challenge.timezone);
  const unlockTime = parseUnlockTime(challenge.unlock_time);

  return Array.from({ length: challenge.total_days }, (_, index) => {
    const dayNumber = index + 1;
    const unlockAt =
      dayNumber === 1
        ? enrolledDate
        : makeDateInTimeZone(
            {
              year: enrolledParts.year,
              month: enrolledParts.month,
              day: enrolledParts.day + index,
              hour: unlockTime.hour,
              minute: unlockTime.minute,
              second: 0
            },
            challenge.timezone
          );

    return {
      day_number: dayNumber,
      step_id: `day-${dayNumber}`,
      unlock_at: unlockAt.toISOString(),
      status: "locked",
      completed_at: null
    };
  });
}

export function createEnrollment(input, options = {}) {
  const challenge = options.challenge || DEFAULT_CHALLENGE;
  const payment = options.payment || DEFAULT_PAYMENT;
  const now = input.enrolled_at || new Date().toISOString();
  const token = input.magic_link_token || makeToken("enroll");
  const daySchedule = buildDaySchedule(now, challenge);
  const challengeEndAt = buildChallengeEndAt(now, challenge).toISOString();
  const accessExpiresAt = buildAccessExpiresAt(challengeEndAt, challenge).toISOString();

  return {
    id: input.id || makeToken("enrollment"),
    challenge_id: challenge.id,
    contact_id: input.contact_id || null,
    email: input.email || null,
    first_name: input.first_name || null,
    access_model: challenge.access_model,
    access_tier: "standard",
    access_status: isPaymentRequired(challenge, payment) ? "pending_payment" : "active",
    payment_status: isPaymentRequired(challenge, payment) ? "pending" : "not_required",
    enrolled_at: now,
    challenge_start_at: now,
    current_day: 1,
    current_step: "welcome",
    timezone: challenge.timezone,
    day_schedule: daySchedule,
    next_unlock_at: daySchedule[1]?.unlock_at || null,
    challenge_end_at: challengeEndAt,
    access_expires_at: accessExpiresAt,
    magic_link_token: token,
    magic_link_expires_at: null,
    direct_access_link: input.direct_access_link || `/defi-7jours?token=${token}`,
    created_at: now,
    updated_at: now
  };
}

export function resolveEnrollmentProgress(enrollment, options = {}) {
  const challenge = options.challenge || DEFAULT_CHALLENGE;
  const now = new Date(options.now || new Date().toISOString());
  const completions = options.completions || {};

  if (!enrollment) {
    return emptyProgress("not_enrolled");
  }

  const schedule = enrollment.day_schedule.map((day) => {
    const completedAt = completions[day.day_number]?.completed_at || day.completed_at || null;
    const unlocked = now >= new Date(day.unlock_at) || !shouldUseCadence(challenge, enrollment);

    return {
      ...day,
      status: completedAt ? "completed" : unlocked ? "unlocked" : "locked",
      completed_at: completedAt
    };
  });

  if (now > new Date(enrollment.access_expires_at)) {
    return {
      access_status: "expired",
      current_day: challenge.total_days,
      current_step: "expired",
      unlocked_days: schedule.map((day) => day.day_number),
      locked_days: [],
      next_unlock_at: null,
      day_schedule: schedule
    };
  }

  if (!hasPaidAccess(enrollment) && enrollment.access_status === "pending_payment") {
    return {
      access_status: "pending_payment",
      current_day: 0,
      current_step: "login",
      unlocked_days: [],
      locked_days: schedule.map((day) => day.day_number),
      next_unlock_at: schedule[0]?.unlock_at || null,
      day_schedule: schedule
    };
  }

  const unlockedDays = schedule
    .filter((day) => day.status !== "locked")
    .map((day) => day.day_number);
  const lockedDays = schedule
    .filter((day) => day.status === "locked")
    .map((day) => day.day_number);
  const firstIncompleteDay =
    schedule.find((day) => day.status !== "completed")?.day_number || challenge.total_days;
  const currentDay = shouldUseCadence(challenge, enrollment)
    ? Math.max(1, unlockedDays[unlockedDays.length - 1] || 1)
    : firstIncompleteDay;

  return {
    access_status: "active",
    current_day: currentDay,
    current_step: `day-${currentDay}`,
    unlocked_days: unlockedDays,
    locked_days: lockedDays,
    next_unlock_at: schedule.find((day) => day.status === "locked")?.unlock_at || null,
    day_schedule: schedule
  };
}

function buildChallengeEndAt(enrolledAt, challenge) {
  const unlockTime = parseUnlockTime(challenge.unlock_time);
  const enrolledParts = getTimeZoneParts(enrolledAt, challenge.timezone);

  return makeDateInTimeZone(
    {
      year: enrolledParts.year,
      month: enrolledParts.month,
      day: enrolledParts.day + challenge.total_days,
      hour: unlockTime.hour,
      minute: unlockTime.minute,
      second: 0
    },
    challenge.timezone
  );
}

function buildAccessExpiresAt(challengeEndAt, challenge) {
  const endParts = getTimeZoneParts(challengeEndAt, challenge.timezone);

  return makeDateInTimeZone(
    {
      ...endParts,
      day: endParts.day + challenge.post_challenge_access_days
    },
    challenge.timezone
  );
}

function emptyProgress(accessStatus) {
  return {
    access_status: accessStatus,
    current_day: 0,
    current_step: "login",
    unlocked_days: [],
    locked_days: [],
    next_unlock_at: null,
    day_schedule: []
  };
}

function makeToken(prefix) {
  const random =
    globalThis.crypto?.randomUUID?.().replaceAll("-", "") ||
    `${Date.now()}${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${random}`;
}

