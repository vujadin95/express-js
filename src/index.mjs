import express from "express";
import routes from "./routes/index.mjs";

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

//get requests
app.get("/", (request, response) => {
  response.status(201).send({ message: "Hello" });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
