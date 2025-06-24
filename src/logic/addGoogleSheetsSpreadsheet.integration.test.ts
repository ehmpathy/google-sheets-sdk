import { getTestCredentials } from './__test_assets__/getTestCredentials';
import { addGoogleSheetsSpreadsheet } from './addGoogleSheetsSpreadsheet';

const log = console;

describe.skip('addGoogleSheetsSpreadsheet', () => {
  it('should be able to create a new sheet', async () => {
    const sheet = await addGoogleSheetsSpreadsheet(
      {
        title: 'test:addGoogleSheetsSpreadsheet',
        share: {
          email: 'name@domain.com', // todo: use spam sink
          access: 'writer',
        },
      },
      { credentials: await getTestCredentials(), log },
    );
    console.log(sheet);
    expect(sheet.title).toEqual('test:addGoogleSheetsSpreadsheet');
  });
});
