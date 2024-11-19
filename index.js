import { createUser, getClients, getClientsStatuses, loginUser } from "./api/index.js";
import sheetsmodule from "./modules/google_sheets.js"
import 'dotenv/config'

const login = (username) => {
  return new Promise(async (resolve, reject) => {
    await createUser(username)
      .then((regValue) => {
        resolve({
          auth: true,
          token: regValue.data.token,
        });
      })
      .catch(async (err) => {
        console.log(err.response.data.message);
        await loginUser(username)
          .then((loginValue) => {
            resolve({
              auth: true,
              token: loginValue.data.token,
            });
          })
          .catch((err) => {
            console.log(err);
            reject({
              auth: false,
            });
          });
      });
  });
};

const getClientsData = async (token) => {
  return new Promise(async (resolve, reject) => {
    await getClients(token)
      .then(async (clients) => {
        const usersIds = clients.data.map((el) => el.id);
        await getClientsStatuses(token, usersIds)
          .then((statuses) => {
            resolve({
              status: true,
              data: clients.data.map((el) => {
                return {
                  ...el,
                  status: statuses.data.find(st => st.id === el.id).status,
                };
              }),
            });
          })
          .catch((err) => {
            console.log(err);
            reject({
              status: false,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        reject({
          status: false,
        });
      });
  });
};

const main = async () => {
  console.log(`Имя пользователя: ${process.env.SERVER_USERNAME}`);
  const authData = await login(`${process.env.SERVER_USERNAME}`);
  if (authData.auth) {
    console.log("Авторизирован");
    const clientData = await getClientsData(authData.token);
    sheetsmodule(clientData.data);
  } else {
    console.log("Авторизация провалилась, проверьте файлы конфигурации или доступ к серверу!");
  }
};

main();
