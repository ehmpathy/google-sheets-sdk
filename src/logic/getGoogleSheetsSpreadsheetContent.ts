import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
  getResourceNameFromFileName,
  ProcedureContext,
  VisualogicContext,
  withLogTrail,
} from 'visualogic';
import {
  setWrapper,
  withRetry,
  withTimeout,
  withWrappers,
  Wrapper,
} from 'wrapper-fns';

import { GoogleSheetsApiCredentials } from '../domain';
import { castCredentialsToGoogleSheetsAuth } from './castCredentialsToGoogleSheetsAuth';

const logic = async <R>(
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
};

export const getGoogleSheetsSpreadsheetContent = withWrappers(logic, [
  setWrapper({
    // todo: why do we need to as Wrapper<> with the generic <R>?
    wrapper: withLogTrail as Wrapper<
      typeof logic,
      ProcedureContext<typeof withLogTrail>
    >,
    options: { name: getResourceNameFromFileName(__filename) },
  }),
  setWrapper({
    // todo: why do we need to as Wrapper<> with the generic <R>?
    wrapper: withRetry as Wrapper<
      typeof logic,
      ProcedureContext<typeof withRetry>
    >,
    options: undefined,
  }),
  setWrapper({
    // todo: why do we need to as Wrapper<> with the generic <R>?
    wrapper: withTimeout as Wrapper<
      typeof logic,
      ProcedureContext<typeof withTimeout>
    >,
    options: { threshold: { seconds: 30 } }, // wait up to 30 sec. anything beyond that is not likely to recover and should be retried
  }),
]);
