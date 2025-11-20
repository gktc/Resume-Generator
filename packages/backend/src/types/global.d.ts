import { ParsedResume } from '../services/resume-parser.service';
import { TokenPayload } from '../utils/jwt';

declare global {
  var parsedResumeCache: Map<string, ParsedResume> | undefined;

  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
