import style from "../style";

function ModalBase({ open, onClose, judul, children, footer }) {
    return (
        <div
            class={`fixed inset-0 z-50 bg-[var(--transparant)] overflow-auto flex justify-center items-center transition-opacity duration-300 ${
                open() ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
        >
            <div
                class="relative p-4 w-full max-w-2xl max-h-full"
                //biar container modal dipencet ga ke close
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    class={`transform transition-all duration-300 ease-out ${
                        open() ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    } bg-white rounded-lg shadow-sm`}
                >
                    <div class="flex items-center justify-between p-2 md:p-3 border-b rounded-t border-gray-200">
                        <h3 class={style.h3}>{judul}</h3>
                        <button type="button" onClick={onClose} class={style.buttonGhost}>
                            <img
                                class="h-6 w-6"
                                src="https://img.icons8.com/ios/100/multiply.png"
                                alt="multiply"
                            />
                        </button>
                    </div>
                    <div class="p-4">{children}</div>
                    {footer && <div class="p-3 border-t border-gray-200">{footer}</div>}
                </div>
            </div>
        </div>
    );
}

export default ModalBase;
