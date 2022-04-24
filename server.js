//Dependency imports
const app = require('./config/app');

//Server configuration
const PORT = process.env.PORT;

//Start server
const dotenv = require("dotenv");

dotenv.config();

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));