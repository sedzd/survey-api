import { format } from 'date-fns';

export const ISO8601date = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss');
