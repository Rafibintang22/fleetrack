import { useLocation } from "@solidjs/router";
import { For } from "solid-js";
import { SidebarMenu } from "../Utils/Model";

function Sidebar() {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const userRole = userSession?.dataUser?.Peran;

    const location = useLocation();
    const currentPath = () => location.pathname;

    function updateIconColor(src, colorHex) {
        return src.replace(/\/[A-Fa-f0-9]{6}\//, `/${colorHex}/`);
    }

    const filteredMenu = () => SidebarMenu.filter((menu) => menu.allowedRoles.includes(userRole));

    return (
        <aside class="hidden sm:flex flex-col gap-5 bg-white mb-2 p-5 pt-25 rounded">
            <For each={filteredMenu()}>
                {(menu, key) => (
                    <a
                        key={key()}
                        href={menu.link}
                        class={`p-2 flex items-center gap-2 ${
                            currentPath() === menu.link ? "bg-[var(--primary)]" : ""
                        } text-gray-900 rounded-lg hover:bg-[var(--primary)]`}
                        onMouseEnter={(e) => {
                            e.currentTarget.querySelector("img").src = updateIconColor(
                                menu.icon.src,
                                "FFFFFF"
                            );
                        }}
                        onMouseLeave={(e) => {
                            const color = currentPath() === menu.link ? "FFFFFF" : "101828";
                            e.currentTarget.querySelector("img").src = updateIconColor(
                                menu.icon.src,
                                color
                            );
                        }}
                    >
                        <div class="w-5.5 h-5.5">
                            <img
                                src={
                                    currentPath() === menu.link
                                        ? updateIconColor(menu.icon.src, "FFFFFF")
                                        : menu.icon.src
                                }
                                alt={menu.icon.alt}
                            />
                        </div>
                    </a>
                )}
            </For>
        </aside>
    );
}

export default Sidebar;
