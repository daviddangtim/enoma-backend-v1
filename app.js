// calling all dependencies
import express  from "express"
import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import router from "./src/routes/routeindex.js"
import connectDB from "./src/config/db.js";

//initializing the dot env method
dotenv.config()

//assigning the express method to a variable
const app = express()

//using the express functions
app.use(express.json());
app.use(cors({origin: "*"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api', router)

//creating the start server method
const startserver = async () => {
    //calling the env file
    const PORT = process.env.PORT || 7788
    try {
        app.listen(PORT,() => {console.log(`ENOMA-APP IS RUNNING ON PORT: ${PORT}`);})
        connectDB()
    } catch (error) {
        console.log(error);
    }
};

startserver();

app.get("/", (req,res) =>{
    res.send('API IS RUNNING')
})