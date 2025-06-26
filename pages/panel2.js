import {
  TruckIcon,
  ClockIcon,
  GiftIcon,
  BanknotesIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function DeliveryInfo() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 space-y-8 max-w-4xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold text-center">Доставка и оплата</h2>

      <div className="space-y-6">
        <Section
          icon={<TruckIcon className="w-6 h-6 text-blue-500" />}
          title="Доставка по Санкт-Петербургу"
          text="Компания Climat Trade AM предоставляет доставку оборудования по Санкт-Петербургу и Ленинградской области."
        />

        <Section
          icon={<ClockIcon className="w-6 h-6 text-green-500" />}
          title="Время доставки"
          text="Будние дни с 10:00 до 23:00. Водитель согласует с вами удобное время за день до доставки и позвонит за 1–2 часа до прибытия."
        />

        <Section
          icon={<GiftIcon className="w-6 h-6 text-pink-500" />}
          title="Стоимость доставки"
          text={
            <>
              <p><strong>АКЦИЯ:</strong> Бесплатная доставка при заказе от 50 000 ₽ по Санкт-Петербургу (в пределах КАД).</p>
              <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                <li>Доставка по СПб — от 1200 ₽</li>
                <li>По ЛО — от 1200 ₽</li>
                <li>По России и СНГ — по тарифам ТК</li>
              </ul>
              <p className="mt-2">Доставка в течение 3 дней при наличии товара на складе. Выходные и праздники — по договорённости.</p>
            </>
          }
        />

        <Section
          icon={<ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />}
          title="Внимание"
          text="Товар доставляется до подъезда или проходной. Подъём, занос, перемещение по территории — оплачиваются отдельно и обсуждаются с водителем."
        />

        <Section
          icon={<BanknotesIcon className="w-6 h-6 text-indigo-500" />}
          title="Оплата"
          text="Работаем с физическими и юридическими лицами. Принимаем наличный, безналичный расчёт, карты и рассрочку. После оплаты вы получите чек, договор, гарантию и руководство."
        />

        <Section
          icon={<CreditCardIcon className="w-6 h-6 text-red-500" />}
          title="Онлайн-оплата"
          text="Оплата возможна банковскими картами Visa, MasterCard, МИР через защищённый процессинг Best2Pay. Безопасность соответствует стандарту PCI DSS. Возврат — на ту же карту."
        />
      </div>
    </div>
  )
}

function Section({ icon, title, text }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 p-2 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <div className="text-sm leading-relaxed">{text}</div>
      </div>
    </div>
  )
}
