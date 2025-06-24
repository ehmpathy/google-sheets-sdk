import { JWT } from 'google-auth-library';

import { GoogleSheetsApiCredentials } from '../domain';

export const castCredentialsToGoogleSheetsAuth = (input: {
  credentials: GoogleSheetsApiCredentials;
}): JWT =>
  new JWT({
    email: input.credentials.serviceAccountEmail,
    key: input.credentials.serviceAccountPrivateKey
      .replace(/\\n/g, '\n') // replace the string `\n` (identified by `\\n`) with the newline operator `\n` (identified by `\n`), when present
      .trim(),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file', // required for share ability
    ],
  });
