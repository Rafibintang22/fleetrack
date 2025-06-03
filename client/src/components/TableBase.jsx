import { createEffect, createMemo, createSignal, For } from "solid-js";

function TableBase({ column, rowData, limit = 10 }) {
    const [currentPage, setCurrentPage] = createSignal(1);
    const rowsPerPage = limit;

    const totalPages = createMemo(() => Math.ceil(rowData.length / rowsPerPage));

    const paginatedData = createMemo(() => {
        const start = (currentPage() - 1) * rowsPerPage;
        const end = currentPage() * rowsPerPage;
        return rowData.slice(start, end);
    });

    const visiblePages = createMemo(() => {
        const total = totalPages();
        const current = currentPage();
        const pages = [];

        // Tampilkan semua jika total halaman <= 5
        if (total <= 5) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            // Selalu tampilkan halaman pertama
            pages.push(1);

            // Tambahkan "..." jika currentPage lebih dari 3
            if (current > 3) {
                pages.push("...");
            }

            // Hitung range tengah (max ±1 dari current, tetap dalam batas)
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Tambahkan "..." jika currentPage kurang dari total - 2
            if (current < total - 2) {
                pages.push("...");
            }

            // Selalu tampilkan halaman terakhir
            pages.push(total);
        }

        return pages;
    });

    return (
        <div class="w-full h-full flex flex-col gap-4 justify-between">
            <div class="relative w-full overflow-x-auto">
                <table class="min-w-full table-auto text-sm text-left rtl:text-right text-gray-500 overflow-auto">
                    <thead class="sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <For each={column}>
                                {(col) => (
                                    <th
                                        key={col.key}
                                        scope="col"
                                        class="px-6 py-3 whitespace-nowrap"
                                    >
                                        {col.name}
                                    </th>
                                )}
                            </For>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData().length === 0 ? (
                            <tr>
                                <td
                                    colspan={column.length}
                                    class="px-6 py-4 text-center text-gray-500"
                                >
                                    Tidak ada data
                                </td>
                            </tr>
                        ) : (
                            <For each={paginatedData()}>
                                {(row) => (
                                    <tr class="bg-white border-b border-gray-200">
                                        <For each={column}>
                                            {(col) => (
                                                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {row[col.key]}
                                                </td>
                                            )}
                                        </For>
                                    </tr>
                                )}
                            </For>
                        )}
                    </tbody>
                </table>
            </div>
            <nav aria-label="navigation table">
                <ul class="flex flex-wrap justify-center md:justify-end -space-x-px text-sm">
                    <li>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage() === 1}
                            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                            <span>&lt;</span>
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
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages()))}
                            disabled={currentPage() === totalPages()}
                            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                            <span>&gt;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default TableBase;
