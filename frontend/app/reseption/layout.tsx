interface RespontionLayoutType {
    children:React.ReactNode
}

const RespontionLayout = ({children}:RespontionLayoutType) => {
    return (
        <>
            <main className="flex justify-center items-center w-screen h-screen "> 
                
                {children}
            </main>
        </>
    )
}

export default RespontionLayout