import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(routes);

const PORT = process.env.PORT || 3000;

//get requests
app.get("/", (request, response) => {
  response.cookie("hello", "world", { maxAge: 60000, signed: true });
  response.status(201).send({ message: "Hello" });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
