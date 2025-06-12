import { createResource, createSignal, For, Show } from "solid-js";
import { HeaderMainContent, Modal, ModalKendaraan, Table } from "../components";
import GlobalLayout from "../components/layout/GlobalLayout";
import { dataKendaraan } from "../Utils/Model";
import { toogleModal, urlServer, UseSessionCheck } from "../Utils";
import axios from "axios";
import { FormKendaraan, FormUbahKendaraan } from "../components/form";

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
            />
          </Show>
        </div>
      </GlobalLayout>
      <ModalKendaraan.Tambah
        open={isModalTambah}
        onClose={closeModalTambah}
        judul="Tambah Data Kendaraan"
      >
        <FormKendaraan
          onSuccess={() => {
            closeModalTambah();
            refetch();
          }}
        />
      </ModalKendaraan.Tambah>
      <ModalKendaraan.Detail
        open={isModalDetail}
        onClose={closeModalDetail}
        judul="Detail Data Kendaraan"
      >
        <FormUbahKendaraan
          idData={isModalDetail()}
          onSuccess={() => {
            closeModalDetail();
            refetch();
          }}
        />
      </ModalKendaraan.Detail>
    </>
  );
}

export default DaftarKendaraan;
