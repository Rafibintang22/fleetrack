export default class validateFormPengguna {
    static tambah = (data) => {
        const errors = {};

        if (!data.Peran) {
            errors.Peran = "Peran wajib dipilih";
        }

        if (!data.Nama.trim()) {
            errors.Nama = "Nama wajib diisi";
        }

        if (!data.Email.trim()) {
            errors.Email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
            errors.Email = "Format email tidak valid";
        }

        if (!data.Password.trim()) {
            errors.Password = "Password wajib diisi";
        } else if (data.Password.length < 8) {
            errors.Password = "Password minimal 8 karakter";
        }

        if (data.Password.trim() !== data.KonfirmasiPassword.trim()) {
            errors.KonfirmasiPassword = "Konfirmasi password tidak cocok";
        }
        return {
            errors,
            isValid: Object.keys(errors).length === 0,
        };
    };

    static ubah = (data) => {
        const errors = {};

        if (!data.Perusahaan.trim()) {
            errors.Perusahaan = "Nama perusahaan tidak boleh kosong";
        }

        if (!data.Nama.trim()) {
            errors.Nama = "Nama tidak boleh kosong";
        }

        if (!data.Email.trim()) {
            errors.Email = "Email tidak boleh kosong";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
            errors.Email = "Format email tidak valid";
        }

        // Validasi password baru dan konfirmasi password
        if (data.PasswordBaru.trim()) {
            // Password baru diisi => Password lama wajib diisi
            if (!data.PasswordLama.trim()) {
                errors.PasswordLama = "Password lama harus diisi untuk mengganti password";
            }

            // Minimal 8 karakter untuk password baru
            if (data.PasswordBaru.length < 8) {
                errors.PasswordBaru = "Password minimal 8 karakter";
            }

            // Konfirmasi password harus cocok dengan password baru
            if (data.KonfirmasiPassword.trim() !== data.PasswordBaru.trim()) {
                errors.KonfirmasiPassword = "Konfirmasi password tidak cocok";
            }
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0,
        };
    };

    static register = (data) => {
        const errors = {};

        if (!data.NamaPerusahaan.trim()) {
            errors.NamaPerusahaan = "Nama perusahaan tidak boleh kosong";
        }

        if (!data.NamaOwner.trim()) {
            errors.NamaOwner = "Nama tidak boleh kosong";
        }

        if (!data.Email.trim()) {
            errors.Email = "Email tidak boleh kosong";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
            errors.Email = "Format email tidak valid";
        }

        if (!data.Password.trim()) {
            errors.Password = "Password wajib diisi";
        } else if (data.Password.length < 8) {
            errors.Password = "Password minimal 8 karakter";
        }

        if (data.Password.trim() !== data.KonfirmasiPassword.trim()) {
            errors.KonfirmasiPassword = "Konfirmasi password tidak cocok";
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0,
        };
    };
}
