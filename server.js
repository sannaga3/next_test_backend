const { createApp } = require("./createApp");

const PORT = 5001;

const server = createApp();
server.listen(PORT, () => console.log(`server is running on Port ${PORT}`));

module.exports = { server };
