import axios from "axios";
import { urlServer } from "../../Utils";
import { createSignal, createEffect, createResource } from "solid-js";
import style from "../../style";
import { validateFormPengguna } from "../../Utils/Validation";

function FormUbahPengguna(props) {
    const userSession = JSON.parse(localStorage.getItem("userSession"));

    const fetchOnePengguna = async (id) => {
        if (!id) return null;

        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const res = await axios.get(`${urlServer}/pengguna/${id}`, headers);

            return res.data.data;
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
            throw error;
        }
    };

    // ✅ Fix: Pass the function and source signal separately
    const [penggunaData, { refetch }] = createResource(() => props.idData, fetchOnePengguna);

    const [isEditing, setIsEditing] = createSignal(false);
    const [originalData, setOriginalData] = createSignal({});
    const [formData, setFormData] = createSignal({
        UserID: "",
        Nama: "",
        Peran: "",
        Kendaraan: [],
        PasswordLama: "",
        PasswordBaru: "",
        KonfirmasiPassword: "",
    });
    const [errors, setErrors] = createSignal({});
    const [isLoading, setIsLoading] = createSignal(false);

    // Update formData saat penggunaData berubah
    createEffect(() => {
        if (penggunaData()) {
            const data = {
                UserID: penggunaData().UserID || "",
                Nama: penggunaData().Nama || "",
                Peran: penggunaData().Peran || "",
                Kendaraan: penggunaData().Kendaraan || [],
                Email: penggunaData().Email || "",
                Perusahaan: penggunaData().Perusahaan || "",
            };
            setFormData({ ...data, PasswordLama: "", PasswordBaru: "", KonfirmasiPassword: "" });
            setOriginalData(data);
        }
    });

    // Handle input change untuk data pengguna
    const handleUserChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error
        if (errors()[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSave = async () => {
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
                `${urlServer}/pengguna/${props.idData}`,
                formData(),
                headers
            );

            if (response.data?.success === true) {
                alert("Data pengguna berhasil diperbarui!");
                setIsEditing(false);
                setOriginalData(formData()); // Update originalData dengan data terbaru
            }
        } catch (error) {
            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam perbarui data pengguna"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle refresh data
    const handleRefresh = () => {
        if (props.idData) {
            refetch();
        }
    };

    // Handle cancel edit
    const handleCancel = () => {
        setFormData({
            ...originalData(),
            PasswordLama: "",
            PasswordBaru: "",
            KonfirmasiPassword: "",
        }); // Reset ke data original
        setErrors({});
        setIsEditing(false);
    };

    const isLoadingData = () => penggunaData.loading;

    // Show loading state saat fetch data
    if (isLoadingData()) {
        return (
            <div class="flex justify-center items-center py-12">
                <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-gray-600">Memuat data pengguna...</span>
                </div>
            </div>
        );
    }

    return (
        <div class="space-y-6">
            {/* Informasi Pengguna */}
            <div class={`${isEditing() ? "" : "bg-gray-50"} rounded-lg p-4`}>
                {/* Header dengan tombol aksi */}
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center space-x-3">
                        <h3 class="text-sm font-medium text-gray-800">Informasi Pengguna</h3>
                        {/* Refresh button */}
                        <button
                            onClick={handleRefresh}
                            title="Muat ulang data"
                            class="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="flex gap-2">
                        {isEditing() ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    class={`${style.buttonLight} text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading()}
                                    class={`${style.buttonPrimary} rounded-lg font-medium transition-all duration-200 `}
                                >
                                    {isLoading() ? (
                                        <div class="flex items-center space-x-2">
                                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Menyimpan...</span>
                                        </div>
                                    ) : (
                                        "Simpan"
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                class={`${style.buttonPrimary} bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors`}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                        <input
                            type="text"
                            value={formData().UserID}
                            disabled
                            class={`w-full ${style.input} border border-gray-300 rounded-lg bg-gray-100 text-gray-600`}
                        />
                    </div>

                    {/* Nama */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nama <span class="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData().Nama}
                            onInput={(e) => handleUserChange("Nama", e.target.value)}
                            disabled={!isEditing()}
                            class={`w-full ${style.input} border rounded-lg transition-colors ${
                                isEditing()
                                    ? `focus:outline-none focus:ring-2  focus:border-transparent ${
                                          errors().Nama
                                              ? "border-red-500 bg-red-50"
                                              : "border-gray-300"
                                      }`
                                    : "border-gray-300 bg-gray-50"
                            }`}
                        />
                        {errors().Nama && <p class="mt-1 text-sm text-red-600">{errors().Nama}</p>}
                    </div>

                    {/* Email */}
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Email <span class="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData().Email}
                            onInput={(e) => handleUserChange("Email", e.target.value)}
                            disabled={!isEditing()}
                            class={`w-full ${style.input} border rounded-lg transition-colors ${
                                isEditing()
                                    ? `focus:outline-none focus:ring-2  focus:border-transparent ${
                                          errors().Email
                                              ? "border-red-500 bg-red-50"
                                              : "border-gray-300"
                                      }`
                                    : "border-gray-300 bg-gray-50"
                            }`}
                        />
                        {errors().Email && (
                            <p class="mt-1 text-sm text-red-600">{errors().Email}</p>
                        )}
                    </div>

                    {/* Peran */}
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Peran <span class="text-red-500">*</span>
                        </label>
                        <select
                            value={formData().Peran}
                            onChange={(e) => handleUserChange("Peran", e.target.value)}
                            disabled={!isEditing()}
                            class={`w-full ${style.input} border rounded-lg transition-colors ${
                                isEditing()
                                    ? `focus:outline-none focus:ring-2  focus:border-transparent ${
                                          errors().Peran
                                              ? "border-red-500 bg-red-50"
                                              : "border-gray-300"
                                      }`
                                    : "border-gray-300 bg-gray-50"
                            }`}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Driver">Driver</option>
                        </select>
                        {errors().Peran && (
                            <p class="mt-1 text-sm text-red-600">{errors().Peran}</p>
                        )}
                    </div>

                    {/* Divider untuk Ganti Password */}
                    <div class="md:col-span-2">
                        <div class="border-t pt-6 mt-4">
                            <h3 class="text-sm font-medium text-gray-800">Ganti Password</h3>
                        </div>
                    </div>

                    {/* Password Lama */}
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Password Lama
                        </label>
                        <input
                            type="password"
                            placeholder="Masukkan password lama"
                            value={formData().PasswordLama}
                            onInput={(e) => handleUserChange("PasswordLama", e.target.value)}
                            disabled={!isEditing()}
                            class={`w-full ${style.input} border rounded-lg transition-colors ${
                                isEditing()
                                    ? `focus:outline-none focus:ring-2  focus:border-transparent ${
                                          errors().PasswordLama
                                              ? "border-red-500 bg-red-50"
                                              : "border-gray-300"
                                      }`
                                    : "border-gray-300 bg-gray-50"
                            }`}
                        />
                        {errors().PasswordLama && (
                            <p class="mt-1 text-sm text-red-600">{errors().PasswordLama}</p>
                        )}
                    </div>

                    {/* Password Baru */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Password Baru
                        </label>
                        <input
                            type="password"
                            placeholder="Masukkan password baru"
                            value={formData().PasswordBaru}
                            onInput={(e) => handleUserChange("PasswordBaru", e.target.value)}
                            disabled={!isEditing()}
                            class={`w-full ${style.input} border rounded-lg transition-colors ${
                                isEditing()
                                    ? `focus:outline-none focus:ring-2  focus:border-transparent ${
                                          errors().PasswordBaru
                                              ? "border-red-500 bg-red-50"
                                              : "border-gray-300"
                                      }`
                                    : "border-gray-300 bg-gray-50"
                            }`}
                        />
                        {errors().PasswordBaru && (
                            <p class="mt-1 text-sm text-red-600">{errors().PasswordBaru}</p>
                        )}
                    </div>

                    {/* Konfirmasi Password Baru */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            placeholder="Konfirmasi password baru"
                            value={formData().KonfirmasiPassword}
                            onInput={(e) => handleUserChange("KonfirmasiPassword", e.target.value)}
                            disabled={!isEditing()}
                            class={`w-full ${style.input} border rounded-lg transition-colors ${
                                isEditing()
                                    ? `focus:outline-none focus:ring-2  focus:border-transparent ${
                                          errors().KonfirmasiPassword
                                              ? "border-red-500 bg-red-50"
                                              : "border-gray-300"
                                      }`
                                    : "border-gray-300 bg-gray-50"
                            }`}
                        />
                        {errors().KonfirmasiPassword && (
                            <p class="mt-1 text-sm text-red-600">{errors().KonfirmasiPassword}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Daftar Kendaraan */}
            <div class="bg-white rounded-lg border">
                <div class="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
                    <h3 class="text-sm font-medium text-gray-800">Daftar Kendaraan</h3>
                    <p class="text-sm text-gray-600 mt-1">
                        Total: {formData().Kendaraan.length} kendaraan
                    </p>
                </div>

                <div class="p-4">
                    {formData().Kendaraan.length === 0 ? (
                        <div class="text-center py-8 text-gray-500">
                            <svg
                                class="mx-auto h-12 w-12 text-gray-400 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            <p>Belum ada kendaraan terdaftar</p>
                        </div>
                    ) : (
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {formData().Kendaraan.map((kendaraan, index) => (
                                <div
                                    key={index}
                                    class="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    {/* Foto Kendaraan */}
                                    {kendaraan.Foto && (
                                        <div class="mb-3">
                                            <img
                                                src={kendaraan.Foto}
                                                alt={`${kendaraan.Merek} ${kendaraan.Tipe}`}
                                                class="w-full h-32 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        {/* Nopol */}
                                        <div>
                                            <label class="block font-medium text-gray-700 mb-1">
                                                No. Polisi
                                            </label>
                                            <input
                                                type="text"
                                                value={kendaraan.Nopol}
                                                onInput={(e) =>
                                                    handleKendaraanChange(
                                                        index,
                                                        "Nopol",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={true}
                                                class={`w-full px-2 py-1 border rounded text-sm border-gray-200 bg-gray-50`}
                                            />
                                        </div>

                                        {/* Merek */}
                                        <div>
                                            <label class="block font-medium text-gray-700 mb-1">
                                                Merek
                                            </label>
                                            <input
                                                type="text"
                                                value={kendaraan.Merek}
                                                disabled={true}
                                                class={`w-full px-2 py-1 border rounded text-sm border-gray-200 bg-gray-50`}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div class="mt-3 flex justify-between items-center">
                                        <span
                                            class={`px-2 py-1 text-xs rounded-full font-medium ${
                                                kendaraan.Status === "Aktif"
                                                    ? "bg-green-100 text-green-800"
                                                    : kendaraan.Status === "Maintenance"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {kendaraan.Status}
                                        </span>
                                        <span class="text-gray-500 text-xs">
                                            {kendaraan.JarakTempuh?.toLocaleString() || 0} km
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormUbahPengguna;
