// utils/getImageForBrand.ts

const imageList = [
  "aux_air-25.png","kentatsu.png",
  "dahaci.png",
"ballu.png" ,
 "daichi.png",
  "boneco-2.png",
  "daikin-2.png",
  "dantex-2.png",
  "electrolux-2.png",
  "fujitsu-2.png",
  "funai-2.png",
  "gree-2.png",
  "haier-2.png",
  "hec-2.png",
  "hisense-2.png",
  "hitachi-2.png",
  "igc-2.png",
  "lessar-2.png",
  "marley-2.png",
  "mdv-2.png",
  "mitsubishi-2.png",
  "quattroclima-2.png",
  "royalclima.png",
  "schlosser-2.png",
  "terma-2.png",
  "tion-2.png",
  "toshiba-2.png",
  "tosot-2.png",
  "wh-2.png",
  "winzel-2.png",
  "birusa-2.png",
  "teplomash-2.png",
  "бирюса.png",
  "panasonic.png",
  "Belluna.png",
  "energolux.png"
  
]

// Нормализация строки: убираем пробелы, спецсимволы, делаем lowercase
const normalize = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, "").replace(/[^\wа-яё]/gi, "");

export const getImageForBrand = (brand: string): string => {
  if (!brand) return "default-image.png";

  const normalizedBrand = normalize(brand);

  const found = imageList.find((file) => normalize(file).includes(normalizedBrand));
  return found || "default-image.png";
};
