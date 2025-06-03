import { createMemo, createSignal, onMount } from "solid-js";
import style from "../style";
import axios from "axios";
import { urlServer, UseSessionCheck } from "../Utils";
import { useNavigate } from "@solidjs/router";

function Login() {
    UseSessionCheck();
    const navigate = useNavigate();
    const [showLogo, setShowLogo] = createSignal(false);
    const [showForm, setShowForm] = createSignal(false);
    onMount(() => {
        setTimeout(() => {
            setShowLogo(true);
            setTimeout(() => {
                setShowForm(true);
            }, 800); //tunda form muncul
        }, 800); // tunda awal animasi logo
    });

    const [dataLogin, setDataLogin] = createSignal({ Email: "", Password: "" });
    const handleInputChange = (type, e) => {
        const value = e.target.value;
        setDataLogin((prev) => ({ ...prev, [type]: value }));
    };

    axios.defaults.withCredentials = true;
    const login = async () => {
        try {
            const response = await axios.post(`${urlServer}/login`, dataLogin());

            if (response.data?.success == true) {
                const authorizationHeader = response.headers["authorization"];
                const userSession = {
                    AuthKey: authorizationHeader.replace("Bearer ", ""),
                    dataUser: response.data.data,
                };

                if (userSession.AuthKey !== "") {
                    localStorage.setItem("userSession", JSON.stringify(userSession));
                }

                alert("Login berhasil");
                navigate("/");
            }
        } catch (error) {
            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam melakukan login"
                }`
            );
        }
    };

    return (
        <div class="flex justify-center items-center h-screen w-full ">
            <div class="flex flex-col gap-6 p-10 rounded-xl  w-full max-w-md">
                <p
                    class={`text-xs text-center ${
                        showForm()
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10 pointer-events-none"
                    }`}
                >
                    Fitur yang dapat dilakukan saat ini masih terbatas : login, registrasi,
                    mengelola data pengguna, pengaturan akun, tambah kendaraan, lihat kendaraan
                    sesuai dengan perusahaannya.
                </p>
                <div class="flex gap-2 items-center group overflow-hidden justify-center">
                    <img
                        class={`w-10 h-10 transform transition-all duration-500 ease-out ${
                            showLogo() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                        } group-hover:opacity-100 group-hover:translate-x-0`}
                        src="https://img.icons8.com/f06605/ios-filled/100/hatchback.png"
                        alt="logo-car"
                    />
                    <h4
                        class={`${
                            style.h4Primary
                        } text-xl font-semibold transform transition-all duration-500 ease-out ${
                            showLogo() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                        } group-hover:opacity-100 group-hover:translate-x-0`}
                    >
                        FleetTrack
                    </h4>
                </div>

                {/* input Form */}
                <form
                    onsubmit={(e) => {
                        e.preventDefault();
                        login();
                    }}
                    class={`flex flex-col gap-4 w-full transition-all duration-700 ease-out ${
                        showForm()
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10 pointer-events-none"
                    }`}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        class={style.input}
                        value={dataLogin().Email}
                        onInput={(e) => handleInputChange("Email", e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        class={style.input}
                        value={dataLogin().Password}
                        onInput={(e) => handleInputChange("Password", e)}
                    />

                    <p class="text-sm text-end text-gray-600">
                        Belum punya akun?{" "}
                        <a href="/register" class="text-[var(--orange-600)] hover:underline">
                            Daftar sekarang
                        </a>
                    </p>
                    <button type="submit" class={`${style.buttonPrimary} py-2`}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
