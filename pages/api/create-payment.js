import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Импортируем генератор UUID

const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    try {
      console.log('Shop ID:', shopId);
      console.log('Secret Key:', secretKey ? 'Loaded' : 'Not Found');

      const authHeader = `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`;
      const idempotenceKey = uuidv4(); // Генерируем уникальный ключ

      const paymentResponse = await axios.post(
        'https://api.yookassa.ru/v3/payments',
        {
          amount: {
            value: amount,
            currency: 'RUB',
          },
          confirmation: {
            type: 'redirect',
            return_url: 'http://localhost:3000/success',
          },
          capture: true, // Удалил `capture_mode`, так как API ждет `capture`
        },
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'Idempotence-Key': idempotenceKey, // Добавили этот заголовок
          },
        }
      );

      if (paymentResponse && paymentResponse.data) {
        return res.status(200).json({
          confirmationUrl: paymentResponse.data.confirmation.confirmation_url,
        });
      } else {
        return res.status(500).json({
          error: 'Ошибка при обработке платежа',
          details: 'Не удалось получить данные о подтверждении',
        });
      }
    } catch (error) {
      console.error('Ошибка при создании платежа:', error.response?.data || error.message);
      return res.status(500).json({
        error: 'Ошибка при создании платежа',
        details: error.response?.data || error.message,
      });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
