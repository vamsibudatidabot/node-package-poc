import { SensitiveKeys } from '../interfaces';
import { SpecialMessages } from '../interfaces';

const sensitiveKeysList = Object.values(SensitiveKeys) as string[];

/**
 * 
 * @param data 
 * @returns 
 */

// Used to obscure senstitive information from logs, such as passwords
const redactLogData = (data: any, x_request_headers?: any): any => {
  // we check if !data.constructor.name.startsWith('model')
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => redactLogData(item));
    }

    const redactedData: any = {};

    for (const key in data) {
      if (sensitiveKeysList.includes(key)) {
        redactedData[key] = SpecialMessages.Redacted;
      } else {
        // Recursively redact sensitive keys within nested objects
        redactedData[key] = redactLogData(data[key]);
      }
    }

    return { ...redactedData, ['x-request-headers'] : x_request_headers || null };
  } else {
    return data;
  }
};

export default redactLogData;
