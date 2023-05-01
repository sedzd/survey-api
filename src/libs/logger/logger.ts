import pino from 'pino';

import { loggerOption } from './utils';

export const logger = pino(loggerOption);
