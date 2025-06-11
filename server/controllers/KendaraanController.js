const { dataKendaraan, dataPengguna } = require("../mockupData");

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
                    (u) => u.id_perusahaan === Perusahaan.PerusahaanID && u.id !== UserID
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

    static async getOne(req, res) {
        try {
            const { Perusahaan } = req.dataSession;
            const searchKendaraanID = parseInt(req.params.KendaraanID);

            const kendaraan = dataKendaraan.find((k) => k.id === searchKendaraanID);

            if (Perusahaan.PerusahaanID !== kendaraan.id_perusahaan) {
                return res.status(403).json({ message: "Akses ditolak" });
            }

            const transformedData = {
                KendaraanID: kendaraan.id,
                UserIDTerkait: kendaraan.id_pengguna,
                Nopol: kendaraan.nopol,
                Foto: kendaraan.foto,
                Jenis: kendaraan.jenis,
                Merek: kendaraan.merek,
                Tipe: kendaraan.tipe,
                JarakTempuh: kendaraan.jarak_tempuh,
                BahanBakar: kendaraan.bahanbakar,
                Status: kendaraan.status,
            };

            res.status(200).json({ success: true, data: transformedData });
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
}

module.exports = { KendaraanController };
