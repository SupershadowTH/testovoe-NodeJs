import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import 'dotenv/config'

export default async (clients_data) => {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_EMAIL_LOGIN,
    key: process.env.GOOGLE_KEY_LOGIN,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

  await doc
    .loadInfo()
    .then(async () => {
      console.log(`Документ загружен\nИмя документа: ${doc.title}`);

      if (clients_data[0]) {
        const params = Object.keys(clients_data[0]);
        const sheet = await doc.addSheet({ headerValues: params });

        sheet.addRows(clients_data);
        console.log(`Ссылка на документ:`);
        console.log(doc._spreadsheetUrl);
      } else {
        return;
      }
    })
    .catch(() => {
      console.log("Ошибка загрузки документа");
    });
};
