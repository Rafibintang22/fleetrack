import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

function Logout() {
    const navigate = useNavigate();

    onMount(() => {
        // Hapus token dari storage
        localStorage.removeItem("userSession");

        // Redirect ke login
        navigate("/login");
    });

    return <p>Logging out...</p>;
}

export default Logout;
