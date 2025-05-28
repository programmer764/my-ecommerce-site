import { MongoClient, ObjectId } from 'mongodb'; // Импортируем ObjectId
import Image from 'next/image';

const uri = process.env.MONGODB_URI; // Замените на свой URL MongoDB
const dbName = 'dbcom'; // Название вашей базы данных

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection('dbcom2'); // Название коллекции

    // Ищем товар по его _id
    const product = await collection.findOne({ _id: new ObjectId(id) });

    client.close();

    if (!product) {
      return {
        notFound: true, // Если товар не найден
      };
    }

    // Преобразуем _id в строку перед передачей в компонент
    product._id = product._id.toString(); // Преобразуем ObjectId в строку

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error("Error while fetching product:", error); // Логируем ошибку для диагностики
    return {
      props: {
        error: 'Ошибка при загрузке данных', // Отображаем ошибку, если не удалось подключиться или получить данные
      },
    };
  }
}

export default function ProductPage({ product, error }) {
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-page">
      <h1 className="text-center text-3xl font-bold">{product.name}</h1>

      <Image
         src={`/images/${product.image}`}

        alt={product.name}
        width={500}
        height={500}
        objectFit="contain"
        className="mx-auto my-6" // Центрируем изображение
      />

      {/* Область характеристик с синем фоном, ширина 1/3 экрана */}
      <div className="bg-[#79bef7] text-white p-6 mt-6 mx-auto rounded-lg w-1/3">
        <h2 className="text-center text-2xl font-semibold mb-4">Характеристики</h2>
        <ul className="list-none pl-0">
          {product.characteristics.map((char, index) => (
            <li key={index} className="flex justify-between mb-4">
              <strong className="text-left">{char.name}:</strong>
              <span className="text-right">{char.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ссылка для перехода */}
      <div className="text-center mt-6">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:underline"
        >
          Перейти к товару на сайте
        </a>
      </div>
    </div>
  );
}