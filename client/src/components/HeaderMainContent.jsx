import style from "../style";

function HeaderMainContent(props) {
    return (
        <div class="flex items-center justify-between">
            <h3 class={style.h3}>{props.judul}</h3>
            {props.isTambah && (
                <button type="button" class={style.buttonPrimary} onClick={props.openModal}>
                    <span class="hidden sm:inline">{props.judulTambah}</span>
                    <span class="inline sm:hidden">Tambah +</span>
                </button>
            )}
        </div>
    );
}

export default HeaderMainContent;
