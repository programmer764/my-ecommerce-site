import { useState } from 'react';

const comments = [
    {
        id: 1,
        name: 'Ирина Петрова',
        avatar: '/avatars/irina.jpg',
        text: 'Очень довольна покупкой! Кондиционер отлично справляется с жарой. Работает тихо, быстро охлаждает комнату. Установка прошла без проблем, мастера приехали в день заказа. Буду советовать друзьям и родственникам!',
    },
    {
        id: 2,
        name: 'Алексей Смирнов',
        avatar: '/avatars/alexey.jpg',
        text: 'Купил кондиционер для офиса. Отличный вариант по цене и качеству. Подключение заняло всего пару часов. Очень понравилась консультация менеджера — помогли подобрать оптимальный вариант под площадь помещения.',
    },
    {
        id: 3,
        name: 'Ольга Иванова',
        avatar: '/avatars/olga.jpg',
        text: 'Пользуюсь кондиционером уже месяц, нареканий нет. Очень удобно управлять с пульта, режим обогрева тоже отлично работает. Благодарю за качественный монтаж и быструю доставку.',
    },
    {
        id: 4,
        name: 'Дмитрий Кузнецов',
        avatar: '/avatars/dmitry.jpg',
        text: 'Сервис на уровне! Приехали вовремя, аккуратно всё установили. Кондиционер инверторный — реально экономит электричество. Работает тише, чем ожидал. Спасибо команде!',
    },
];

export default function ConditionerReviews() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevComment = () => {
        setCurrentIndex((prev) => (prev === 0 ? comments.length - 1 : prev - 1));
    };

    const nextComment = () => {
        setCurrentIndex((prev) => (prev === comments.length - 1 ? 0 : prev + 1));
    };

    const { name, avatar, text } = comments[currentIndex];

    return (
        <section className="bg-white text-black py-20 px-6 max-w-6xl mx-auto font-sans relative">
            
            <div className="flex-1 max-w-md">
                <h2 className="text-3xl l md:text-3xl font-bold mb-16">
                    Что говорят наши клиенты
                    Мы гордимся тем, что более 5000 клиентов доверили нам подбор и установку климатического оборудования.
                </h2>
            </div>

          <div className="relative max-w-4xl mx-auto min-h-[600px] px-0">
  {/* Левая кнопка */}
  <button
    onClick={prevComment}
    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black text-white w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-800 transition z-10"
    aria-label="Предыдущий отзыв"
  >
    ←
  </button>

  {/* Контент с отступами, чтобы не налезать на кнопки */}
  <div className="mx-auto max-w-4xl px-24 flex flex-col md:flex-row items-start gap-8">
    <img
      src={avatar}
      alt={`Фото ${name}`}
      className="w-60 h-60 rounded-full object-cover shadow-md flex-shrink-0"
    />
    <div className="flex-1 text-3xl leading-loose font-light">
      “{text}”
      <p className="mt-6 font-semibold text-xl text-right">— {name}</p>
    </div>
  </div>

  {/* Правая кнопка */}
  <button
    onClick={nextComment}
    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black text-white w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-800 transition z-10"
    aria-label="Следующий отзыв"
  >
    →
  </button>
</div>



        </section>
    );
}
