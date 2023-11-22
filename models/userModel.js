const mongoose = require("mongoose");
const UserSchema = require("./User");
const user_cre = mongoose.model("user_creds", UserSchema);
mongoose
  .connect("mongodb://localhost:27017/Credential", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log("Mongodb connection error", error);
  });
module.export={
    user_cre
};
