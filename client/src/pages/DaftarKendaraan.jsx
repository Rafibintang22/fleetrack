import { createResource, createSignal, For, Show } from "solid-js";
import { HeaderMainContent, Modal, Table } from "../components";
import GlobalLayout from "../components/layout/GlobalLayout";
import { toogleModal, urlServer, UseSessionCheck } from "../Utils";
import { dataKendaraan } from "../Utils/Model";
import axios from "axios";
import { FormTambahKendaraan } from "../components/form";

function DaftarKendaraan() {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    UseSessionCheck();
    const {
        isModalTambah,
        openModalTambah,
        closeModalTambah,
        isModalDetail,
        openModalDetail,
        closeModalDetail,
    } = toogleModal;

    // State untuk edit kendaraan
    const [isModalEdit, setIsModalEdit] = createSignal(false);
    const [editKendaraan, setEditKendaraan] = createSignal(null);

    axios.defaults.withCredentials = true;
    const fetchKendaraan = async () => {
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const res = await axios.get(`${urlServer}/kendaraan`, headers);

            return res.data.data;
        } catch (error) {
            console.error("Gagal mengambil data kendaraan:", error);
            return [];
        }
    };
    const [listKendaraan, { refetch }] = createResource(fetchKendaraan);

    // Handler untuk edit
    const handleEdit = (kendaraan) => {
        setEditKendaraan(kendaraan);
        setIsModalEdit(true);
    };

    // Handler untuk delete
    const handleDelete = async (kendaraan) => {
        if (window.confirm("Yakin ingin menghapus kendaraan ini?")) {
            try {
                const headers = {
                    headers: {
                        authorization: userSession?.AuthKey,
                    },
                };
                await axios.delete(`${urlServer}/kendaraan/${kendaraan.id}`, headers);
                refetch();
                alert("Berhasil menghapus data!");
            } catch (error) {
                alert("Gagal menghapus data kendaraan.");
            }
        }
    };

    return (
        <>
            <GlobalLayout>
                <div class="flex flex-col gap-10 bg-white rounded p-4 max-h-[90vh]">
                    <HeaderMainContent
                        judul={"Daftar Kendaraan"}
                        isTambah={true}
                        judulTambah={"Tambah Data Kendaraan"}
                        openModal={openModalTambah}
                    />
                    <Show when={!listKendaraan.loading} fallback={<p>Loading...</p>}>
                        <Table.DaftarKendaraan
                            data={listKendaraan.loading ? [] : listKendaraan()}
                            setOpen={openModalDetail}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Show>
                </div>
            </GlobalLayout>
            {/* Modal Tambah */}
            <Modal.Tambah
                open={isModalTambah()} // <-- BENAR!
                onClose={closeModalTambah}
                judul="Tambah Data Kendaraan"
            >
                <FormTambahKendaraan
                    onSuccess={() => {
                        closeModalTambah();
                        refetch();
                    }}
                />
            </Modal.Tambah>
            {/* Modal Edit */}
            <Modal.Tambah
                open={isModalEdit()}
                onClose={() => setIsModalEdit(false)}
                judul="Edit Data Kendaraan"
            >
                <FormTambahKendaraan
                    data={editKendaraan()}
                    mode="edit"
                    onSuccess={() => {
                        setIsModalEdit(false);
                        refetch();
                    }}
                />
            </Modal.Tambah>
            {/* Modal Detail */}
            <Modal.Detail
                open={isModalDetail}
                onClose={closeModalDetail}
                judul="Detail Data Kendaraan"
            >
                <p>Konten Modal detail data kendaraan</p>
            </Modal.Detail>
        </>
    );
}

export default DaftarKendaraan;
