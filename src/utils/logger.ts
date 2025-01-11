import * as winston from 'winston';

interface LogLevelMappingType {
    [key: string]: string;
}

export const LogLevelMapping: LogLevelMappingType = {
    info: '[I]',
    error: '[E]',
    warn: '[W]',
    debug: '[D]',
};

const logFormat = winston.format.printf((info) => {
    const formattedDate = String(info.timestamp).replace('T', ' ').replace('Z', '');
    return `${formattedDate} ${LogLevelMapping[info.level] || info.level} ${info.message}`;
});

const transports = [
    new winston.transports.Console(),
];

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat,
    ),
    defaultMeta: { service: 'carventory-api' },
    transports,
});

export default logger;