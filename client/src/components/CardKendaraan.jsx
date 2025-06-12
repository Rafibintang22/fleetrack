import style from "../style";

function CardKendaraan(props) {
    const { kendaraan, onDetail, onEdit, onDelete } = props;

    return (
        <div
            onClick={() => onDetail?.(kendaraan)}
            class="relative cursor-pointer bg-gray-50 p-3 md:p-4 max-w-md rounded-lg shadow-sm transform transition-transform duration-200 ease-in-out hover:scale-[1.02]"
        >
            <div class="absolute top-2 right-2 flex gap-2 z-10">
                <button
                    class="bg-blue-500 text-white px-2 py-1 rounded text-xs shadow"
                    title="Edit"
                    onClick={e => {
                        e.stopPropagation();
                        console.log("Edit click", kendaraan);
                        onEdit?.(kendaraan);
                    }}
                >
                    Edit
                </button>
                <button
                    class="bg-red-500 text-white px-2 py-1 rounded text-xs shadow"
                    title="Delete"
                    onClick={e => {
                        e.stopPropagation();
                        onDelete?.(kendaraan);
                    }}
                >
                    Delete
                </button>
            </div>
            <div class="flex flex-col lg:flex-row">
                <div class="mb-3 lg:mb-0 lg:mr-3 flex-shrink-0">
                    <img
                        src={props.kendaraan.Foto}
                        alt={props.kendaraan.Nopol}
                        class="rounded-lg w-full lg:w-40 h-36 lg:h-40 object-cover"
                    />
                </div>
                <div class="flex flex-col flex-1">
                    <h2 class="text-base md:text-lg font-bold text-gray-800 mb-2">{props.kendaraan.Nopol}</h2>
                    <div class="flex flex-wrap md:flex-nowrap justify-start gap-2 mb-3 h-5">
                        <div class="flex items-center text-xs">
                            <span class="text-xs text-gray-600">{props.kendaraan.JarakTempuh}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="text-xs text-gray-600">{props.kendaraan.BahanBakar}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                            <span class="text-gray-400">Jenis:</span>
                            <span class="text-gray-600 ml-1">{props.kendaraan.Jenis}</span>
                        </div>
                        <div>
                            <span class="text-gray-400">Merek:</span>
                            <span class="text-gray-600 ml-1">{props.kendaraan.Merek}</span>
                        </div>
                        <div>
                            <span class="text-gray-400">Tipe:</span>
                            <span class="text-gray-600 ml-1">{props.kendaraan.Tipe}</span>
                        </div>
                    </div>
                    <div class="flex w-full justify-between items-center">
                        <div
                            class={`flex justify-center mt-auto p-1.5 px-4 rounded-full ${
                                props.kendaraan.Status === "Aktif" ? "bg-green-100" : "bg-red-100"
                            } w-max`}
                        >
                            <span
                                class={`${
                                    props.kendaraan.Status === "Aktif" ? "text-green-700" : "text-red-700"
                                } font-semibold text-base md:text-xs`}
                            >
                                {props.kendaraan.Status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardKendaraan;
