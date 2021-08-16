import mongoose from "mongoose";
import faker from "faker";
import { ChangeEvent } from "mongodb";
import User, { UserInput, UserDocument } from "./models/user.model";

const mongoUri: string = "mongodb://localhost/mongoose-watch";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"));

async function createUser(payload: UserInput) {
  return User.create(payload);
}

User.watch().on("change", (data: ChangeEvent<UserDocument>) => {
  if (data.operationType === "insert") {
    console.log("User inserted: ", data.fullDocument);
  }

  if (data.operationType === "replace") {
    console.log("User updated: ", data.fullDocument);
  }

  if (data.operationType === "delete") {
    console.log("User deleted: ", data._id);
  }
});

async function run() {
  await createUser({
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  });
}

run();
