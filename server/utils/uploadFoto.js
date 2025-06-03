const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi penyimpanan dinamis
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ambil folder tujuan dari request, misalnya dari route atau field
        let folder = req.folder || "default";
        const uploadPath = path.join(__dirname, `../uploads/${folder}`);

        // Buat folder jika belum ada
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

module.exports = upload;
