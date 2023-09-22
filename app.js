const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const guideRoutes = require("./routes/guide");
const isAuth = require("./middlewares/auth");
// const swaggerUi = require("swagger-ui-express");
const { swaggerServe, swaggerSetup } = require("./config");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", userRoutes);
app.use("/", guideRoutes);
// app.use(isAuth);
app.use("/api-docs", swaggerServe, swaggerSetup);

mongoose
  .connect(process.env.MONGO_DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
