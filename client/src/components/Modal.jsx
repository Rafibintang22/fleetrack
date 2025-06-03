import style from "../style";
import ModalBase from "./ModalBase";
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

    const onDelete = async () => {
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            // GUNAKAN props.id, BUKAN props.open()
            const response = await axios.delete(`${urlServer}/pengguna/${props.id}`, headers);

            if (response.data?.success === true) {
                alert("Data pengguna berhasil dihapus");
                if (props.onDeleteSuccess) props.onDeleteSuccess();
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

    return (
        <ModalBase
            open={props.open}
            onClose={props.onClose}
            judul={props.judul || "Detail Data"}
            footer={
                <div class="flex justify-between">
                    <button
                        class={style.buttonDanger}
                        onClick={async () => {
                            await onDelete();
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
