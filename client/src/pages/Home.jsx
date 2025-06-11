import { createSignal, createResource, onMount } from "solid-js";
import { HeaderMainContent, Table } from "../components";
import GlobalLayout from "../components/layout/GlobalLayout";
import style from "../style";
import { UseSessionCheck } from "../Utils";
import {
    columnAktivitas,
    columnPemeliharaan,
    dataAktivitas,
    mapPemeliharaan,
} from "../Utils/Model";


function fetchPemeliharaan() {
    return fetch("/api/pemeliharaan")
      .then(res => {
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        return res.json();
      })
      .then(mapPemeliharaan)
      .catch(err => {
        console.error("Error fetching pemeliharaan:", err);
        throw err; // Penting: tetap lempar error agar Solid tahu kalau ada error
      });
  }

function Home() {
    UseSessionCheck();

    const [dataPemeliharaan] = createResource(fetchPemeliharaan);

    return (
        <GlobalLayout>
            <div class="flex flex-col gap-2 bg-white rounded p-4 h-max lg:h-full">
                <HeaderMainContent judul={"Beranda"} />

                <div class="flex flex-col-reverse lg:flex-row justify-between gap-3 overflow-x-hidden p-2 min-h-[45%]">
                    <div class="flex flex-col gap-2 p-2 rounded-lg shadow w-full min-h-full">
                    <h4 class={style.h4Primary}>Pemeliharaan yang akan datang</h4>
                    <Show when={!dataPemeliharaan.loading && !error} fallback={<p>Loading...</p>}>
                    <Switch>
                        <Match when={dataPemeliharaan()?.length > 0}>
                        <Table.Basic
                            column={columnPemeliharaan}
                            data={dataPemeliharaan()}
                            limit={3}
                        />
                        </Match>
                        <Match when={true}>
                        <p>Tidak ada data pemeliharaan.</p>
                        </Match>
                    </Switch>
                    </Show>

                    <Show when={error}>
                    <p class="text-red-600">Terjadi error saat memuat data.</p>
                    </Show>
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
