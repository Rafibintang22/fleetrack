import style from "../style";

function CardKendaraan(props) {
  return (
    <div
      onClick={props.setOpen}
      class="cursor-pointer bg-gray-50 p-3 md:p-4 max-w-md rounded-lg shadow-sm transform transition-transform duration-200 ease-in-out hover:scale-[1.02]"
    >
      <div class="flex flex-col lg:flex-row">
        {/* gambar kendaraan */}
        <div class="mb-3 lg:mb-0 lg:mr-3 flex-shrink-0">
          <img
            src={props.Foto}
            alt="Yellow Hyundai S Turbo"
            class="rounded-lg w-full lg:w-40 h-36 lg:h-40 object-cover"
          />
        </div>

        <div class="flex flex-col flex-1">
          <h2 class="text-base md:text-lg font-bold text-gray-800 mb-2">{props.Nopol}</h2>

          {/* detail kendaraan */}
          <div class="flex flex-wrap md:flex-nowrap justify-start gap-2 mb-3 h-5">
            <div class="flex items-center text-xs">
              <div class="w-5 h-5 p-1 bg-[var(--orange-100)] rounded-full mr-2">
                <img
                  src="https://img.icons8.com/f06605/ios/100/clock--v3.png"
                  alt="clock"
                />
              </div>
              <span class="text-xs text-gray-600">{props.JarakTempuh}</span>
            </div>
            <div class="flex items-center">
              <div class="w-5 h-5 p-1 bg-[var(--orange-100)] rounded-full mr-2">
                <img
                  src="https://img.icons8.com/f06605/ios/100/petrol.png"
                  alt="petrol"
                />
              </div>
              <span class="text-xs text-gray-600">{props.BahanBakar}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div>
              <span class="text-gray-400">Jenis:</span>
              <span class="text-gray-600 ml-1">{props.Jenis}</span>
            </div>
            <div>
              <span class="text-gray-400">Merek:</span>
              <span class="text-gray-600 ml-1">{props.Merek}</span>
            </div>
            <div>
              <span class="text-gray-400">Tipe:</span>
              <span class="text-gray-600 ml-1">{props.Tipe}</span>
            </div>
          </div>

          <div class="flex w-full justify-between items-center">
            <div
              class={`flex justify-center mt-auto p-1.5 px-4 rounded-full ${props.Status === "Aktif" ? "bg-green-100" : "bg-red-100"
                } w-max`}
            >
              <span
                class={`${props.Status === "Aktif" ? "text-green-700" : "text-red-700"
                  } font-semibold text-base md:text-xs`}
              >
                {props.Status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardKendaraan;
