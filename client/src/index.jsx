import { render } from "solid-js/web";
import { Router, Route, useNavigate } from "@solidjs/router";
import {
    Home,
    Login,
    DaftarKendaraan,
    DaftarPengguna,
    PengaturanAkun,
    Register,
    Logout,
} from "./pages";
import "./index.css";
import { onMount } from "solid-js";
import { ProtectedRoute } from "./Utils";

const RedirectHome = () => {
    const navigate = useNavigate();

    onMount(() => {
        navigate("/", { replace: true });
    });

    return null;
};

render(
    () => (
        <Router>
            <Route path="*" component={RedirectHome} />
            <Route path="/logout" component={Logout} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/" component={Home} />
            <Route path="/daftarkendaraan" component={DaftarKendaraan} />
            <Route
                path="/daftarpengguna"
                component={() => (
                    <ProtectedRoute element={DaftarPengguna} allowedRoles={["Owner", "Admin"]} />
                )}
            />
            <Route path="/pengaturan" component={PengaturanAkun} />
        </Router>
    ),
    document.getElementById("root")
);
