import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import config from "../config.js";

export default async (clients_data) => {
  const serviceAccountAuth = new JWT({
    email: config.google_email,
    key: config.google_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    config.sheet_id,
    serviceAccountAuth
  );

  await doc.loadInfo().then(async ()=>{
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
  }
  ).catch(()=> {
    console.log("Ошибка загрузки документа")
  });
  
};

