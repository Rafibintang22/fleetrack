import { createSignal, createResource, onMount, Show } from "solid-js";
import { HeaderMainContent, Table } from "../components";
import GlobalLayout from "../components/layout/GlobalLayout";
import style from "../style";
import { UseSessionCheck } from "../Utils";
import { columnAktivitas, columnPemeliharaan, dataAktivitas } from "../Utils/Model";

async function fetchKendaraan() {
    return {
      data: [
        {
          Nopol: "B 1234 XYZ",
          Jenis: "Pickup",
          Merek: "Toyota",
          Tipe: "Hilux",
          JarakTempuh: 12345,
          BahanBakar: "Solar",
          Status: "Aktif",
        },
        {
          Nopol: "B 5678 ABC",
          Jenis: "Truck",
          Merek: "Isuzu",
          Tipe: "Giga",
          JarakTempuh: 45678,
          BahanBakar: "Solar",
          Status: "Dalam Perbaikan",
        },
        {
          Nopol: "D 9123 DEF",
          Jenis: "SUV",
          Merek: "Mitsubishi",
          Tipe: "Pajero",
          JarakTempuh: 7890,
          BahanBakar: "Bensin",
          Status: "Tidak Aktif",
        },
      ],
    };
  }
  
function Home() {
  UseSessionCheck();

  const [dataKendaraan] = createResource(fetchKendaraan);

  return (
    <GlobalLayout>
        <div class="flex flex-col gap-2 bg-white rounded p-4 h-max lg:h-full">
            <HeaderMainContent judul={"Beranda"} />

            <div class="flex flex-col-reverse lg:flex-row justify-between gap-3 overflow-x-hidden p-2 min-h-[45%]">
                    <div class="flex flex-col gap-2 p-2 rounded-lg shadow w-full min-h-full">
                            <div class="flex flex-col gap-2 p-2 rounded-lg shadow w-full min-h-full">
                                <h2 class="text-lg font-semibold">Daftar Kendaraan</h2>

                                {dataKendaraan.loading && <p>Loading...</p>}
                                {dataKendaraan.error && <p class="text-red-500">Error fetching data</p>}

                                {dataKendaraan() && (
                                    <Table.Basic
                                    data={dataKendaraan().data}
                                    column={[
                                        { key: "Nopol", name: "Nomor Polisi" },
                                        { key: "Jenis", name: "Jenis" },
                                        { key: "Merek", name: "Merek" },
                                        { key: "Tipe", name: "Tipe" },
                                        { key: "JarakTempuh", name: "Jarak Tempuh" },
                                        { key: "BahanBakar", name: "Bahan Bakar" },
                                        { key: "Status", name: "Status" },
                                    ]}
                                    limit={10}
                                    />
                                )}
                            </div>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full lg:w-max min-h-full">
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Total Kendaraan</h5>
                            <span class="text-2xl font-semibold text-[var(--primary)]">120</span>
                        </div>
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Kendaraan Aktif</h5>
                            <span class="text-2xl font-semibold text-green-600">85</span>
                        </div>
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Dalam Perbaikan</h5>
                            <span class="text-2xl font-semibold text-yellow-500">25</span>
                        </div>
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Tidak Aktif</h5>
                            <span class="text-2xl font-semibold text-red-600">10</span>
                        </div>
                    </div>
            </div>

                <div class="flex flex-col gap-2 p-2 rounded-lg shadow w-full min-h-[45%] lg-h-[45%]">
                    <h4 class={style.h4Primary}>Aktivitas terakhir</h4>
                    <Table.Basic column={columnAktivitas} data={dataAktivitas} limit={3} />
                </div>
        </div>
    </GlobalLayout>
    );
}

export default Home;
