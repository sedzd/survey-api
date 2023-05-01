import { LoggerOptions } from 'pino';

import { AppConfig } from 'src/config';

const level = AppConfig.nodeEnv === 'test' ? 'silent' : 'info';

const transport = {
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:yy-mm-dd HH:MM:ss'
    }
};

export const loggerOption: LoggerOptions = {
    level,
    ...(AppConfig.appEnv === 'local' && { transport })
};
