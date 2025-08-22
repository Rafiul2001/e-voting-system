import app from "./app"
import config from "./config/config"
import { connectToDatabase } from "./mongodb_connection/connection"


connectToDatabase()

app.listen(config.port, () => {
    console.log(`Server running on port http://localhost:${config.port}`)
})