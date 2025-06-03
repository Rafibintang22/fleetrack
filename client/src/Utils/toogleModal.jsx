import { createSignal, createRoot } from "solid-js";

function toogleModal() {
    const [isModalTambah, setModalTambah] = createSignal(false);
    const [isModalDetail, setModalDetail] = createSignal(null);

    // Modal Tambah
    const openModalTambah = () => setModalTambah(true);
    const closeModalTambah = () => setModalTambah(false);

    // Modal Detail
    const openModalDetail = (idData) => setModalDetail(idData);
    const closeModalDetail = () => setModalDetail(null);
    return {
        isModalTambah,
        openModalTambah,
        closeModalTambah,

        isModalDetail,
        openModalDetail,
        closeModalDetail,
    };
}

export default createRoot(toogleModal);
