import { collectDefaultMetrics, Registry } from 'prom-client';

// Создаем отдельный регистр для избежания конфликтов
const registry = new Registry();
collectDefaultMetrics({ register: registry });

export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', registry.contentType);
    const metrics = await registry.metrics();
    res.send(metrics);
  } catch (err) {
    console.error('Error generating metrics:', err);
    res.status(500).send(err.message);
  }
}