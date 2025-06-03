import { useNavigate, useLocation } from "@solidjs/router";
import axios from "axios";
import { createEffect } from "solid-js";
import { urlServer } from "./endpoint";

const UseSessionCheck = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ambil lokasi route sekarang
    axios.defaults.withCredentials = true;

    createEffect(() => {
        const userSession = JSON.parse(localStorage.getItem("userSession"));

        const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

        // Kalau tidak ada session, hanya boleh akses /login atau /register
        if (!userSession || !userSession.AuthKey) {
            if (!isAuthPage) {
                navigate("/login", { replace: true });
            }
            return;
        }

        // Kalau ada session dan sekarang di halaman /login atau /register, arahkan ke /
        if (userSession && isAuthPage) {
            navigate("/", { replace: true });
            return;
        }

        // Verifikasi session ke server
        const verifySession = async () => {
            const headers = {
                headers: {
                    authorization: userSession.AuthKey,
                },
            };
            try {
                await axios.get(`${urlServer}/auth/session`, headers);
            } catch (error) {
                localStorage.removeItem("userSession"); // bersihkan localStorage kalau token invalid
                navigate("/login");
            }
        };

        verifySession();
    }, [navigate, location]);
};

export default UseSessionCheck;
