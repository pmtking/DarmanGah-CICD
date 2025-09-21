import { useGlobalRemoveClass } from "@/types/globaltypes";

const useGlobal = () => {
    const RemoveClass = ({ id, className }: useGlobalRemoveClass) => {
        alert(id)
        const el = document.getElementById(id)
        alert(el)
        if (el) {
            el.classList.remove(className)
        }
    }

    return { RemoveClass } ;
}


export default useGlobal;