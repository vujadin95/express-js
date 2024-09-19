import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { users } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";

const router = Router();

// get all users
router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must be a string")
    .notEmpty()
    .withMessage("Must not be empty.")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters."),
  (request, response) => {
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
// get single user
router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = users[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  response.send(findUser);
});

// create new user
router.post(
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

// update user
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  users[findUserIndex] = { id: users[findUserIndex].id, ...body };
  return response.send(users);
});

//patch - request for updating only one property on user object
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  users[findUserIndex] = { ...users[findUserIndex], ...body };
  return response.send(users);
});

//delete user
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  users.splice(findUserIndex, 1);
  return response.send(users);
});

export default router;
