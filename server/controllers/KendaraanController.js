const { dataKendaraan } = require("../mockupData");

class KendaraanController {
    static async getAll(req, res) {
        try {
            const { UserID, Peran, Perusahaan } = req.dataSession;

            let allKendaraan = [];

            if (Peran === "Owner") {
                allKendaraan = dataKendaraan.filter(
                    (u) => u.id_perusahaan === Perusahaan.PerusahaanID
                );
            } else {
                allKendaraan = dataKendaraan.filter(
                    (u) => u.id_perusahaan === Perusahaan.PerusahaanID && u.id_pengguna === UserID
                );
            }

            const transformedData = allKendaraan.map((k) => ({
                KendaraanID: k.id,
                Nopol: k.nopol,
                Foto: k.foto,
                Jenis: k.jenis,
                Merek: k.merek,
                Tipe: k.tipe,
                JarakTempuh: k.jarak_tempuh,
                BahanBakar: k.bahanbakar,
                Status: k.status,
            }));

            res.status(200).json({ success: true, data: transformedData });
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { Peran, Perusahaan } = req.dataSession;

            if (Peran !== "Owner") {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            const { Nopol, Jenis, BahanBakar, Merek, Tipe, Status, JarakTempuh, UserIDTerkait } =
                req.body;

            if (
                !Nopol ||
                !Jenis ||
                !BahanBakar ||
                !Merek ||
                !Tipe ||
                !Status ||
                !JarakTempuh ||
                !UserIDTerkait
            ) {
                return res.status(400).json({ message: "Semua input wajib diisi" });
            }

            // Ambil nama file dari multer
            const fotoPath = req.file
                ? `${process.env.SERVER_URL}/uploads/gambarkendaraan/${req.file.filename}`
                : null;

            const newData = {
                id: dataKendaraan.length + 1,
                id_perusahaan: parseInt(Perusahaan.PerusahaanID),
                id_pengguna: parseInt(UserIDTerkait),
                nopol: Nopol,
                jenis: Jenis,
                bahanbakar: BahanBakar,
                merek: Merek,
                tipe: Tipe,
                status: Status,
                jarak_tempuh: parseInt(JarakTempuh),
                foto: fotoPath,
            };

            dataKendaraan.push(newData);

            const transformednewData = {
                KendaraanID: newData.id,
                PerusahaanID: newData.id_perusahaan,
                UserID: newData.id_pengguna,
                Nopol: newData.nopol,
                Jenis: newData.jenis,
                BahanBakar: newData.bahanbakar,
                Merek: newData.merek,
                Tipe: newData.tipe,
                Status: newData.status,
                JarakTempuh: newData.jarak_tempuh,
                Foto: newData.foto,
            };

            res.status(201).json({
                success: true,
                message: "Kendaraan berhasil ditambahkan",
                data: transformednewData,
            });
        } catch (error) {
            console.log(error);

            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { UserID: currUserID, Peran, Perusahaan } = req.dataSession;
            const kendaraanID = parseInt(req.params.KendaraanID);
            const { Nopol, Jenis, BahanBakar, Merek, Tipe, Status, JarakTempuh, UserIDTerkait } =
                req.body;

            if (Peran !== "Owner") {
                return res.status(403).json({ message: "Akses ditolak" });
            }
            const kendaraan = dataKendaraan.find((k) => k.id === kendaraanID);
            if (!kendaraan) {
                return res.status(404).json({ message: "Kendaraan tidak ditemukan" });
            }
            if (kendaraan.id_perusahaan !== Perusahaan.PerusahaanID) {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            kendaraan.nopol = Nopol;
            kendaraan.jenis = Jenis;
            kendaraan.bahanbakar = BahanBakar;
            kendaraan.merek = Merek;
            kendaraan.tipe = Tipe;
            kendaraan.status = Status;
            kendaraan.jarak_tempuh = JarakTempuh;
            kendaraan.id_pengguna = UserIDTerkait;

            const fotoPath = req.file
                ? `${process.env.SERVER_URL}/uploads/gambarkendaraan/${req.file.filename}`
                : null;

            //kalo ada input foto
            //update foto yang sudah ada
            if (fotoPath !== null) {
                kendaraan.foto = fotoPath;
            }

            const transformedKendaraan = {
                KendaraanID: kendaraan.id,
                PerusahaanID: kendaraan.id_perusahaan,
                UserID: kendaraan.id_pengguna,
                Nopol: kendaraan.nopol,
                Foto: kendaraan.foto,
                BahanBakar: kendaraan.bahanbakar,
                Jenis: kendaraan.jenis,
                Merek: kendaraan.merek,
                Tipe: kendaraan.tipe,
                Status: kendaraan.status,
                JarakTempuh: kendaraan.jarak_tempuh,
            };

            res.status(200).json({
                success: true,
                message: "Kendaraan berhasil diperbarui",
                data: transformedKendaraan,
            });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { Peran, Perusahaan } = req.dataSession;
            const kendaraanID = parseInt(req.params.KendaraanID);

            if (Peran !== "Owner" && Peran !== "Admin") {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            const index = dataKendaraan.findIndex((k) => k.id === kendaraanID);

            if (index === -1) {
                return res.status(404).json({ message: "Kendaraan tidak ditemukan" });
            }

            const kendaraan = dataKendaraan[index];
            if (kendaraan.id_perusahaan !== Perusahaan.PerusahaanID) {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            dataKendaraan.splice(index, 1);

            res.status(200).json({ success: true, message: "Kendaraan berhasil dihapus" });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    static async getJumlahKendaraan(req, res) {
        try {
            const { Perusahaan } = req.dataSession;
            const perusahaanID = Perusahaan.PerusahaanID;

            const kendaraanPerusahaan = dataKendaraan.filter(
                (k) => k.id_perusahaan === perusahaanID
            );
            const totalKendaraan = kendaraanPerusahaan.length;
            const totalAktif = kendaraanPerusahaan.filter((k) => k.status === "Aktif").length;
            const totalDalamPerbaikan = kendaraanPerusahaan.filter(
                (k) => k.status === "Dalam Perbaikan"
            ).length;
            const totalTidakAtif = kendaraanPerusahaan.filter(
                (k) => k.status === "NonAktif"
            ).length;
            const dataKendaraanPerusahaan = {
                TotalKendaraan: totalKendaraan,
                TotalAktif: totalAktif,
                TotalDalamPerbaikan: totalDalamPerbaikan,
                TotalTidakAtif: totalTidakAtif,
            };
            res.status(200).json({ success: true, message: dataKendaraanPerusahaan });
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}

module.exports = { KendaraanController };
