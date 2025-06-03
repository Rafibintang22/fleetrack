export default class validateFormKendaraan {
    static tambah = (data) => {
        const errors = {};

        if (!data.Nopol || !data.Nopol.trim()) {
            errors.Nopol = "Nomor polisi wajib diisi";
        }

        if (!data.BahanBakar || !data.Jenis.trim()) {
            errors.BahanBakar = "Bahan bakar wajib dipilih";
        }

        if (!data.Jenis || !data.Jenis.trim()) {
            errors.Jenis = "Jenis kendaraan wajib dipilih";
        }

        if (!data.Merek || !data.Merek.trim()) {
            errors.Merek = "Merek kendaraan wajib diisi";
        }

        if (!data.Tipe || !data.Tipe.trim()) {
            errors.Tipe = "Tipe kendaraan wajib diisi";
        }

        if (!data.Status) {
            errors.Status = "Status kendaraan wajib dipilih";
        }

        if (
            data.JarakTempuh === null ||
            data.JarakTempuh === undefined ||
            isNaN(data.JarakTempuh)
        ) {
            errors.JarakTempuh = "Jarak tempuh wajib diisi";
        } else if (data.JarakTempuh < 0) {
            errors.JarakTempuh = "Jarak tempuh tidak boleh negatif";
        }

        if (!data.Foto) {
            errors.Foto = "Foto kendaraan wajib diunggah";
        }

        if (!data.UserIDTerkait || !data.UserIDTerkait.trim()) {
            errors.UserIDTerkait = "Pengguna terkait wajib dipilih";
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0,
        };
    };
}
