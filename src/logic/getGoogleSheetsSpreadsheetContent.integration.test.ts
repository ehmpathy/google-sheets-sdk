import { getTestCredentials } from './__test_assets__/getTestCredentials';
import { addGoogleSheetsSpreadsheet } from './addGoogleSheetsSpreadsheet';
import { getGoogleSheetsSpreadsheetContent } from './getGoogleSheetsSpreadsheetContent';
import { setGoogleSheetsSpreadsheetContent } from './setGoogleSheetsSpreadsheetContent';

const log = console;

describe.skip('getGoogleSheetsSpreadsheetContent', () => {
  it('should be able to get data from a real spreadsheet', async () => {
    const sheetCreated = await addGoogleSheetsSpreadsheet(
      {
        title: 'test:getGoogleSheetsSpreadsheetContent',
        share: {
          domain: 'ahbode.com',
          access: 'writer',
        },
      },
      { credentials: await getTestCredentials(), log },
    );
    console.log(sheetCreated);
    expect(sheetCreated.title).toEqual(
      'test:getGoogleSheetsSpreadsheetContent',
    );

    await setGoogleSheetsSpreadsheetContent(
      {
        spreadsheetId: sheetCreated.spreadsheetId,
        header: ['number', 'isPrime', 'color'],
        rows: [
          {
            number: 3,
            isPrime: true,
            color: '',
          },
          {
            number: 7,
            isPrime: true,
            color: '',
          },
          {
            number: 21,
            isPrime: false,
            color: '',
          },
        ],
        validations: [
          {
            option: {
              column: 'color',
              choices: ['RED', 'GREEN', 'YELLOW'],
            },
          },
        ],
      },
      { credentials: await getTestCredentials(), log },
    );

    const sheetFound = await getGoogleSheetsSpreadsheetContent(
      {
        spreadsheetId: sheetCreated.spreadsheetId,
      },
      { credentials: await getTestCredentials(), log },
    );
    expect(sheetFound.title).toEqual('test:getGoogleSheetsSpreadsheetContent');
    expect(sheetFound.rows.length).toEqual(3);
  });
});
