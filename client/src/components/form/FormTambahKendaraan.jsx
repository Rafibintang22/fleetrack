import { createEffect, createResource, createSignal } from "solid-js";
import style from "../../style";
import axios from "axios";
import { urlServer } from "../../Utils";
import { validateFormKendaraan } from "../../Utils/Validation";

// Form Component untuk Tambah Data Kendaraan
function FormTambahKendaraan(props) {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    let fileInputRef;

    const [formData, setFormData] = createSignal({
        Nopol: "",
        BahanBakar: "Bensin",
        Jenis: "Mobil",
        Merek: "",
        Tipe: "",
        Status: "Aktif",
        JarakTempuh: 0,
        Foto: null,
        UserIDTerkait: null,
    });

    const [preview, setPreview] = createSignal("");
    const [errors, setErrors] = createSignal({});
    const [isLoading, setIsLoading] = createSignal(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error ketika user mulai mengetik
        if (errors()[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                Foto: file,
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.click();
    };

    axios.defaults.withCredentials = true;
    const fetchOpsiPengguna = async () => {
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const res = await axios.get(`${urlServer}/pengguna/opsi`, headers);

            return res.data.data;
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
            return [];
        }
    };
    const [opsiPengguna, { refetch }] = createResource(fetchOpsiPengguna);

    const handleSubmit = async () => {
        const validation = validateFormKendaraan.tambah(formData());

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
            const form = new FormData();

            form.append("Nopol", formData().Nopol);
            form.append("BahanBakar", formData().BahanBakar);
            form.append("Jenis", formData().Jenis);
            form.append("Merek", formData().Merek);
            form.append("Tipe", formData().Tipe);
            form.append("Status", formData().Status);
            form.append("JarakTempuh", formData().JarakTempuh);
            form.append("UserIDTerkait", formData().UserIDTerkait || null);
            if (formData().Foto) {
                form.append("Foto", formData().Foto);
            }

            const response = await axios.post(`${urlServer}/kendaraan`, form, {
                headers: {
                    authorization: userSession?.AuthKey,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);

            if (response.data?.success === true) {
                alert("Data kendaraan berhasil ditambahkan!");
                // Reset form setelah berhasil
                setFormData({
                    Nopol: "",
                    BahanBakar: "Bensin",
                    Jenis: "Mobil",
                    Merek: "",
                    Tipe: "",
                    Status: "Aktif",
                    JarakTempuh: 0,
                    Foto: null,
                    UserIDTerkait: null,
                });
                setPreview("");

                props.onSuccess();
            }
        } catch (error) {
            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam menambah data kendaraan"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            Nopol: "",
            BahanBakar: "Bensin",
            Jenis: "Mobil",
            Merek: "",
            Tipe: "",
            Status: "Aktif",
            JarakTempuh: 0,
            Foto: null,
            UserIDTerkait: null,
        });
        setPreview("");
        if (fileInputRef) {
            fileInputRef.value = "";
        }
    };
    return (
        <div class="space-y-2">
            {/* Upload Foto */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Foto Kendaraan<span class="text-red-500">*</span>
                </label>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    class="hidden"
                />

                {/* Clickable preview area */}
                <div
                    onClick={triggerFileInput}
                    class={`w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[var(--orange-400)] hover:bg-orange-50 transition-colors duration-200 flex items-center justify-center overflow-hidden ${
                        preview() ? "h-auto min-h-48" : "h-32"
                    }`}
                >
                    {preview() ? (
                        <img
                            src={preview()}
                            alt="Preview Kendaraan"
                            class="w-full h-auto object-contain rounded-lg"
                        />
                    ) : (
                        <div class="text-center">
                            <svg
                                class="w-8 h-8 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                            </svg>
                            <p class="text-xs text-gray-500">Klik untuk upload</p>
                        </div>
                    )}
                </div>
                {preview() && (
                    <p class="text-xs text-gray-500 mt-1">Klik gambar untuk mengganti Foto</p>
                )}
            </div>
            {errors().Foto && <p class="mt-1 text-sm text-red-600">{errors().Foto}</p>}

            {/* Nomor Polisi */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Polisi <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData().Nopol}
                    onInput={(e) => handleInputChange("Nopol", e.target.value)}
                    placeholder="Contoh: D 1234 AB"
                    class={`w-full ${style.input} ${
                        errors().Nopol ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    required
                />
                {errors().Nopol && <p class="mt-1 text-sm text-red-600">{errors().Nopol}</p>}
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Pengguna terkait <span class="text-red-500">*</span>
                </label>
                <select
                    value={formData().UserIDTerkait}
                    onChange={(e) => handleInputChange("UserIDTerkait", e.target.value)}
                    class={`w-full ${style.input} ${
                        errors().UserIDTerkait ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    required
                >
                    <option value={null}>Pilih Pengguna</option>
                    {opsiPengguna.loading
                        ? []
                        : opsiPengguna().map((p) => <option value={p.UserID}>{p.Nama}</option>)}
                </select>
                {errors().UserIDTerkait && (
                    <p class="mt-1 text-sm text-red-600">{errors().UserIDTerkait}</p>
                )}
            </div>

            {/* Row 1: Jenis dan Bahan Bakar */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Kendaraan <span class="text-red-500">*</span>
                    </label>
                    <select
                        value={formData().Jenis}
                        onChange={(e) => handleInputChange("Jenis", e.target.value)}
                        class={`w-full ${style.input} ${
                            errors().Jenis ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                        required
                    >
                        <option value="Mobil">Mobil</option>
                        <option value="Motor">Motor</option>
                        <option value="Truk">Truk</option>
                        <option value="Bus">Bus</option>
                    </select>
                    {errors().Jenis && <p class="mt-1 text-sm text-red-600">{errors().Jenis}</p>}
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Bahan Bakar <span class="text-red-500">*</span>
                    </label>
                    <select
                        value={formData().BahanBakar}
                        onChange={(e) => handleInputChange("BahanBakar", e.target.value)}
                        class={`w-full ${style.input} ${
                            errors().BahanBakar ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                        required
                    >
                        <option value="Bensin">Bensin</option>
                        <option value="Solar">Solar</option>
                        <option value="Listrik">Listrik</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    {errors().BahanBakar && (
                        <p class="mt-1 text-sm text-red-600">{errors().BahanBakar}</p>
                    )}
                </div>
            </div>

            {/* Row 2: Merek dan Tipe */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Merek <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData().Merek}
                        onInput={(e) => handleInputChange("Merek", e.target.value)}
                        placeholder="Contoh: Toyota"
                        class={`w-full ${style.input} ${
                            errors().Merek ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                        required
                    />
                    {errors().Merek && <p class="mt-1 text-sm text-red-600">{errors().Merek}</p>}
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Tipe <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData().Tipe}
                        onInput={(e) => handleInputChange("Tipe", e.target.value)}
                        placeholder="Contoh: Avanza"
                        class={`w-full ${style.input} ${
                            errors().Tipe ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                        required
                    />
                    {errors().Tipe && <p class="mt-1 text-sm text-red-600">{errors().Tipe}</p>}
                </div>
            </div>

            {/* Row 3: Status dan Jarak Tempuh */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={formData().Status}
                        onChange={(e) => handleInputChange("Status", e.target.value)}
                        class={`w-full ${style.input} ${
                            errors().Status ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                    >
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                    {errors().Status && <p class="mt-1 text-sm text-red-600">{errors().Status}</p>}
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Jarak Tempuh (KM)
                    </label>
                    <input
                        type="number"
                        value={formData().JarakTempuh}
                        onInput={(e) =>
                            handleInputChange("JarakTempuh", parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                        min="0"
                        class={`w-full ${style.input} ${
                            errors().JarakTempuh ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                    />
                    {errors().JarakTempuh && (
                        <p class="mt-1 text-sm text-red-600">{errors().JarakTempuh}</p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={resetForm} class={style.buttonLight}>
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

export default FormTambahKendaraan;
