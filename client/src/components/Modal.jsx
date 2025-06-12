import { createEffect } from "solid-js";
import style from "../style";
import { ModalBase } from "./index";
import axios from "axios";
import { urlServer } from "../Utils";

function Tambah(props) {
    return (
        <ModalBase open={props.open} onClose={props.onClose} judul={props.judul || "Tambah Data"}>
            {props.children}
        </ModalBase>
    );
}

function Detail(props) {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const onDeletePengguna = async () => {
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const response = await axios.delete(`${urlServer}/pengguna/${props.open()}`, headers);

            if (response.data?.success === true) {
                alert("Data pengguna berhasil dihapus");
                location.reload();
            }
        } catch (error) {
            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam hapus data pengguna"
                }`
            );
        }
    };

    const onDeleteKendaraan = async () => {
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const response = await axios.delete(`${urlServer}/kendaraan/${props.open()}`, headers);

            if (response.data?.success === true) {
                alert("Data Kendaraan berhasil dihapus");
                location.reload();
            }
        } catch (error) {
            alert(
                `Terjadi kesalahan${
                    error.response?.data?.message
                        ? ", " + error.response.data.message
                        : " dalam hapus data Kendaraan"
                }`
            );
        }
    };

    return (
        <ModalBase
            open={props.open}
            onClose={props.onClose}
            judul={props.judul || "Detail data"}
            footer={
                <div class="flex justify-between">
                    <button
                        class={style.buttonDanger}
                        onClick={() => {
                            props.judul === "Detail Data Pengguna"
                                ? onDeletePengguna()
                                : onDeleteKendaraan();
                            props.onClose();
                        }}
                    >
                        Hapus
                    </button>
                    <button onClick={props.onClose} class={style.buttonLight}>
                        Tutup
                    </button>
                </div>
            }
        >
            {props.children}
        </ModalBase>
    );
}

const Modal = {
    Tambah,
    Detail,
};

export default Modal;
