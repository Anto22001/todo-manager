function TodoCategory({ className, category }){
    return <div style={{ backgroundColor: category?.color}} className={`px-3 ${className} w-full text-lg rounded-4xl text-left font-bold`}>
        {category?.title}
    </div>
}

export default TodoCategory;