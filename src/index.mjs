import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json());

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = users.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};

// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: "anson", displayName: "Anson" },
  { id: 2, username: "jack", displayName: "Jack" },
  { id: 3, username: "adam", displayName: "Adam" },
  { id: 4, username: "tina", displayName: "Tina" },
  { id: 5, username: "jason", displayName: "Jason" },
  { id: 6, username: "henry", displayName: "Henry" },
  { id: 7, username: "marlyn", displayName: "Marlyn" },
];

//get requests
app.get("/", (request, response) => {
  response.status(201).send({ message: "Hello" });
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must be a string")
    .notEmpty()
    .withMessage("Must not be empty.")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters."),
  (request, response) => {
    // console.log(request["express-validator#contexts"]);
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        users.filter((user) => user[filter].includes(value))
      );

    return response.send(users);
  }
);

app.use(loggingMiddleware);

app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = users[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

// post requests
app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);

    const newUser = { id: users[users.length - 1].id + 1, ...data };
    users.push(newUser);
    return response.status(201).send(newUser);
  }
);

//put request for updating whole user or product or whatever
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  users[findUserIndex] = { id: users[findUserIndex].id, ...body };
  return response.send(users);
});

//patch requset for partial update of the user, product or whatever
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  users[findUserIndex] = { ...users[findUserIndex], ...body };
  return response.send(users);
});

//delete
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  users.splice(findUserIndex, 1);
  return response.send(users);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

//localhost:3000
//localhost:3000/users
//localhost:3000/products?filter=username&value=an
