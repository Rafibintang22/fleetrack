import { createSignal } from "solid-js";
import style from "../style";
import { useNavigate } from "@solidjs/router";
import { searchState } from "../Utils/searchState";


function Header(props) {
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const dataUser = userSession?.dataUser;
  const [search, setSearch] = searchState;
  const [inputValue, setInputValue] = createSignal(search());

  const navigate = useNavigate();
  const { onHoverIconMobil, onLeaveIconMobil } = props;
  const profileMenu = [
    {
      link: "/logout",
      name: "Keluar",
      icon: (
        <img src="https://img.icons8.com/ios-glyphs/100/exit--v1.png" alt="exit--v1" />
      ),
    },
  ];

  return (
    <div class="relative">
      <div class="flex items-center justify-between bg-white p-2 shadow">
        <a
          class="flex gap-2 items-center cursor-pointer group overflow-hidden"
          href="/"
          onMouseEnter={onHoverIconMobil}
          onMouseLeave={onLeaveIconMobil}
        >
          <img
            class="w-10 h-10 opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out"
            src="https://img.icons8.com/f06605/ios-filled/100/hatchback.png"
            alt="logo-car"
          />
          <h4
            class={`${style.h4Primary} -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out`}
          >
            FleetTrack
          </h4>
        </a>

        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            class="block w-full p-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[var(--orange-500)] focus:border-[var(--orange-500)]"
            placeholder="Cari..."
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setSearch(inputValue());
              }
            }}
          />
        </div>

        <div class="hidden md:block lg:block group relative">
          <div class="profile flex gap-2 items-center bg-primary rounded-lg p-3 w-auto shadow cursor-pointer">
            <div class="flex flex-col text-xs">
              <span class="font-semibold text-[var(--primary)]">
                {dataUser?.Nama}
              </span>
              <span class="font-medium text-gray-700">{dataUser?.Peran}</span>
            </div>
            <div class="relative w-5 h-5">
              {/* default */}
              <img
                class="absolute inset-0 w-full h-full opacity-100 group-hover:opacity-0 transition-opacity duration-200 ease-in-out"
                src="https://img.icons8.com/ios-glyphs/100/expand-arrow--v1.png"
                alt="expand"
              />
              {/* keatas */}
              <img
                class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
                src="https://img.icons8.com/ios-glyphs/100/collapse-arrow--v1.png"
                alt="collapse"
              />
            </div>
          </div>
          {/* Dropdown Menu */}
          <ul class="menu-profile absolute right-0 top-12 w-48 text-sm font-medium text-gray-900 border border-gray-100 bg-white shadow-xl rounded-lg opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 ease-in-out z-50">
            <For each={profileMenu}>
              {(menu, i) => (
                <li
                  key={i}
                  class={`flex gap-2 items-center w-full cursor-pointer px-4 py-2 hover:bg-[var(--primary)] rounded-lg`}
                  onClick={() => navigate(menu.link)}
                >
                  <span class="h-4 w-4">{menu.icon}</span>
                  {menu.name}
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;