const express = require("express");
const { PenggunaController, KendaraanController } = require("./controllers");
const { Authorization } = require("./utils/Authorization");
const upload = require("./utils/uploadFoto");
const router = express.Router();

// AUTH
router.post("/login", PenggunaController.login);
router.post("/register", PenggunaController.register);
router.get("/auth/session", Authorization.decryption, PenggunaController.getUserSession);

// USER
router.get("/pengguna", Authorization.decryption, PenggunaController.getAll);
router.get("/pengguna/opsi", Authorization.decryption, PenggunaController.getOpsiPengguna);
router.post("/pengguna", Authorization.decryption, PenggunaController.create);
router.get("/pengguna/:UserID", Authorization.decryption, PenggunaController.getOne);
router.put("/pengguna/:UserID", Authorization.decryption, PenggunaController.update);
router.delete("/pengguna/:UserID", Authorization.decryption, PenggunaController.delete);

// KENDARAAN

router.get("/kendaraan", Authorization.decryption, KendaraanController.getAll);
router.get("/kendaraan/:KendaraanID", Authorization.decryption, KendaraanController.getOne);
router.post(
    "/kendaraan",
    Authorization.decryption,
    (req, res, next) => {
        req.folder = "gambarkendaraan";
        next();
    },
    upload.single("Foto"),
    KendaraanController.create
);
// Contoh data kendaraan (bisa diganti dengan dari database nanti)
const dataKendaraan = [
    {
        KendaraanID: 1,
        Nama: "Toyota Avanza",
        PlatNomor: "B 1234 CD",
        Jenis: "Mobil",
        Tahun: 2020,
    },
    {
        KendaraanID: 2,
        Nama: "Honda Beat",
        PlatNomor: "B 5678 EF",
        Jenis: "Motor",
        Tahun: 2022,
    },
    {
        KendaraanID: 3,
        Nama: "Suzuki Carry",
        PlatNomor: "B 9101 GH",
        Jenis: "Mobil",
        Tahun: 2018,
    },
    // Tambah data kendaraan lainnya di sini sesuai kebutuhan
];

router.get("/api/kendaraan", KendaraanController.getAll);
router.get("/kendaraan", authentication, KendaraanController.getAll);
// export router
module.exports = { router };

