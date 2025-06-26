const ClimatePromoSection = () => {
  return (
    <section className="bg-blue-300 text-white py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* Заголовок и Фото рядом */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/benefit/benefit4.jpg"
              alt="Фото кондиционера или команды"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-6">
              Качество, которому доверяют<br className="hidden md:block" />
              более 5000 довольных клиентов
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-white">
              Мы создаём климат, в котором хочется жить. От подбора модели до финального тестирования — каждый этап под контролем профессионалов.
            </p>
          </div>
        </div>

        {/* Текстовые блоки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg md:text-xl leading-relaxed">
          <p>
            Наши решения — это не просто холод или тепло. Это тишина, чистый воздух, экономия на счётах и уверенность в завтрашнем дне. Мы подбираем технику под стиль жизни, а не по каталогу.
          </p>
          <p>
            Мы не любим шаблонные подходы. Каждый объект — индивидуальный. Мы выезжаем, оцениваем, консультируем и только потом предлагаем оптимальные модели и монтаж.
          </p>
          <p>
            Наши мастера — это не просто монтажники, это сертифицированные специалисты, прошедшие обучение у ведущих производителей. Работы выполняются аккуратно, точно в срок и без лишней пыли.
          </p>
          <p>
            70% новых заказов мы получаем по рекомендации. Потому что умеем слушать, честно говорить и делать всё, как себе. И мы этим гордимся.
          </p>
        </div>

        {/* Преимущества с фото */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
          <div className="text-center md:text-left">
            <img
              src="/benefit/benefit1.jpg"
              alt="Экономия"
              className="w-full h-40 object-cover rounded-xl shadow-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">⚡ До 40% экономии</h3>
            <p>
              Инверторные системы последнего поколения снижают потребление электроэнергии и работают бесшумно.
            </p>
          </div>
          <div className="text-center md:text-left">
            <img
              src="/benefit/benefit2.jpg"
              alt="Опыт"
              className="w-full h-40 object-cover rounded-xl shadow-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">🏆 15 лет опыта</h3>
            <p>
              Мы знаем все нюансы и подводные камни установки — от квартир до крупных коммерческих объектов.
            </p>
          </div>
          <div className="text-center md:text-left">
            <img
              src="/benefit/benefit3.jpg"
              alt="Сервис"
              className="w-full h-40 object-cover rounded-xl shadow-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">🛠 Сервис под ключ</h3>
            <p>
              Подбор, поставка, установка, обслуживание. Всё в одном месте. Без лишней головной боли.
            </p>
          </div>
        </div>

        {/* Кнопка */}
        <div className="mt-12 md:text-left text-center">
          <button className="bg-white text-blue-700 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition">
            Заказать консультацию
          </button>
        </div>

      </div>
    </section>
  );
};

export default ClimatePromoSection;
