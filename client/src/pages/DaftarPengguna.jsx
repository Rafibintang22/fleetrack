import { createMemo, Show, createEffect } from "solid-js";
import { HeaderMainContent, Modal, Table } from "../components";
import GlobalLayout from "../components/layout/GlobalLayout";
import { toogleModal, urlServer, UseSessionCheck } from "../Utils";
import { columnPengguna } from "../Utils/Model";
import axios from "axios";
import { FormTambahPengguna, FormUbahPengguna } from "../components/form";
import { searchState } from "../Utils/searchState";
import { createResource } from "solid-js";

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

  // Fetch data pengguna dari API
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

  // Resource data pengguna
  const [listPengguna, { refetch }] = createResource(fetchPengguna);

  // Ambil state search global
  const [search] = searchState;

  // Filter data pengguna 
const filteredPengguna = createMemo(() => {
  const term = search().toLowerCase().trim();
  const data = listPengguna() || [];
  const result = data.filter((user) => {
    const jumKendaraan = user.KendTerkait ?? user.JumKendaraan ?? 0;
    return (
      (user?.Nama ?? "").toLowerCase().includes(term) ||
      (user?.Peran ?? "").toLowerCase().includes(term) ||
      (user?.Email ?? "").toLowerCase().includes(term) ||
      String(jumKendaraan).includes(term)
    );
  });
  console.log('Current search:', term);
  console.log('Data length:', data.length);
  console.log('Filtered result:', result.length);
  return result;
});



  const normalizeData = (data) =>
    data.map((user) => ({
      ...user,
      JumKendaraan: user.KendTerkait ?? user.JumKendaraan ?? 0,
    }));
 
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
                {() => {
                    console.log("Filtered pengguna:", filteredPengguna());
                    console.log("Normalized:", normalizeData(filteredPengguna()));

                    return (
                    <Table.Basic
                        column={columnPengguna}
                        data={normalizeData(filteredPengguna())}
                        isDetail={true}
                        setOpen={openModalDetail}
                    />
                    );
                }}
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