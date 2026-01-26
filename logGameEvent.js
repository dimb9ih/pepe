// netlify/functions/logGameEvent.js
exports.handler = async function(event, context) {
  // 1. Разрешаем запросы с любого домена (CORS) - важно для WebGL!
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 2. Обрабатываем предварительный запрос OPTIONS (требуется для CORS)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // 3. Обрабатываем основной POST-запрос с логами
  if (event.httpMethod === 'POST') {
    try {
      const gameLog = JSON.parse(event.body); // Данные из Unity
      const logMessage = `[${new Date().toISOString()}] ${gameLog.message}\n`;

      // 4. Здесь можно отправить лог во внешний сервис,
      // сохранить в базу данных или просто вывести в консоль Netlify.
      // Для простоты просто выводим в консоль функции.
      console.log('Игровой лог:', logMessage);

      // 5. Отвечаем клиенту (игре), что всё успешно
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'Лог записан', received: gameLog })
      };
    } catch (err) {
      console.error('Ошибка обработки лога:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Не удалось обработать лог' })
      };
    }
  }

  // 6. Если метод не POST и не OPTIONS, возвращаем ошибку
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Метод не разрешен' })
  };
}
