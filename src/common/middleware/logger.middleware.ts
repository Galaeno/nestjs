import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    let msg = `[URL][${req.originalUrl}][${req.method}]`;

    if (req.body) {
      msg += `[${JSON.stringify(req.body)}]`;
    }
    console.log(msg);

    next();
  }
}
