import { createSignal } from "solid-js";
import GlobalLayout from "../components/layout/GlobalLayout";
import style from "../style";
import { urlServer, UseSessionCheck } from "../Utils";
import { validateFormPengguna } from "../Utils/Validation";
import axios from "axios";

function PengaturanAkun() {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const dataUser = userSession?.dataUser;

    UseSessionCheck();
    const [formData, setFormData] = createSignal({
        Nama: dataUser?.Nama || "",
        Perusahaan: dataUser?.Perusahaan?.Nama || "",
        Email: dataUser?.Email || "",
        Peran: dataUser?.Peran || "",
        PasswordLama: "",
        PasswordBaru: "",
        KonfirmasiPassword: "",
    });

    const [profileImage, setProfileImage] = createSignal(null);
    const [imagePreview, setImagePreview] = createSignal(null);

    const [errors, setErrors] = createSignal({});
    const [isLoading, setIsLoading] = createSignal(false);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async () => {
        const validation = validateFormPengguna.ubah(formData());

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
            const response = await axios.put(
                `${urlServer}/pengguna/${dataUser?.UserID}`,
                formData(),
                headers
            );

            if (response.data?.success === true) {
                alert("Data pengguna berhasil diperbarui!");
                const updatedSession = {
                    ...userSession,
                    dataUser: response.data.data,
                };
                // Simpan kembali ke localStorage
                localStorage.setItem("userSession", JSON.stringify(updatedSession));
                window.location.reload();
            }
        } catch (error) {
            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam perbarui data akun"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlobalLayout>
            <div class="flex flex-col bg-white rounded-lg p-4 sm:p-6 h-full max-h-[90vh] overflow-y-auto">
                <div class="border-b pb-4 mb-6">
                    <h3 class={`${style.h3}`}>Pengaturan Akun</h3>
                    <p class="text-xs text-gray-500 mt-1">Kelola informasi profil akun Anda</p>
                </div>

                {/* Form  */}
                <form class="flex flex-col gap-2 sm:gap-4 flex-1">
                    {/* <div class="flex flex-col items-center mb-6">
                        <div class="mb-4 relative">
                            <label class="cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    class="hidden"
                                />
                                {imagePreview() ? (
                                    <div class="relative">
                                        <img
                                            src={imagePreview()}
                                            alt="Profile Preview"
                                            class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 group-hover:opacity-75 transition-opacity"
                                        />
                                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg
                                                class="w-6 h-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                />
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300 group-hover:border-gray-400 group-hover:bg-gray-300 transition-all">
                                        <svg
                                            class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 group-hover:text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </label>

                            {imagePreview() && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <p class="text-xs text-gray-400 text-center">
                            Format: JPG, PNG, GIF (max 5MB)
                        </p>
                    </div> */}

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
                        <div class="flex flex-col">
                            <label class="block text-xs font-medium text-gray-600 mb-2">
                                Nama Perusahaan
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama perusahaan"
                                value={formData().Perusahaan}
                                onInput={(e) => handleInputChange("Perusahaan", e.target.value)}
                                class={`${style.input} w-full ${
                                    dataUser?.Peran !== "Owner" && "bg-gray-100"
                                } ${
                                    errors().Perusahaan
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                disabled={dataUser?.Peran !== "Owner"}
                            />
                            {errors().Perusahaan && (
                                <p class="mt-1 text-sm text-red-600">{errors().Perusahaan}</p>
                            )}
                        </div>
                        <div class="flex flex-col">
                            <label class="block text-xs font-medium text-gray-600 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                value={formData().Nama}
                                onInput={(e) => handleInputChange("Nama", e.target.value)}
                                class={`${style.input} w-full ${
                                    errors().Nama ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                            />
                            {errors().Nama && (
                                <p class="mt-1 text-sm text-red-600">{errors().Nama}</p>
                            )}
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <label class="block text-xs font-medium text-gray-600 mb-2">Email</label>
                        <input
                            type="Email"
                            placeholder="Masukkan alamat Email"
                            value={formData().Email}
                            onInput={(e) => handleInputChange("Email", e.target.value)}
                            class={`${style.input} w-full ${
                                errors().Email ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                        />
                        {errors().Email && (
                            <p class="mt-1 text-sm text-red-600">{errors().Email}</p>
                        )}
                    </div>

                    <div class="border-t pt-6 mt-4">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4">Ganti Password</h3>

                        <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div class="flex flex-col lg:col-span-2">
                                <label class="block text-xs font-medium text-gray-600 mb-2">
                                    Password Lama
                                </label>
                                <input
                                    type="password"
                                    placeholder="Masukkan password lama"
                                    value={formData().PasswordLama}
                                    onInput={(e) =>
                                        handleInputChange("PasswordLama", e.target.value)
                                    }
                                    class={`${style.input} w-full`}
                                />
                            </div>

                            <div class="flex flex-col">
                                <label class="block text-xs font-medium text-gray-600 mb-2">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    placeholder="Masukkan password baru"
                                    value={formData().PasswordBaru}
                                    onInput={(e) =>
                                        handleInputChange("PasswordBaru", e.target.value)
                                    }
                                    class={`${style.input} w-full ${
                                        errors().PasswordBaru
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors().PasswordBaru && (
                                    <p class="mt-1 text-sm text-red-600">{errors().PasswordBaru}</p>
                                )}
                            </div>

                            <div class="flex flex-col">
                                <label class="block text-xs font-medium text-gray-600 mb-2">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    placeholder="Konfirmasi password baru"
                                    value={formData().KonfirmasiPassword}
                                    onInput={(e) =>
                                        handleInputChange("KonfirmasiPassword", e.target.value)
                                    }
                                    class={`${style.input} w-full ${
                                        errors().KonfirmasiPassword
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors().KonfirmasiPassword && (
                                    <p class="mt-1 text-sm text-red-600">
                                        {errors().KonfirmasiPassword}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                <div class="flex justify-end mt-auto pt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading()}
                        class={style.buttonPrimary}
                    >
                        {isLoading() ? (
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Menyimpan...</span>
                            </div>
                        ) : (
                            "Simpan Perubahan"
                        )}
                    </button>
                </div>
            </div>
        </GlobalLayout>
    );
}

export default PengaturanAkun;
