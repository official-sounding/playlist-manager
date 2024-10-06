import { DurationFormat } from '@formatjs/intl-durationformat';
import { intervalToDuration } from 'date-fns';

const formatter = new DurationFormat('en', { style: 'digital', hoursDisplay: 'auto' });

export function prettyPrintDuration(seconds: number): string {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatter.format(duration);
}
