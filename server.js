//Dependency imports
const app = require('./config/app');

//Server configuration
const PORT = process.env.PORT || 8080;

//Start server
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));