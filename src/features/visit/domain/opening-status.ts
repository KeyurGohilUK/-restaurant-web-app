export type OpeningHoursEntry = {
  day: string;
  hours: string;
};

export type OpeningStatus = {
  isOpen: boolean;
  label: 'Open now' | 'Closed now';
  detail: string;
};

const londonClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getOpeningStatus = (
  openingHours: readonly OpeningHoursEntry[],
  at: Date = new Date(),
): OpeningStatus => {
  const parts = londonClock.formatToParts(at);
  const day = parts.find(({ type }) => type === 'weekday')?.value;
  const hour = Number(parts.find(({ type }) => type === 'hour')?.value);
  const minute = Number(parts.find(({ type }) => type === 'minute')?.value);
  const today = openingHours.find((entry) => entry.day === day);
  const hoursMatch = today?.hours.match(/^(\d{2}:\d{2})–(\d{2}:\d{2})$/);

  if (!hoursMatch || !Number.isFinite(hour) || !Number.isFinite(minute)) {
    return { isOpen: false, label: 'Closed now', detail: '' };
  }

  const currentMinutes = hour * 60 + minute;
  const opensAt = toMinutes(hoursMatch[1]);
  const closesAt = toMinutes(hoursMatch[2]);
  const isOpen = currentMinutes >= opensAt && currentMinutes < closesAt;

  return {
    isOpen,
    label: isOpen ? 'Open now' : 'Closed now',
    detail: isOpen ? `Closes ${hoursMatch[2]}` : '',
  };
};
