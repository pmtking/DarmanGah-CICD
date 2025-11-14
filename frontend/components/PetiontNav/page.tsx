import Image from "next/image";
import tamin from "@/public/icons/salamat.png"
import dana from '@/public/icons/dana.png'
//types
interface PetiontnavType {
    image?: String | any;
    name?: String;
    insuranceType?: "تامین اجماعی" | "خدمات درمانی " | "نیروی مسلح " | " ازاد",
    supplementaryInsurance?: "دانا" | "دی" | "ملت" | "سینا" | "معلم ",
}

// function
const Petiontnav = ({
    image,
    name,
    insuranceType,
    supplementaryInsurance,

}: PetiontnavType) => {
    return (
        <>
            <div className=" flex justify-between items-center w-full bg-white px-4 rounded-2xl  py-4">
                <div className="flex justify-center items-center gap-5 border border-gray-300 px-6 rounded-2xl shadow-lg">
                    <div className="overflow-hidden rounded-full padding-2">
                        <img src={'https://i.pinimg.com/736x/73/67/9e/73679e9f2015df2ad523b23aa3ecf4e0.jpg'} alt="image" width={70} />
                    </div>
                    <div className="flex flex-col ">
                        <p className="text-bold">محمد</p>
                        <span className="text-sm text-gray-500">طاهری</span>
                    </div>
                </div>
                <div className="flex relative border border-gray-400 w-[150px] py-4 rounded-2xl justify-center items-center">

                    <div className="bg-white w-max text-sm absolute top-[-10px] px-2 left-0 right-2">
                        بیمه پایه
                    </div>
                    <div className="text-black flex justify-center items-center px-6 bg-gray-200 border border-gray-400 rounded-2xl py-2">
                        <Image src={tamin} alt="" width={35} />
                        سلامت
                    </div>
                </div>
                <div className="flex relative border border-gray-400 w-[150px] py-4 rounded-2xl justify-center items-center">

                    <div className="bg-white w-max text-sm absolute top-[-10px] px-6 left-0 right-1">
                        بیمه تکمیلی
                    </div>
                    <div className="text-black flex justify-center items-center px-6 bg-gray-200 border border-gray-400 rounded-2xl py-2">
                        <Image src={dana} alt="" width={35} />
                        دانا
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <button className="bg-[#071952] px-4 py-2 rounded-2xl text-white" >ثبت بیمه ها</button>
                    <button className="bg-[#071952] px-4 py-2 rounded-2xl text-white" > استعلام</button>
                </div>
            </div>
        </>
    )
}

export default Petiontnav;