// components/TambahPengguna.jsx
import { createSignal } from "solid-js";
import style from "../../style";
import axios from "axios";
import { urlServer } from "../../Utils";
import { validateFormPengguna } from "../../Utils/Validation";

function TambahPengguna(props) {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const [formData, setFormData] = createSignal({
        Nama: "",
        Email: "",
        Password: "",
        KonfirmasiPassword: "",
        Peran: "Driver",
    });

    const [errors, setErrors] = createSignal({});
    const [isLoading, setIsLoading] = createSignal(false);

    // Handle input change
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error ketika user mulai mengetik
        if (errors()[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Handle form submit
    const handleSubmit = async () => {
        const validation = validateFormPengguna.tambah(formData());

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const response = await axios.post(`${urlServer}/pengguna`, formData(), headers);

            if (response.data?.success === true) {
                alert("Data pengguna berhasil ditambahkan!");
                // Reset form setelah berhasil
                setFormData({
                    Nama: "",
                    Email: "",
                    Password: "",
                    KonfirmasiPassword: "",
                    Peran: "Driver",
                });
                props.onSuccess();
            }
        } catch (error) {
            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam menambah data pengguna"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            Nama: "",
            Email: "",
            Password: "",
            KonfirmasiPassword: "",
            Peran: "Driver",
        });
    };

    return (
        <div class="space-y-2">
            {/* Peran */}
            <div>
                <label for="Peran" class="block text-sm font-medium text-gray-700 mb-1">
                    Peran <span class="text-red-500">*</span>
                </label>
                <select
                    id="Peran"
                    value={formData().Peran}
                    onChange={(e) => handleInputChange("Peran", e.target.value)}
                    class={`w-full ${style.input} ${
                        errors().Peran ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                >
                    <option value="Admin">Admin</option>
                    <option value="Driver">Driver</option>
                </select>
                {errors().Peran && <p class="mt-1 text-sm text-red-600">{errors().Peran}</p>}
            </div>

            {/* Nama Lengkap */}
            <div>
                <label for="Nama" class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                    id="Nama"
                    type="text"
                    value={formData().Nama}
                    onInput={(e) => handleInputChange("Nama", e.target.value)}
                    class={`w-full ${style.input} ${
                        errors().Nama ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Masukkan nama lengkap"
                />
                {errors().Nama && <p class="mt-1 text-sm text-red-600">{errors().Nama}</p>}
            </div>

            {/* Email */}
            <div>
                <label for="Email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                </label>
                <input
                    id="Email"
                    type="email"
                    value={formData().Email}
                    onInput={(e) => handleInputChange("Email", e.target.value)}
                    class={`w-full ${style.input} ${
                        errors().Email ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="contoh@email.com"
                />
                {errors().Email && <p class="mt-1 text-sm text-red-600">{errors().Email}</p>}
            </div>

            {/* Password */}
            <div>
                <label for="Password" class="block text-sm font-medium text-gray-700 mb-1">
                    Password <span class="text-red-500">*</span>
                </label>
                <input
                    id="Password"
                    type="password"
                    value={formData().Password}
                    onInput={(e) => handleInputChange("Password", e.target.value)}
                    class={`w-full ${style.input} ${
                        errors().Password ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Minimal 8 karakter"
                />
                {errors().Password && <p class="mt-1 text-sm text-red-600">{errors().Password}</p>}
            </div>

            {/* Konfirm Password */}
            <div>
                <label
                    for="KonfirmasiPassword"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Konfirmasi Password <span class="text-red-500">*</span>
                </label>
                <input
                    id="KonfirmasiPassword"
                    type="password"
                    value={formData().KonfirmasiPassword}
                    onInput={(e) => handleInputChange("KonfirmasiPassword", e.target.value)}
                    class={`w-full ${style.input} ${
                        errors().KonfirmasiPassword ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Minimal 8 karakter"
                />
                {errors().KonfirmasiPassword && (
                    <p class="mt-1 text-sm text-red-600">{errors().KonfirmasiPassword}</p>
                )}
            </div>

            {/* Submit Button */}
            <div class="flex justify-end pt-4 gap-2">
                <button onClick={resetForm} class={style.buttonLight}>
                    Reset
                </button>
                <button onClick={handleSubmit} disabled={isLoading()} class={style.buttonPrimary}>
                    {isLoading() ? (
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Menyimpan...</span>
                        </div>
                    ) : (
                        "Simpan Data"
                    )}
                </button>
            </div>
        </div>
    );
}

export default TambahPengguna;
