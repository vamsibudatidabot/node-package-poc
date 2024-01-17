import { logger } from "logger";
import { Request, Response, NextFunction } from 'express';
import formatHTTPloggerResponse from "logger/formatHTTPLoggerResponse";

 /**
   * 
   * @param request 
   * @param response 
   * @param next 
   */

export let x_request_headers: any;

export default function loggerResponseInterceptor(req: Request, res: Response, next: NextFunction) {
  
  x_request_headers = { ['x-correlation-id'] : req?.headers?.['x-correlation-id'], 
                        ['x-session-id'] : req?.headers?.['x-session-id'],
                        ['x-user-id'] : req?.headers?.['x-user-id'] };

  const requestStartTime = Date.now();

  // Save the original response method
  const originalSend = res.send;

  // Create a flag to track whether the response has been sent
  let responseSent = false;

  // Override the response method
  res.send = function (body: any): Response {
    // Log the response body or any other data you want to track
    // responseSent is used to block the same request from been sent twice
    if (!responseSent) {
      if (res.statusCode < 400) {
        logger.info(`${req?.method} ${req?.originalUrl} ${res?.statusCode}`, formatHTTPloggerResponse(req, res, body, requestStartTime));
      } else {
        logger.error(`${req?.method} ${req?.originalUrl} ${res?.statusCode}`, formatHTTPloggerResponse(req, res, body, requestStartTime));
      }

      responseSent = true;
    }
    // Call the original response method
    return originalSend.call(this, body);
  };

  // Continue processing the request
  next();
  };
