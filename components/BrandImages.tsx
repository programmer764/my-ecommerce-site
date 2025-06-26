const imageList = [
  "aux_air-25.png",
  "ballu-99x33.png",
  "BONECO-2.png",
  "Dahaci-3-99x33.jpg",
  "daichi.jpg",
  "Daikin-2.png",
  "Dantex-2.png",
  "electrolux-2.png",
  "Fujitsu-2.png",
  "Funai-2.png",
  "Gree-2.png",
  "Haier-2.png",
  "HEC-2.png",
  "Hisense-2.png",
  "Hitachi-2.png",
  "IGC-2.png",
  "kentatsu-99x33.png",
  "Lessar-2.png",
  "Marley-2.png",
  "MDV-2.png",
  "midea-99x33.png",
  "Mitsubishi-2.png",
  "panasonic.jpg",
  "QuattroClima-2.png",
  "royalclima.png",
  "Schlosser-2.png",
  "Teplomash-2.png",
  "Terma-2.png",
  "Tion-2.png",
  "Toshiba-2.png",
  "Tosot-2.png",
  "uиøдăб.png",
  "WH-2.png",
  "Winzel-2.png",
  "energolux.png",
  "belunna.jpg"
 
];


// 🔧 Функция для нормализации строк
const normalize = (str: string): string =>
  str
    .toLowerCase()
    .replace(/\s+/g, "")        // Удаляем пробелы
    .replace(/[^a-z0-9]/gi, ""); // Удаляем спецсимволы

export const getImageForBrand = (brand: string): string => {
  if (!brand) return "default-image.png";

  const normalizedBrand = normalize(brand);

  const found = imageList.find((img) => normalize(img).includes(normalizedBrand));

  return found || "default-image.png";
};
