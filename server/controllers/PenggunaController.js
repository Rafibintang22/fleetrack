const { dataPengguna, dataPerusahaan, dataKendaraan } = require("../mockupData");
const { Authorization } = require("../utils/Authorization");
const jwt = require("jsonwebtoken");

class PenggunaController {
    static async login(req, res) {
        try {
            const { Email, Password } = req.body;
            const user = dataPengguna.find((u) => u.email === Email && u.password === Password);

            if (!user) {
                return res.status(401).json({ message: "Email atau password salah" });
            }

            const userCompany = dataPerusahaan.find((p) => p.id === user.id_perusahaan);

            const payload = {
                UserID: user.id,
                Nama: user.nama,
                Email: user.email,
                Peran: user.peran,
                Perusahaan: userCompany
                    ? { PerusahaanID: userCompany?.id, Nama: userCompany?.nama }
                    : null,
            };

            const token = await Authorization.encryption(payload);
            res.set("authorization", `Bearer ${token}`);

            res.status(200).json({ success: true, message: "Login berhasil", data: payload });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async register(req, res) {
        try {
            const { NamaPerusahaan, NamaOwner, Email, Password, KonfirmasiPassword } = req.body;

            const existing = dataPengguna.find((u) => u.email === Email);
            if (existing) {
                return res.status(400).json({ message: "Email sudah digunakan" });
            }

            if (Password !== KonfirmasiPassword) {
                return res.status(400).json({ message: "Password konfirmasi tidak sesuai" });
            }

            const idPerusahaan = dataPerusahaan.length + 1;
            const idPengguna = dataPengguna.length + 1;
            const newPerusahaan = {
                id: idPerusahaan,
                nama: NamaPerusahaan,
                id_owner: idPengguna,
            };
            const newPengguna = {
                id: idPengguna,
                nama: NamaOwner,
                email: Email,
                password: Password,
                peran: "Owner",
                id_perusahaan: idPerusahaan,
            };
            dataPerusahaan.push(newPerusahaan);

            dataPengguna.push(newPengguna);
            res.status(201).json({
                success: true,
                message: "Registrasi berhasil",
                data: newPengguna,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET ALL – hanya untuk ADMIN dan OWNER
    static async getAll(req, res) {
        try {
            const { UserID, Peran, Perusahaan } = req.dataSession;

            if (Peran !== "Owner" && Peran !== "Admin") {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            let allPengguna = dataPengguna.filter(
                (u) => u.id_perusahaan === Perusahaan.PerusahaanID && u.id !== UserID
            );

            // Jika yang login adalah Admin, sembunyikan user dengan peran "Owner"
            if (Peran === "Admin") {
                allPengguna = allPengguna.filter((u) => u.peran !== "Owner");
            }

            const transformedAllPengguna = allPengguna.map((u) => ({
                UserID: u.id,
                Nama: u.nama,
                Email: u.email,
                Peran: u.peran,
                JumKendaraan: dataKendaraan.filter((k) => k.id_pengguna === u.id).length,
            }));

            res.status(200).json({ success: true, data: transformedAllPengguna });
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async getOpsiPengguna(req, res) {
        try {
            const { UserID, Perusahaan } = req.dataSession;

            let allPengguna = dataPengguna.filter(
                (u) => u.id_perusahaan === Perusahaan.PerusahaanID && u.id !== UserID
            );

            const transformedAllPengguna = allPengguna.map((u) => ({
                UserID: u.id,
                Nama: u.nama,
            }));

            res.status(200).json({ success: true, data: transformedAllPengguna });
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async getOne(req, res) {
        try {
            const { UserID: currUserID, Peran, Perusahaan } = req.dataSession;
            const searchUserID = parseInt(req.params.UserID);

            if (Peran !== "Owner" && Peran !== "Admin" && currUserID !== searchUserID) {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            const pengguna = dataPengguna.find((u) => u.id === searchUserID);

            if (Perusahaan.PerusahaanID !== pengguna.id_perusahaan) {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            const kendaraanPengguna = dataKendaraan
                .filter(
                    (k) =>
                        k.id_perusahaan === pengguna.id_perusahaan && k.id_pengguna === pengguna.id
                )
                .map((k) => ({
                    Nopol: k.nopol,
                    Jenis: k.jenis,
                    Merek: k.merek,
                    Tipe: k.tipe,
                    BahanBakar: k.bahanbakar,
                    Status: k.status,
                    JarakTempuh: k.jarak_tempuh,
                    Foto: k.foto,
                }));

            const perusahaan = dataPerusahaan.find((p) => p.id === pengguna.id_perusahaan);

            const transformedPengguna = {
                UserID: pengguna.id,
                Perusahaan: perusahaan.nama,
                Nama: pengguna.nama,
                Email: pengguna.email,
                Peran: pengguna.peran,
                Kendaraan: kendaraanPengguna,
            };

            res.status(200).json({ success: true, data: transformedPengguna });
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { Peran, Perusahaan } = req.dataSession;

            if (Peran !== "Owner" && Peran !== "Admin") {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            const { Nama, Email, Password, KonfirmasiPassword, Peran: PeranBaru } = req.body;

            if (!Nama || !Email || !Password || !KonfirmasiPassword || !PeranBaru) {
                return res.status(400).json({ message: "Semua input wajib diisi" });
            }

            const emailUsed = dataPengguna.find((u) => u.email === Email);
            if (emailUsed) {
                return res.status(400).json({ message: "Email sudah digunakan" });
            }

            const newUser = {
                id: dataPengguna.length + 1,
                nama: Nama,
                email: Email,
                password: Password,
                peran: PeranBaru,
                id_perusahaan: Perusahaan.PerusahaanID,
            };

            dataPengguna.push(newUser);

            res.status(201).json({
                success: true,
                message: "Pengguna berhasil ditambahkan",
                data: {
                    UserID: newUser.id,
                    Nama: newUser.nama,
                    Email: newUser.email,
                    Peran: newUser.peran,
                },
            });
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { UserID: currUserID, Peran, Perusahaan } = req.dataSession;
            const userID = parseInt(req.params.UserID);
            const {
                Nama,
                Email,
                Peran: NewPeran,
                PasswordLama,
                PasswordBaru,
                KonfirmasiPassword,
                Perusahaan: NamaPerusahaan,
            } = req.body;

            if (Peran !== "Owner" && Peran !== "Admin" && currUserID !== userID) {
                return res.status(403).json({ message: "Akses ditolak" });
            }
            const pengguna = dataPengguna.find((u) => u.id === userID);
            if (!pengguna) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan" });
            }
            if (pengguna.id_perusahaan !== Perusahaan.PerusahaanID) {
                return res.status(403).json({ message: "Akses ditolak" });
            }
            if (PasswordLama.trim() && PasswordLama !== pengguna.password) {
                return res.status(403).json({ message: "Password lama anda salah!" });
            }
            if (PasswordBaru.trim() && PasswordBaru !== KonfirmasiPassword) {
                return res.status(403).json({ message: "Konfirmasi password tidak cocok!" });
            }
            if (NamaPerusahaan !== Perusahaan.Nama) {
                if (Peran !== "Owner") {
                    return res.status(403).json({ message: "Akses ditolak" });
                }
            }

            // Update field jika ada
            if (Nama.trim()) pengguna.nama = Nama;
            if (Email.trim()) pengguna.email = Email;
            if (NewPeran.trim()) pengguna.peran = NewPeran;
            if (PasswordLama.trim() && PasswordBaru.trim()) pengguna.password = PasswordBaru;

            const userCompany = dataPerusahaan.find((p) => p.id === Perusahaan.PerusahaanID);
            if (NamaPerusahaan.trim()) userCompany.nama = NamaPerusahaan;

            const transformedPengguna = {
                UserID: currUserID,
                Nama: pengguna.nama,
                Email: pengguna.email,
                Peran: pengguna.peran,
                Perusahaan: userCompany
                    ? { PerusahaanID: userCompany?.id, Nama: userCompany?.nama }
                    : null,
            };

            res.status(200).json({
                success: true,
                message: "Pengguna berhasil diperbarui",
                data: transformedPengguna,
            });
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { Peran, Perusahaan } = req.dataSession;
            const userID = parseInt(req.params.UserID);

            if (Peran !== "Owner" && Peran !== "Admin") {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            const index = dataPengguna.findIndex((u) => u.id === userID);
            if (index === -1) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan" });
            }

            const pengguna = dataPengguna[index];
            if (pengguna.id_perusahaan !== Perusahaan.PerusahaanID) {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            dataPengguna.splice(index, 1);

            res.status(200).json({ success: true, message: "Pengguna berhasil dihapus" });
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async getUserSession(req, res) {
        const token = req.headers["authorization"];
        const UserID = req.dataSession.UserID;

        try {
            //cek apakah expired menggunakan jwt.verify
            const secretKey = process.env.SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);

            const { iat, exp, Otp, LoginSessionID, ...rest } = decoded;
            const sessionData = {
                ...rest,
            };

            const isPenggunaExist = dataPengguna.find((pengguna) => pengguna.id === UserID);

            if (!isPenggunaExist) {
                return res
                    .status(401)
                    .json({ status: "unauthorized", message: "Pengguna tidak ditemukan" });
            }

            res.status(200).json({ status: "authorized", dataLogin: sessionData });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}

module.exports = { PenggunaController };
