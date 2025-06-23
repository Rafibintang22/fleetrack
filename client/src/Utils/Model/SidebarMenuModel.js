const SidebarMenu = [
    // {
    //     link: "/",
    //     name: "Beranda",
    //     icon: { src: "https://img.icons8.com/101828/ios/100/home.png", alt: "icon-home" },
    //     allowedRoles: ["Owner", "Admin", "Driver"],
    // },
    {
        link: "/daftarkendaraan",
        name: "Daftar Kendaraan",
        icon: { src: "https://img.icons8.com/101828/ios/100/car--v1.png", alt: "icon-kendaraan" },
        allowedRoles: ["Owner", "Admin", "Driver"],
    },
    {
        link: "/daftarpengguna",
        name: "Daftar Pengguna",
        icon: {
            src: "https://img.icons8.com/101828/ios/100/conference-call--v1.png",
            alt: "icon-pengguna",
        },
        allowedRoles: ["Owner", "Admin"],
    },
    {
        link: "/pengaturan",
        name: "Pengaturan",
        icon: {
            src: "https://img.icons8.com/101828/ios/100/settings--v1.png",
            alt: "icon-pengaturan",
        },
        allowedRoles: ["Owner", "Admin", "Driver"],
    },
];

export default SidebarMenu;
