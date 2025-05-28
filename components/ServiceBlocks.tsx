const services = [
  {
    icon: "/icons/serv1.svg",
    title: "Согласование установки\nоборудования",
  },
  {
    icon: "/icons/serv2.png",
    title: "Установка\nкондиционера",
  },
  {
    icon: "/icons/serv3.svg",
    title: "Обслуживание\nкондиционера",
  },
  {
    icon: "/icons/serv4.svg",
    title: "Быстрая доставка\nпо Санкт-Петербургу",
  },
];

export default function ServiceBlocks() {
  return (
    <div className="bg-blue-300 py-10 px-4 rounded ">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <img
                src={service.icon}
                alt="service icon"
                className="w-14 h-14 object-contain mx-auto"
              />
              <p className="mt-3 text-base font-medium whitespace-pre-line">
                {service.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
