import { createSignal } from "solid-js";
import style from "../style";
import { urlServer, UseSessionCheck } from "../Utils";
import { validateFormPengguna } from "../Utils/Validation";
import { useNavigate } from "@solidjs/router";
import axios from "axios";

function Register() {
    UseSessionCheck();

    const navigate = useNavigate();
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const [formData, setFormData] = createSignal({
        NamaPerusahaan: "",
        NamaOwner: "",
        Email: "",
        Password: "",
        KonfirmasiPassword: "",
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

    axios.defaults.withCredentials = true;
    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateFormPengguna.register(formData());

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
            const response = await axios.post(`${urlServer}/register`, formData(), headers);

            if (response.data?.success === true) {
                alert("Pendaftaran akun berhasil");
                // Reset form setelah berhasil
                setFormData({
                    NamaPerusahaan: "",
                    NamaOwner: "",
                    Email: "",
                    Password: "",
                    KonfirmasiPassword: "",
                });
                navigate("/login");
            }
        } catch (error) {
            console.log(error);

            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam pendaftaran akun"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div class="flex justify-center items-center h-screen w-full bg-gray-50">
            <div class="flex flex-col gap-6 p-8 rounded-xl w-full max-w-md bg-white shadow-2xl">
                <h4 class={`${style.h4Primary} text-center text-xl font-semibold `}>Daftar Akun</h4>

                {/* Form */}
                <form class="flex flex-col gap-4 w-full">
                    <div>
                        <label
                            for="NamaPerusahaan"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nama Perusahaan <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="NamaPerusahaan"
                            type="text"
                            value={formData().NamaPerusahaan}
                            onInput={(e) => handleInputChange("NamaPerusahaan", e.target.value)}
                            class={`w-full ${style.input} ${
                                errors().NamaPerusahaan
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                            }`}
                            placeholder="Masukkan nama perusahaan"
                        />
                        {errors().NamaPerusahaan && (
                            <p class="mt-1 text-sm text-red-600">{errors().NamaPerusahaan}</p>
                        )}
                    </div>
                    <div>
                        <label for="NamaOwner" class="block text-sm font-medium text-gray-700 mb-1">
                            Nama Pemilik Perusahaan <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="NamaOwner"
                            type="text"
                            value={formData().NamaOwner}
                            onInput={(e) => handleInputChange("NamaOwner", e.target.value)}
                            class={`w-full ${style.input} ${
                                errors().NamaOwner ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                            placeholder="Masukan nama pemilik perusahaan"
                        />
                        {errors().NamaOwner && (
                            <p class="mt-1 text-sm text-red-600">{errors().NamaOwner}</p>
                        )}
                    </div>
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
                        {errors().Email && (
                            <p class="mt-1 text-sm text-red-600">{errors().Email}</p>
                        )}
                    </div>
                    <div class="flex flex-col w-full md:flex-row gap-2">
                        <div>
                            <label
                                for="Password"
                                class="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password <span class="text-red-500">*</span>
                            </label>
                            <input
                                id="Password"
                                type="password"
                                value={formData().Password}
                                onInput={(e) => handleInputChange("Password", e.target.value)}
                                class={`w-full ${style.input} ${
                                    errors().Password
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="Minimal 8 karakter"
                            />
                            {errors().Password && (
                                <p class="mt-1 text-sm text-red-600">{errors().Password}</p>
                            )}
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
                                onInput={(e) =>
                                    handleInputChange("KonfirmasiPassword", e.target.value)
                                }
                                class={`w-full ${style.input} ${
                                    errors().KonfirmasiPassword
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="Minimal 8 karakter"
                            />
                            {errors().KonfirmasiPassword && (
                                <p class="mt-1 text-sm text-red-600">
                                    {errors().KonfirmasiPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    <div class="flex gap-2 justify-end mt-10">
                        <a class={`${style.buttonLight} py-2 px-4`} href="/login">
                            <span>&lt;</span>
                        </a>
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
                                "Daftar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
