import { GoogleSpreadsheet } from 'google-spreadsheet';
import { PickOne } from 'type-fns';
import { createUrl } from 'url-fns';
import {
  getResourceNameFromFileName,
  VisualogicContext,
  withLogTrail,
} from 'visualogic';
import { withRetry, withTimeout } from 'wrapper-fns';

import { GoogleSheetsApiCredentials } from '../domain';
import { castCredentialsToGoogleSheetsAuth } from './castCredentialsToGoogleSheetsAuth';

/**
 * adds a new google sheets spreadsheet
 */
export const addGoogleSheetsSpreadsheet = withLogTrail(
  withRetry(
    withTimeout(
      async <
        R extends Record<string, string | number>,
        K extends (keyof R & string)[],
      >(
        {
          title,
          share,
        }: {
          /**
           * the title of the doc
           */
          title: string;

          /**
           * who to share it with
           */
          share: PickOne<{
            /**
             * the email domain of users to share it with
             */
            domain: string;

            /**
             * the email address of the user to share it with
             */
            email: string;
          }> & {
            /**
             * the access to share
             */
            access: 'reader' | 'commenter' | 'writer';
          };
        },
        context: {
          credentials: GoogleSheetsApiCredentials;
        } & VisualogicContext,
      ): Promise<{ spreadsheetId: string; url: string; title: string }> => {
        // initialize the sheet
        const auth = castCredentialsToGoogleSheetsAuth(context);
        const doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, {
          title,
        });

        // share the doc
        await doc.share(share.domain ?? share.email, { role: share.access });

        // return the results
        return {
          spreadsheetId: doc.spreadsheetId,
          title: doc.title,
          url: createUrl({
            origin: 'https://docs.google.com',
            path: '/spreadsheets/d/:spreadsheetId',
            pathParams: { spreadsheetId: doc.spreadsheetId },
          }),
        };
      },
      {
        threshold: { seconds: 30 }, // wait up to 30 sec. anything beyond that is not likely to recover and should be retried
      },
    ),
  ),
  {
    name: getResourceNameFromFileName(__filename),
  },
);
