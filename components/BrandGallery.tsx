const brandLogos: string[] = [
  "aux_air-25.png",
  "ballu.png",
  "BONECO-2.png",  
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
  "Lessar-2.png",
  "Marley-2.png",
  "MDV-2.png", 
  "Mitsubishi-2.png",  
  "QuattroClima-2.png",
  "royalclima.png",
  "Schlosser-2.png",  
  "Tion-2.png",
  "Toshiba-2.png",
  "Tosot-2.png",    
  "energolux.png", 
];
export default function BrandGallery() {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-3xl font-semibold mb-10">Мы — официальные дилеры:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brandLogos.map((logo, index) => (
          <img
            key={index}
            src={`/brand/${logo}`}
            alt={logo.replace(".png", "")}
            className="w-full h-16 object-contain"
          />
        ))}
      </div>
    </div>
  );
}