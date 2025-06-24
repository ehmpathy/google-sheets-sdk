import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
  getResourceNameFromFileName,
  VisualogicContext,
  withLogTrail,
} from 'visualogic';
import { withRetry, withTimeout } from 'wrapper-fns';

import { GoogleSheetsApiCredentials } from '../domain';
import { castCredentialsToGoogleSheetsAuth } from './castCredentialsToGoogleSheetsAuth';

export const getGoogleSheetsSpreadsheetContent = withLogTrail(
  withRetry(
    withTimeout(
      async <R>(
        {
          spreadsheetId,
        }: {
          spreadsheetId: string;
        },
        context: {
          credentials: GoogleSheetsApiCredentials;
        } & VisualogicContext,
      ): Promise<{ title: string; columns: string[]; rows: R[] }> => {
        // initialize the sheet
        const auth = castCredentialsToGoogleSheetsAuth(context);
        const doc = new GoogleSpreadsheet(spreadsheetId, auth);

        // return the contents
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]!; // picks the first sheet in the doc
        const sheetRows = await sheet.getRows();
        const columns = sheet.headerValues;
        const rows = sheetRows.map((row) => row.toObject()) as R[];
        return {
          title: doc.title,
          columns,
          rows,
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
