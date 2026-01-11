const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app");
const connectToDb = require("./src/db/db");
connectToDb();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
