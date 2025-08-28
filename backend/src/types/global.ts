export interface  RegisterType {
    number?:string ;
    role?:"USER" | "ADMIN" 
    password ?:string
}

export interface SuperAdmin {
    number?:string ;
    key ?: string ;
}