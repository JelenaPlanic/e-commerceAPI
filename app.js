require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// database
const connectDB = require("./db/connectDB");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

// middlewares
const notFoundMiddleware = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");


app.set("trust proxy", 1);
app.use(rateLimiter({
     windowMs: 15 * 60 * 1000,
     max: 60
}));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());


// middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());


// routes
// app.get("/", (req, res) => {
//     res.send('E-Commerce API');
// });

app.get("/api/v1", (req, res) => {
    //console.log(req.cookies);
    console.log(req.signedCookies);
    res.send('E-Commerce API');
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);





const PORT = process.env.PORT || 5000;

const start = async() =>
{
    try 
    {
       await connectDB(process.env.MONGO_URL);
       app.listen(PORT,console.log(`Server is listening on port: ${PORT}...`)); 
    } 
    catch (error) 
    {
        console.log(error);
    }
}

start();