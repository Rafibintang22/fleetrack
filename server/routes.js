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
router.get(
    "/dashboard",
    Authorization.decryption,
    KendaraanController.getJumlahKendaraan
);
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
router.delete("/kendaraan/:KendaraanID", Authorization.decryption, KendaraanController.delete);
module.exports = { router };
