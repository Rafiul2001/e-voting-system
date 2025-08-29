import express from "express"
import cors from 'cors'
import adminRouter from "./routes/admin_route"

const app = express()
app.use(express.json())
app.use(cors())
app.use('/uploads/user_images', express.static('uploads/user_images'))

//Routes

app.use('/api/v1/admin', adminRouter)

export default app