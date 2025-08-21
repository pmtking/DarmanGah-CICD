import { createpersonnel } from "../services/personnelService"

 export const addPersonnelController = async(req , res) => {
    try{
        const personel = await createpersonnel(req.body)
        return res.status(201).json(personel)
    }catch(err:any) {
        res.status(400).json({message:err.message})
    }
}