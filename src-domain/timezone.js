export function getTimeZoneParts(dateLike, timeZone = "America/Toronto") {
  const date = new Date(dateLike);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  const parts = formatter.formatToParts(date).reduce((accumulator, part) => {
    if (part.type !== "literal") {
      accumulator[part.type] = Number(part.value);
    }
    return accumulator;
  }, {});

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second
  };
}

export function getTimeZoneOffsetMs(dateLike, timeZone = "America/Toronto") {
  const date = new Date(dateLike);
  const parts = getTimeZoneParts(date, timeZone);
  const utcFromParts = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return utcFromParts - date.getTime();
}

export function makeDateInTimeZone(parts, timeZone = "America/Toronto") {
  const approximateUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour || 0,
    parts.minute || 0,
    parts.second || 0
  );
  const offset = getTimeZoneOffsetMs(new Date(approximateUtc), timeZone);
  return new Date(approximateUtc - offset);
}

export function parseUnlockTime(unlockTime = "08:00") {
  const [hour = "8", minute = "0"] = String(unlockTime || "08:00").split(":");
  return {
    hour: Number(hour) || 8,
    minute: Number(minute) || 0
  };
}

