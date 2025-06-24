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

export const setGoogleSheetsSpreadsheetContent = withLogTrail(
  withRetry(
    withTimeout(
      async <
        R extends Record<string, string | number | boolean | Date>,
        K extends (keyof R & string)[],
      >(
        {
          spreadsheetId,
          sheetIndex = 0,
          header,
          rows,
          validations,
        }: {
          spreadsheetId: string;

          /**
           * which "sheet" within the "spreadsheet"
           */
          sheetIndex?: number;

          /**
           * the header to set
           */
          header: K;

          /**
           * the rows to set
           */
          rows: R[];

          /**
           * any validations to add
           */
          validations?: PickOne<{
            option: {
              column: K[number];
              choices: string[];
            };
          }>[];
        },
        context: {
          credentials: GoogleSheetsApiCredentials;
        } & VisualogicContext,
      ): Promise<{ url: string; title: string; header: K; rows: R[] }> => {
        // initialize the sheet
        const auth = castCredentialsToGoogleSheetsAuth(context);
        const doc = new GoogleSpreadsheet(spreadsheetId, auth);

        // load the sheet
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByIndex[sheetIndex]!; // picks the specified sheet in the doca

        // write the contents
        await sheet.setHeaderRow(header); // This is the header row.
        await sheet.addRows(rows); // Your value is put to the sheet.

        // set the validations
        for (const validation of validations ?? []) {
          // if its an option validation, handle it
          if (validation.option) {
            const columnIndex = header.indexOf(validation.option.column);
            // todo: enable this once the upstream package gets the pr merged
            // await sheet.setDataValidation({
            //   range: {
            //     startRowIndex: 1,
            //     endRowIndex: rows.length + 1,
            //     startColumnIndex: columnIndex,
            //     endColumnIndex: columnIndex + 1,
            //   },
            //   rule: {
            //     condition: {
            //       type: 'ONE_OF_LIST',
            //       values: validation.option.choices.map((choice) => ({
            //         userEnteredValue: choice,
            //       })),
            //     },
            //     showCustomUi: true,
            //     strict: true,
            //   },
            // });
          }
        }

        // return the results
        return {
          url: createUrl({
            origin: 'https://docs.google.com',
            path: '/spreadsheets/d/:spreadsheetId',
            pathParams: { spreadsheetId },
          }),
          title: doc.title,
          header,
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
