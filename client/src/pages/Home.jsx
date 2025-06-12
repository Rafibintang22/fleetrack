import axios from "axios";
import { HeaderMainContent, Table } from "../components";
import GlobalLayout from "../components/layout/GlobalLayout";
import style from "../style";
import { UseSessionCheck } from "../Utils";
import {
    columnAktivitas,
    columnPemeliharaan,
    dataAktivitas,
    dataPemeliharaan,
} from "../Utils/Model";
import { createResource } from "solid-js";

function Home() {
    UseSessionCheck();
    const userSession = JSON.parse(localStorage.getItem("userSession"));

    //fetch function untuk mengambil jumlah kendaraan
    const fetchJumlahKendaraan = async () => {
        try {
            const headers = {
                headers: {
                    authorization: userSession?.AuthKey,
                },
            };
            const res = await axios.get(`${urlServer}/kendaraan/dashboard`, headers);
            return res.data.message;
        } catch (error) {
            console.error("Gagal mengambil data kendaraan:", error);
            return {
                totalKendaraan: 0,
                totalAktif: 0,
                totalDalamPerbaikan: 0,
                totalTidakAtif: 0,
            };
        }
    };

    // Resource untuk data kendaraan
    const [jumlahKendaraan] = createResource(fetchJumlahKendaraan);

    return (
        <GlobalLayout>
            <div class="flex flex-col gap-2 bg-white rounded p-4 h-max lg:h-full">
                <HeaderMainContent judul={"Beranda"} />

                <div class="flex flex-col-reverse lg:flex-row justify-between gap-3 overflow-x-hidden p-2 min-h-[45%]">
                    <div class="flex flex-col gap-2 p-2 rounded-lg shadow w-full min-h-full">
                        <h4 class={style.h4Primary}>Pemeliharaan yang akan datang</h4>
                        <Table.Basic
                            column={columnPemeliharaan}
                            data={dataPemeliharaan}
                            limit={3}
                        />
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full lg:w-max min-h-full">
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Total Kendaraan</h5>
                            <span class="text-2xl font-semibold text-[var(--primary)]">
                                {jumlahKendaraan.loading ? "-" : jumlahKendaraan()?.totalKendaraan}
                            </span>
                        </div>
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Kendaraan Aktif</h5>
                            <span class="text-2xl font-semibold text-green-600">
                                {jumlahKendaraan.loading ? "-" : jumlahKendaraan()?.totalAktif}
                            </span>
                        </div>
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Dalam Perbaikan</h5>
                            <span class="text-2xl font-semibold text-yellow-500">
                                {jumlahKendaraan.loading ? "-" : jumlahKendaraan()?.totalDalamPerbaikan}
                            </span>
                        </div>
                        <div class="p-4 flex flex-col rounded-lg shadow">
                            <h5 class={style.h5}>Tidak Aktif</h5>
                            <span class="text-2xl font-semibold text-red-600">
                                {jumlahKendaraan.loading ? "-" : jumlahKendaraan()?.totalTidakAtif}
                            </span>
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
