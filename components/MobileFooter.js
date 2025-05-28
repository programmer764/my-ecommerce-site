// components/Footer.js
import Link from 'next/link'
import Image from 'next/image'

const MobileFooter = () => {
  return (
    <footer className="bg-[#2a7bbc] text-white py-6 mt-10">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 
          Грид: на мобильных (grid-cols-1) всё идёт в одну колонку,
          начиная с mid-size (md) – 5 колонок
        */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Логотип */}
          <div>
            <Link href="/">
              <Image
                src="/icons/logo.svg"
                alt="Логотип"
                width={200}
                height={100}
                className="mb-2"
              />
            </Link>
            <p className="text-sm mt-2">
              &copy; 2025 ClimaTrade. Все права защищены.
            </p>
          </div>

          {/* Покупателю */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Покупателю</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/warranty">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Гарантия
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    О компании
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/payment">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Оплата и доставка
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Контакты
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Наши товары */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Наши товары</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/panel1">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Кондиционеры
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/panel2">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Радиаторы
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/panel3">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Микроклимат
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/panel4">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Вентиляция
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/panel5">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Осушители
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/panel6">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Обогреватели
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Услуги</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/installation">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Установка и монтаж
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/approval">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Согласование установки
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/service">
                  <span className="hover:text-gray-300 hover:underline cursor-pointer">
                    Сервисное обслуживание
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Принимаем к оплате */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Принимаем к оплате</h3>
            <p className="text-sm">Visa, MasterCard, Мир, Apple Pay, Google Pay</p>
            <ul className="footer__payments flex gap-4 mt-4">
              <li className="bg-white p-2 rounded-full shadow-md">
                {/* Первое лого (пример: VISA/MasterCard) */}
                <svg width="40" height="40" viewBox="0 0 512 317" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M325.228 33.8203H186.781V282.613H325.228V33.8203Z" fill="#FF5F00"></path>
                  <path d="M195.571 158.225C195.549 134.264 200.978 110.613 211.448 89.061C221.919 67.5091 237.155 48.6216 256.003 33.8285C232.662 15.4816 204.629 4.07198 175.11 0.903653C145.591 -2.26468 115.776 2.93617 89.0725 15.9117C62.3692 28.8873 39.8553 49.114 24.1041 74.28C8.35298 99.446 0 128.536 0 158.225C0 187.914 8.35298 217.004 24.1041 242.17C39.8553 267.336 62.3692 287.562 89.0725 300.538C115.776 313.513 145.591 318.714 175.11 315.546C204.629 312.378 232.662 300.968 256.003 282.621C237.155 267.828 221.919 248.941 211.449 227.389C200.979 205.837 195.549 182.185 195.571 158.225V158.225Z" fill="#EB001B"></path>
                  <path d="M511.999 158.225C512 187.913 503.648 217.003 487.898 242.169C472.148 267.335 449.635 287.562 422.932 300.538C396.229 313.513 366.414 318.714 336.895 315.546C307.377 312.378 279.345 300.968 256.004 282.621C274.836 267.813 290.06 248.922 300.528 227.374C310.997 205.825 316.436 182.181 316.436 158.225C316.436 134.268 310.997 110.624 300.528 89.0756C290.06 67.5271 274.836 48.6365 256.004 33.8285C279.345 15.4816 307.377 4.07192 336.895 0.903625C366.414 -2.26467 396.229 2.93627 422.932 15.912C449.635 28.8876 472.148 49.1145 487.898 74.2805C503.648 99.4465 512 128.536 511.999 158.225V158.225Z" fill="#F79E1B"></path>
                </svg>
              </li>
              <li className="bg-white p-2 rounded-full shadow-md">
                {/* Второе лого */}
                <svg width="40" height="40" viewBox="0 0 512 166" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M253.509 2.92064L219.303 162.84H177.929L212.138 2.92064H253.509ZM427.568 106.182L449.343 46.1295L461.874 106.182H427.568ZM473.744 162.84H512L478.578 2.92064H443.29C435.337 2.92064 428.632 7.53179 425.665 14.6428L363.587 162.84H407.037L415.662 138.957H468.734L473.744 162.84ZM365.742 110.632C365.921 68.4264 307.397 66.0884 307.789 47.2302C307.915 41.5004 313.382 35.3966 325.331 33.8355C331.255 33.073 347.603 32.4543 366.134 40.9932L373.381 7.0678C363.429 3.46736 350.62 0 334.683 0C293.783 0 265.012 21.7249 264.782 52.8592C264.519 75.8826 285.334 88.7198 300.984 96.3882C317.119 104.226 322.525 109.251 322.446 116.254C322.335 126.983 309.58 131.734 297.704 131.914C276.892 132.238 264.828 126.289 255.214 121.807L247.704 156.866C257.387 161.297 275.227 165.153 293.7 165.351C337.183 165.351 365.612 143.881 365.742 110.632ZM194.391 2.92064L127.357 162.84H83.6302L50.64 35.2131C48.6401 27.3648 46.8957 24.4801 40.8134 21.1638C30.8645 15.7614 14.4413 10.7078 0 7.56417L0.978353 2.92064H71.3758C80.3427 2.92064 88.4104 8.8878 90.4642 19.2179L107.891 111.765L150.927 2.92064H194.391Z" fill="#1434CB"></path>
                </svg>
              </li>
              <li className="bg-white p-2 rounded-full shadow-md">
                {/* Третье лого */}
                <svg width="40" height="40" viewBox="0 0 512 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M47.3463 0.0238324C51.9204 -0.00353186 65.5145 -1.22789 71.2727 18.206C75.1515 31.2969 81.3302 52.7405 89.8088 82.5366H93.2617C102.354 51.1234 108.6 29.6799 112 18.206C117.818 -1.43033 132.364 0.0242172 138.182 0.0242172L183.07 0.0242732V139.66H137.319V57.3705H134.251L108.746 139.66H74.3241L48.8197 57.3095H45.7517V139.66H0V0.0242732L47.3463 0.0238324ZM248.769 0.0242732V82.3754H252.419L283.443 14.6586C289.465 1.18283 302.3 0.0242732 302.3 0.0242732H346.574V139.661H299.867V57.3095H296.217L265.802 125.026C259.779 138.441 246.336 139.661 246.336 139.661H202.062V0.0242732H248.769ZM508.015 66.3804C501.5 84.8428 481.04 98.0651 458.388 98.0651H409.406V139.661H364.99V66.3804H508.015Z" fill="#4DB45F"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M460.529 0.0234375H362.66C364.989 31.1112 391.761 57.7244 419.476 57.7244H511.101C516.388 31.8868 498.186 0.0234375 460.529 0.0234375Z" fill="url(#paint0_linear_767_2554)"></path>
                  <defs>
                    <linearGradient id="paint0_linear_767_2554" x1="511.999" y1="36.3198" x2="362.66" y2="36.3198" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1F5CD7"></stop>
                      <stop offset="1" stopColor="#02AEFF"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MobileFooter
