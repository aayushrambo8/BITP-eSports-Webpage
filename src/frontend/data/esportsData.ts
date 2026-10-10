export interface FestivalGame {
  id: string;
  name: string;
  tag: string;
  divisionBadge: string;
  category: string;
  description: string;
  league: string;
}

export interface TournamentEvent {
  id: string;
  title: string;
  dateStr: string;
  timeStr: string;
  endTimeStr?: string | null;
  isoDate: string;
  discipline: string;
  location: string;
  locationSub: string;
  format: string;
  formatSub: string;
  statusBadge: string;
  description?: string;
  posterUrl?: string | null;
  slotsFilled?: number;
  slotsTotal?: number;
}

export function formatEventTime(event: { timeStr: string; endTimeStr?: string | null }): string {
  if (!event.endTimeStr) return event.timeStr;
  return `${event.timeStr} - ${event.endTimeStr}`;
}

export function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  const cleaned = timeStr.trim();
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    return { hours: parseInt(match24[1], 10), minutes: parseInt(match24[2], 10) };
  }
  const match12 = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? parseInt(match12[2], 10) : 0;
    const period = match12[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }
  return null;
}

export function isEventEndedIST(event: TournamentEvent, now: Date = new Date()): boolean {
  if (event.statusBadge?.toUpperCase() === 'COMPLETED' || event.statusBadge?.toUpperCase() === 'ARCHIVED') {
    return true;
  }
  const startDate = new Date(event.isoDate);
  if (Number.isNaN(startDate.getTime())) return false;

  const formatISTDate = (date: Date) => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  const pad = (value: number) => value.toString().padStart(2, '0');
  const toISTDate = (date: Date, hours: number, minutes: number) =>
    new Date(`${formatISTDate(date)}T${pad(hours)}:${pad(minutes)}:00+05:30`);

  if (event.endTimeStr) {
    const endTime = parseTimeString(event.endTimeStr);
    if (endTime) {
      const endDate = toISTDate(startDate, endTime.hours, endTime.minutes);
      const startTime = parseTimeString(event.timeStr);
      if (
        startTime &&
        (endTime.hours < startTime.hours ||
          (endTime.hours === startTime.hours && endTime.minutes < startTime.minutes))
      ) {
        endDate.setDate(endDate.getDate() + 1);
      }
      if (!Number.isNaN(endDate.getTime())) return endDate.getTime() <= now.getTime();
    }
  }

  const startTime = parseTimeString(event.timeStr);
  if (startTime) {
    const endHour = (startTime.hours + 2) % 24;
    const endDate = toISTDate(startDate, endHour, startTime.minutes);
    if (startTime.hours + 2 >= 24) endDate.setDate(endDate.getDate() + 1);
    if (!Number.isNaN(endDate.getTime())) return endDate.getTime() <= now.getTime();
  }

  return startDate.getTime() <= now.getTime();
}
