import { getTestCredentials } from './__test_assets__/getTestCredentials';
import { addGoogleSheetsSpreadsheet } from './addGoogleSheetsSpreadsheet';
import { setGoogleSheetsSpreadsheetContent } from './setGoogleSheetsSpreadsheetContent';

const log = console;

describe.skip('setGoogleSheetsSpreadsheetContent', () => {
  it('should be able to set the content of a new sheet', async () => {
    const sheet = await addGoogleSheetsSpreadsheet(
      {
        title: 'test:setGoogleSheetsSpreadsheetContent',
        share: {
          email: 'name@domain.com', // todo: use spam sink
          access: 'writer',
        },
      },
      { credentials: await getTestCredentials(), log },
    );
    console.log(sheet);
    expect(sheet.title).toEqual('test:setGoogleSheetsSpreadsheetContent');

    await setGoogleSheetsSpreadsheetContent(
      {
        spreadsheetId: sheet.spreadsheetId,
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
  });
});
