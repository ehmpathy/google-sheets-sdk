import { UnexpectedCodePathError } from 'helpful-errors';

import { GoogleSheetsApiCredentials } from '../../domain';

export const getTestCredentials =
  async (): Promise<GoogleSheetsApiCredentials> => {
    return {
      serviceAccountEmail:
        process.env.PREP_SERVICE_ACCOUNT_EMAIL ??
        UnexpectedCodePathError.throw(
          // fail fast
          'no env.PREP_SERVICE_ACCOUNT_EMAIL found',
        ),
      serviceAccountPrivateKey:
        process.env.PREP_SERVICE_ACCOUNT_PRIVATEKEY ??
        UnexpectedCodePathError.throw(
          // fail fast
          'no env.PREP_SERVICE_ACCOUNT_PRIVATEKEY found',
        ),
    };
  };
