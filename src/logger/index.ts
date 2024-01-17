import redactLogData from './redactLogData';
import { x_request_headers } from '../middleware/loggerResponseInterceptor';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const SERVICE_NAME = 'dabot-service';
const DD_APPKEY = 'dabot-service-container';
const NODE_ENV_LOCAL = 'local';
export const DD_ENV = process.env?.NODE_ENV !== 'undefined' ? process.env?.NODE_ENV : NODE_ENV_LOCAL;
export const DD_VERSION = 'alpha_1.0.0';
const httpTransportOptions = {
    host: process.env?.DATADOG_HOST,
    path: `/api/v2/logs?dd-api-key=${process.env?.DATADOG_API_KEY}&ddsource=nodejs&service=${SERVICE_NAME}&dd-app-key=${DD_APPKEY}&env=${DD_ENV}&version=${DD_VERSION}`,
    // ssl: true,
    // Send everything to DataDog and we'll filter in the index options.
    level: 'debug',
    silent: false,
    handleExceptions: true,
};
const rotateLogFilesTransport: DailyRotateFile = new DailyRotateFile({
    filename: './logs/dabot-service.log.%DATE%', // file name includes current date
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false, // zip logs true/false
    maxSize: '20m', // rotate if file size exceeds 20 MB
    maxFiles: '10d', // max files
    dirname: 'logs'
  });

  rotateLogFilesTransport.on('rotate', function(oldFilename: string, newFilename: string) {
    loggerInstance.info(`Rotating JSON logs of ${SERVICE_NAME} from %s to %s.`, { oldFilename: oldFilename, newFilename: newFilename });
  });

const { combine, timestamp, json } = winston.format;
const timestampFormat = 'YYYY-MM-DD HH:mm:ss';
const loggerInstance = winston.createLogger({
    level: 'debug',
    levels: winston.config.syslog.levels,
    defaultMeta: { service: SERVICE_NAME, env: DD_ENV, version: DD_VERSION },
    format: combine(
        timestamp({ format: timestampFormat }),
        json(),
    ),
    transports: [
        new winston.transports.Console({ handleExceptions: true }),
        // Commented the HTTP transport option for datadog, will remove once DAB-651 is tested in QA.
        // new winston.transports.Http(httpTransportOptions),
        new winston.transports.File({ filename: './logs/dabot-service.log', dirname: 'logs' }),
        rotateLogFilesTransport,
    ],
    silent: false,
    exitOnError: false
});

// export { loggerInstance };

const logger = {
    info: (msg: string, data?: any) => loggerInstance.info(msg, redactLogData(data, x_request_headers)),
    
    error: (msg: string, data?: any) => loggerInstance.error(msg, redactLogData(data, x_request_headers)),
    
    debug: (msg: string, data?: any) => loggerInstance.debug(msg, redactLogData(data, x_request_headers)),

    warning: (msg: string, data?: any) => loggerInstance.warning(msg, redactLogData(data, x_request_headers)),

    crit: (msg: string, data?: any) => loggerInstance.crit(msg, redactLogData(data, x_request_headers)),
};

export { logger };
