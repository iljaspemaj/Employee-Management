const jsonServer = require("json-server");
const jsonServerPort = 8095;

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(jsonServer.bodyParser);
server.use(middlewares)

const departmentsRoutes = require("./routes/departments");
const employeesRoutes = require("./routes/employees");

departmentsRoutes(server);
employeesRoutes(server);

server.listen(jsonServerPort, () => {
    console.log(`JSON Server is running on port ${jsonServerPort}`);
})