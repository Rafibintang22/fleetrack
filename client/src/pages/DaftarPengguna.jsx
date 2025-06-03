import { createEffect, createResource, createSignal, onMount, Show } from "solid-js";
import { HeaderMainContent, Modal, Table } from "../components";
import GlobalLayout from "../components/layout/GlobalLayout";
import { toogleModal, urlServer, UseSessionCheck } from "../Utils";
import { columnPengguna, dataPengguna } from "../Utils/Model";
import axios from "axios";
import { FormTambahPengguna, FormUbahPengguna } from "../components/form";

function DaftarPengguna() {
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

    // Fetch function
    const fetchPengguna = async () => {
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const res = await axios.get(`${urlServer}/pengguna`, headers);

            return res.data.data;
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
            return [];
        }
    };

    // Resource untuk data pengguna
    const [listPengguna, { refetch }] = createResource(fetchPengguna);

    return (
        <>
            <GlobalLayout>
                <div class="flex flex-col gap-10 bg-white rounded p-4 max-h-[90vh]">
                    <HeaderMainContent
                        judul={"Daftar Pengguna"}
                        isTambah={true}
                        judulTambah={"Tambah Data Pengguna"}
                        openModal={openModalTambah}
                    />
                    <div class="w-full h-full overflow-auto">
                        <Show when={!listPengguna.loading} fallback={<p>Loading...</p>}>
                            <Table.Basic
                                column={columnPengguna}
                                data={listPengguna.loading ? [] : listPengguna()}
                                isDetail={true}
                                setOpen={openModalDetail}
                            />
                        </Show>
                    </div>
                </div>
            </GlobalLayout>
            <Modal.Tambah
                open={isModalTambah}
                onClose={closeModalTambah}
                judul="Tambah Data Pengguna"
            >
                <FormTambahPengguna
                    onSuccess={() => {
                        closeModalTambah();
                        refetch();
                    }}
                />
            </Modal.Tambah>

            <Modal.Detail
                open={isModalDetail}
                onClose={() => {
                    closeModalDetail();
                    refetch();
                }}
                judul="Detail Data Pengguna"
            >
                <FormUbahPengguna idData={isModalDetail()} />
            </Modal.Detail>
        </>
    );
}

export default DaftarPengguna;
