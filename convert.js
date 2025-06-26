const fs = require("fs");
const path = require("path");

const directoryPath = "C:\\Users\\Admin\\Documents\\my-ecommerce-site\\public\\images";

// Функция для переименования файлов
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error("Ошибка при чтении директории:", err);
        return;
    }

    files.forEach((file) => {
        if (file.includes("%20")) {
            const oldPath = path.join(directoryPath, file);
            const newPath = path.join(directoryPath, file.replace(/%20/g, "_"));

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error(`Ошибка при переименовании ${file}:`, err);
                } else {
                    console.log(`Файл переименован: ${file} -> ${file.replace(/%20/g, "_")}`);
                }
            });
        }
    });
});
