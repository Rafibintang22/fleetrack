import { createMemo, createSignal, For } from "solid-js";
import CardKendaraan from "./CardKendaraan";
import TableBase from "./TableBase";
import style from "../style";

function DaftarKendaraan(props) {
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = createSignal(1);

    const totalPages = createMemo(() => Math.ceil(props.data.length / itemsPerPage));
    const paginatedData = createMemo(() => {
        const start = (currentPage() - 1) * itemsPerPage;
        return props.data.slice(start, start + itemsPerPage);
    });

    const visiblePages = createMemo(() => {
        const total = totalPages();
        const current = currentPage();
        const delta = 2;
        const range = [];
        for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
            range.push(i);
        }
        if (range[0] > 2) range.unshift("...");
        if (range[0] !== 1) range.unshift(1);
        if (range[range.length - 1] < total - 1) range.push("...");
        if (range[range.length - 1] !== total) range.push(total);
        return range;
    });

    return (
        <div class="flex flex-col gap-5 h-full overflow-y-auto overflow-x-hidden">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
                {paginatedData().length === 0 ? (
                    <div class="col-span-3 text-center text-gray-500 pb-5">Tidak ada data</div>
                ) : (
                    <For each={paginatedData()}>
                        {(kend) => (
                            <CardKendaraan
                                kendaraan={kend}
                                onDetail={props.onDetail}
                                onEdit={props.onEdit}
                                onDelete={props.onDelete}
                            />
                        )}
                    </For>
                )}
            </div>

            {paginatedData().length > 0 && (
                <nav aria-label="navigation table">
                    <ul class="flex flex-wrap justify-center md:justify-end -space-x-px text-sm">
                        <li>
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage() === 1}
                                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                            >
                                &lt;
                            </button>
                        </li>
                        <For each={visiblePages()}>
                            {(page) => (
                                <li>
                                    {page === "..." ? (
                                        <span class="px-3 h-8 text-gray-400 select-none">...</span>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            class={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${
                                                currentPage() === page
                                                    ? "text-[var(--primary)] bg-[var(--primary-light)]"
                                                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )}
                                </li>
                            )}
                        </For>
                        <li>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(p + 1, totalPages()))
                                }
                                disabled={currentPage() === totalPages()}
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                            >
                                &gt;
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

function Basic(props) {
    const baseData = [...props.data]; 
    const baseColumns = [...props.column];
    let column = baseColumns;
    let data = baseData;

    if (props.isDetail === true) {
        column = [...column, { key: "Aksi", name: "Aksi" }]; 

        data = baseData.map((row) => ({
            ...row,
            Aksi: (
                <button
                    class={style.buttonLight}
                    onClick={() => {
                        props.setOpen(row.UserID);
                    }}
                >
                    Lihat detail
                </button>
            ),
        }));
    }

    return <TableBase column={column} rowData={data} limit={props.limit} />;
}

const Table = {
    DaftarKendaraan,
    Basic,
};

export default Table;
