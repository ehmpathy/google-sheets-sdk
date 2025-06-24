import { getConfig } from '../../../../../utils/config/getConfig';
import { GoogleSheetsApiCredentials } from '../../domain';

export const getTestCredentials =
  async (): Promise<GoogleSheetsApiCredentials> => {
    const config = await getConfig();
    return {
      serviceAccountEmail: config.google.sheets.api.serviceAccount.email,
      serviceAccountPrivateKey:
        config.google.sheets.api.serviceAccount.privateKey,
    };
  };
