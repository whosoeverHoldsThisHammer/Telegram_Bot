import { Router } from "express"
import messageRoutes from "./messages.js"

const routerMaster = Router()

routerMaster.use("/", messageRoutes)

export default routerMaster