import { Router } from 'express'
import Contacts from '../dao/mongo/contacts.mongo.js'
import Contacts from '../dao/memory/contacts.memory.js'
const router = Router


const contactService = new Contacts()

reouter.get ("/", async (req, res)=>{

    const results = await contactService.get()
    res.status(200).send({status:"success", payload:"Todos los contactos"})
})

export default router;