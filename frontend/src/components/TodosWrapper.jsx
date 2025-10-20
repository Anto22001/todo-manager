function TodosWrapper({ children }){
    return <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full pb-10">
        {children}
    </div>
}

export default TodosWrapper;