const { response } = require("express");
const { request } = require("http");

module.exports = function (server) {
    const {readLastUsedEmployeeId} = require("../utils")
    const jsonServer = require("json-server");
    const router = jsonServer.router("db.json");
    let employeeIdCounter = readLastUsedEmployeeId();

    // Endpoint to create new employee in a department
    server.post("/api/employees/:id", (request, response) => {
        const departmentId = parseInt(request.params.id);
        const requestBody = request.body;
        const departmentsData = router.db.get("departments").value();

        const index = departmentsData.findIndex( 
            (dept) => dept.id === departmentId
        );
        if (index === -1) {
            response.status(404).json({ error: "Department not found" });
        } else {
            // Get the departments employee list
            const department = departmentsData[index];
            const employeeList = department.employee_list;

            if(requestBody.id === undefined){
                let employeeId;
                employeeId = employeeIdCounter++;
                const newEmployee = {
                    id: employeeId,
                    name: requestBody.name,
                    address: requestBody.address,
                    email: requestBody.email,
                    phone: requestBody.phone
                };

                employeeList.push(newEmployee);
                department.employee_list = employeeList;
                router.db.set("departments", departmentsData).write();
                const lastUsedId = router.db.get("lastUsedId").value();
                lastUsedId.employeeId = employeeIdCounter;
                router.db.set("lastUsedId", lastUsedId).write();
                response.json(departmentsData[index]);
            } else {
                // Else update existing employee
                const employeeIndex = department.employee_list.findIndex((employee) => employee.id === parseInt(requestBody.id));
                if(employeeIndex === -1){
                    response.status(404).json({ error: "Employee not found in the department" });
                } else {
                    requestBody.id = parseInt(requestBody.id);
                    const updatedEmployee = {
                        id: requestBody.id,
                        name: requestBody.name,
                        address: requestBody.address,
                        email: requestBody.email,
                        phone: requestBody.phone
                    };
                    
                    department.employee_list[employeeIndex] = {
                        ...department.employee_list[employeeIndex],
                        ...updatedEmployee
                    }

                    router.db.set("departments", departmentsData).write();
                    response.json(department);
                }

            }
        }
        });

        // Endpoint to get employeeList by department id
        server.get("/api/employees/list/:id", (request, response) => {
            const departmentId = parseInt(request.params.id);
            const departmentsData = router.db.get("departments").value();
            const departament = departmentsData.find((depts) => depts.id === departmentId);

            if(!departament){
                response.status(404).json({ error: "Department not found" });
            } else {
                const employeeList = departament.employee_list;
                response.json(employeeList);
            }
        });

        // Endpoint to get employee by id
        server.get("/api/employees/:dept_id/:id", (request, response) =>{
            const departmentId = parseInt(request.params.dept_id);
            const employeeId = parseInt(request.params.id);
            const departmentsData = router.db.get("departments").value();
            const departament = departmentsData.find((depts) => depts.id === departmentId);

            if(!departament) {
                response.status(404).json({ error: "Department not found" });
            } else {
                const employee = departament.employee_list.find((employee) => employee.id === employeeId);
                if(!employee){
                    response.status(404).json({ error: "Employee not found" });
                } else {
                    response.json(employee);
                }
            }
            
        });

        // Endpoint to delete employee by id
        server.delete("/api/employees/delete/:id", (request, response) => {
            const employeeId = parseInt(request.params.id);
            const departmentsData = router.db.get("departments").value();

            let employeeDeleted = false;
            departmentsData.forEach((department) => {
                const employeeIndex = department.employee_list.findIndex((employee) => employee.id === employeeId);
                if(employeeIndex !== -1){
                    department.employee_list.splice(employeeIndex, 1);
                    employeeDeleted = true;
                }
            })
            if(employeeDeleted){
                router.db.set("departments", departmentsData).write();
                response.json({ message: "Employee deleted successfully" });
            } else {
                response.status(404).json({ error: "Employee not found in any department" });
            }
        })
};