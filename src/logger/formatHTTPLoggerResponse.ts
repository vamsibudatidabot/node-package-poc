import { Request, Response } from 'express';
import redactLogData from './redactLogData';
import { HTTPHeaders } from '../interfaces';

/**
 * 
 * @param request 
 * @param response 
 * @param responseBody 
 * @param requestStartTime 
 * @returns 
 */

export default function formatHTTPloggerResponse ( request: Request, response: Response, responseBody: any, requestStartTime?: number ) {
  let requestDuration = '.';
  if (requestStartTime) {
    const endTime = Date.now() - requestStartTime;
    requestDuration = `${endTime / 1000}s`; // ms to s
  }
    return {
      request: {
        headers: redactLogData(request?.headers),
        host: request.get('host'),
        baseUrl: request?.baseUrl,
        originalUrl: request?.originalUrl,
        requestUrl: `${request?.protocol}://${request.get('host')}${request?.originalUrl}`,
        url: request?.url,
        method: request?.method,
        body: redactLogData(request?.body),
        params: request?.params,
        query: request?.query,
        remoteIp: request?.ip,
        protocol: `HTTP/${request?.httpVersion}`,
        requestSizeRead: `${request?.socket?.bytesRead} bytes`,
        requestSizeWritten: `${request?.socket?.bytesWritten} bytes`,
        clientIp: request?.headers[HTTPHeaders.ForwardedFor] ?? request?.socket?.remoteAddress,
      },
      response: {
        headers: response?.getHeaders(),
        statusCode: response?.statusCode,
        requestDuration,
        body: redactLogData(JSON.parse(responseBody)),
        responseSize: responseBody.length,
      }
    };
  };
