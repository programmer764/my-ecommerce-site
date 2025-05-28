import React, { useEffect } from 'react';

const Success = () => {
  useEffect(() => {
    // Здесь можно добавить логику для обработки успешного завершения платежа
    alert('Оплата успешно завершена!');
  }, []);

  return (
    <div>
      <h1>Спасибо за покупку!</h1>
      <p>Ваш платеж успешно завершен.</p>
    </div>
  );
};

export default Success;
