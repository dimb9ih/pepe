// api/log.js
export default function handler(request, response) {
  // 1. Настраиваем CORS, чтобы браузер не блокировал запросы от игры
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Быстрый ответ на предварительные проверки браузера
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 3. Обрабатываем лог, который пришёл из игры
  if (request.method === 'POST') {
    try {
      const gameLog = request.body;
      const logMessage = `[${new Date().toISOString()}] Сообщение от игры: ${gameLog.message}`;

      // Самое важное! Эта строка появится в логах Vercel
      console.log('📝 Игровой лог:', logMessage);

      // Говорим игре, что всё получили
      return response.status(200).json({
        status: 'Успех',
        received: gameLog
      });
    } catch (err) {
      console.error('❌ Ошибка:', err);
      return response.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // 4. Если запрос не POST, говорим, что метод не поддерживается
  return response.status(405).json({ error: 'Используйте метод POST' });
}
