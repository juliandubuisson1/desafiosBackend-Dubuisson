import contactModel from './Models/Contacts.js'


export default class Contacts{
    constructor(){

    }
    //Metodos

    getByID = async (id)=>{
        const products = await contactModel.find()
        return products
    }

}