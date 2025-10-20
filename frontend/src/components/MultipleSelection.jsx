function MultipleSelection({ selection, allTodosLength, isEnabled, enableSelection, onDelete, onComplete, onSelectAll }){
    return <div className="multiple-selection_container flex flex-row gap-4 flex-wrap">
        <div className="enable-section">
            <button className={`enable-section_button h-full hover:!bg-[#489088bf] !border-[dodgerblue] ${isEnabled ? "!bg-[#485f90a8]" : ""}`} onClick={enableSelection}>
                {isEnabled ? "Disattiva selezione" : "Attiva selezione"}
            </button>
        </div>
        {isEnabled && 
            <>
                <div className="all-selection">
                    <button className="all-selection_button flex gap-2 items-center h-full image-zoom" onClick={onSelectAll}>
                        {allTodosLength == selection.size ? "Deseleziona tutto" : "Seleziona tutto"}
                        <div className="all-selection_icon bg-[#22426b] rounded-4xl w-fit h-auto">
                            <img src="/confirm-white.svg" alt="Selection Icon"/>
                        </div>
                    </button>
                </div>
                <div className="multiple-delete">
                    <button className="multiple-delete_button font-bold !bg-[#8c0909] flex gap-3 disabled:opacity-50 h-full items-center image-zoom !font-bold" onClick={onDelete} disabled={selection.size == 0}>
                        Cancella <img src="/trash-white.svg" alt="Delete Todos"/>
                    </button>
                </div>
                <div className="multiple-completation">
                    <button className="multiple-completation_button font-bold !bg-[#0e6f0e] flex gap-3 disabled:opacity-50 h-full items-center image-zoom !font-bold" onClick={onComplete} disabled={selection.size == 0}>
                        Inverti Completamento <img src="/confirm-white.svg" alt="Complete Todos"/>
                    </button>
                </div>
            </>
        }
    </div>
}

export default MultipleSelection;