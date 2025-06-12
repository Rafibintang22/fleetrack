import { createEffect, createResource, createSignal } from "solid-js";
import style from "../../style";
import axios from "axios";
import { urlServer } from "../../Utils";
import { validateFormKendaraan } from "../../Utils/Validation";

// Form Component untuk Tambah Data Kendaraan
function FormUbahKendaraan(props) {
    const userSession = JSON.parse(localStorage.getItem("userSession"));

    const [originalData, setOriginalData] = createSignal({});
    const [formData, setFormData] = createSignal({
        KendaraanID: "",
        PenggunaTerkait: "",
        Foto: "",
        JarakTempuh: "",
        BahanBakar: "",
        Jenis: "",
        Merek: "",
        Nopol: "",
        Status: "",
        Tipe: "",
    });

    const fetchOneKendaraan = async (id) => {
        if (!id) return null;

        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const res = await axios.get(`${urlServer}/kendaraan/${id}`, headers);
            // console.log(res.data.data);

            return res.data.data;
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
            throw error;
        }
    };

    const [kendaraanData, { refetch }] = createResource(() => props.idData, fetchOneKendaraan);

    createEffect(() => {
        if (kendaraanData()) {
            const data = {
                KendaraanID: kendaraanData().KendaraanID || "",
                PenggunaTerkait: kendaraanData().PenggunaTerkait.Nama || "",
                Foto: kendaraanData().Foto || "",
                JarakTempuh: kendaraanData().JarakTempuh || "",
                BahanBakar: kendaraanData().BahanBakar || "",
                Jenis: kendaraanData().Jenis || "",
                Merek: kendaraanData().Merek || "",
                Nopol: kendaraanData().Nopol || "",
                Status: kendaraanData().Status || "",
                Tipe: kendaraanData().Tipe || "",
            };
            setFormData(data);
            setOriginalData(data);
            console.log(formData().Foto);
            console.log(formData());
        }
    });

    return (
        <div class="space-y-2">
            {/* display Foto */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Foto Kendaraan<span class="text-red-500">*</span>
                </label>
                <div
                    class={`w-full rounded-lg transition-colors duration-200 flex items-center justify-center overflow-hidden  h-auto min-h-48 
            }`}
                >
                    <img
                        src={formData().Foto}
                        alt="Preview Kendaraan"
                        class="w-full h-auto object-contain rounded-lg"
                    />
                </div>
            </div>

            {/* Nomor Polisi */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Polisi <span class="text-red-500">*</span>
                </label>
                <p
                    class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent  border-gray-300 bg-gray-50`}
                >
                    {formData().Nopol}
                </p>
            </div>

            {/* pengguna terkait */}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Pengguna terkait <span class="text-red-500">*</span>
                </label>
                <p
                    class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent border-gray-300 bg-gray-50`}
                >
                    {formData().PenggunaTerkait}
                </p>
            </div>

            {/* Row 1: Jenis dan Bahan Bakar */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Kendaraan <span class="text-red-500">*</span>
                    </label>
                    <p
                        class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent border-gray-300 bg-gray-50`}
                    >
                        {formData().Jenis}
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Bahan Bakar <span class="text-red-500">*</span>
                    </label>
                    <p
                        class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent border-gray-300 bg-gray-50`}
                    >
                        {formData().BahanBakar}
                    </p>
                </div>
            </div>

            {/* Row 2: Merek dan Tipe */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Merek <span class="text-red-500">*</span>
                    </label>
                    <p
                        class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent border-gray-300 bg-gray-50`}
                    >
                        {formData().Merek}
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Tipe <span class="text-red-500">*</span>
                    </label>
                    <p
                        class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent border-gray-300 bg-gray-50`}
                    >
                        {formData().Tipe}
                    </p>
                </div>
            </div>

            {/* Row 3: Status dan Jarak Tempuh */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <p
                        class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent border-gray-300 bg-gray-50`}
                    >
                        {formData().Status}
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Jarak Tempuh (KM)
                    </label>
                    <p
                        class={`w-full ${style.input} border rounded-lg transition-colors focus:outline-none focus:ring-2  focus:border-transparent border-gray-300 bg-gray-50`}
                    >
                        {formData().JarakTempuh}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FormUbahKendaraan;
