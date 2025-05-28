const fetch = require('node-fetch'); // npm install node-fetch@2

const URL = 'https://metaplast.biz/api/products';

(async () => {
  const requests = [];

  for (let i = 0; i < 1000; i++) {
    const req = fetch(URL)
      .then(res => console.log(`Запрос ${i + 1}: ${res.status}`))
      .catch(err => console.error(`Ошибка запроса ${i + 1}:`, err.message));

    requests.push(req);
  }

  // Ждём завершения всех параллельных запросов
  await Promise.all(requests);
})();
