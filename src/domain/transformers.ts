import { ValueTransformer } from 'typeorm';

import { ISO8601date } from 'src/libs/utils';

export const toISO8601: ValueTransformer = {
    to: (date) => date,
    from: (date: Date) => ISO8601date(date)
};
