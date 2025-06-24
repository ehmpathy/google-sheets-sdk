# google-sheets-sdk

![test](https://github.com/ehmpathy/google-sheets-sdk/workflows/test/badge.svg)
![publish](https://github.com/ehmpathy/google-sheets-sdk/workflows/publish/badge.svg)

A simple interface for google sheets usage

# purpose

1. declare an intuitive definitions of google-sheets constructs

2. create a pit of success for google-sheets utilization

# install

```sh
npm install google-sheets-sdk
```

# use

### authenticate

finsert a service account in the google cloud console and grab its credentials

```ts
  export interface GoogleSheetsApiCredentials {
    serviceAccountEmail: string;
    serviceAccountPrivateKey: string;
  }

  // use these credentials downstream
  const credentials: GoogleSheetsApiCredentials = {
    serviceAccountEmail: '__your_service_account_email__',
    serviceAccountPrivateKey: '__your_service_account_privatekey__',
  }
```

### `addGoogleSheetsSpreadsheet`

create a spreadsheet

```ts
  const sheet = await addGoogleSheetsSpreadsheet(
    {
      title: 'test:addGoogleSheetsSpreadsheet',
      share: {
        email: 'yourname@yourdomain.com',
        access: 'writer',
      },
    },
    { credentials, log },
  );
  console.log(sheet);
  expect(sheet.title).toEqual('test:addGoogleSheetsSpreadsheet');
```

### `setGoogleSheetsSpreadsheetContent`

write to a spreadsheet

```ts
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
            choices: ['RED', 'GREEN', 'YELLOW'], // dropdown! 🔥
          },
        },
      ],
    },
    { credentials, log },
  );
```


### `getGoogleSheetsSpreadsheetContent`

read from a spreadsheet

```ts
  const sheetFound = await getGoogleSheetsSpreadsheetContent(
    {
      spreadsheetId: sheetCreated.spreadsheetId,
    },
    { credentials: await getTestCredentials(), log },
  );
  expect(sheetFound.title).toEqual('test:getGoogleSheetsSpreadsheetContent');
  expect(sheetFound.rows.length).toEqual(3);
```
