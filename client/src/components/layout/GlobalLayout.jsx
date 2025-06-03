import { Sidebar, Header } from "../index";

function GlobalLayout(props) {
    return (
        <div className="container-main w-full h-full flex flex-col fixed bg-gray-100">
            <Header />
            <div class="w-full h-full flex mt-2">
                <Sidebar />
                <div class="ps-2 w-full me-2 overflow-auto">{props.children}</div>
            </div>
        </div>
    );
}

export default GlobalLayout;
