module.exports = function (server) {
    const { readLastUsedDepartmentId } = require("../utils");

    let departmentIdCounter = readLastUsedDepartmentId();

    const jsonServer = require("json-server");

    const router = jsonServer.router("db.json");

    // Endpoint for creating and updating new department
    server.post("/api/departments", (request, response) => {
        const requestBody = request.body;
        // If true = > create new department
        if (requestBody.id === undefined) {
            let departmentId = departmentIdCounter++;
            const newDepartment = {
                id: departmentId,
                name: requestBody.name,
                employee_list: [],
            };

            const departmentsData = router.db.get("departments").value();
            departmentsData.push(newDepartment);

            router.db.set("departments", departmentsData).write();

            const lastUsedId = router.db.get("lastUsedId").value();
            lastUsedId.departmentId = departmentIdCounter;
            router.db.set("lastUsedId", lastUsedId).write();

            response.json(newDepartment);
        } else {
            // else => update existing department
            const departmentsData = router.db.get("departments").value();
            const departmentId = parseInt(requestBody.id, 10);
            const index = departmentsData.findIndex(
                (dept) => dept.id === departmentId
            );

            if (index === -1) {
                response.status(404).json({ error: "Department not found" });
            } else {
                departmentsData[index] = {
                    ...departmentsData[index],
                    ...requestBody,
                };

                router.db.set("departments", departmentsData).write();
                response.json(departmentsData[index]);
            }
        }
    });


    // Endpoint to fetch all departments
    server.get("/api/departments/all", (request, response) => {
        const departmentsData = router.db.get("departments").value();
        response.json(departmentsData);
    });

    // Enpoint to fetch department by id
    server.get("/api/departments/id/:id", (request, response) => {
        const departmentId = parseInt(request.params.id);

        const departmentsData = router.db.get("departments").value();

        const department = departmentsData.find(
            (dept) => dept.id === departmentId
        );

        if (!department) {
            response.status(404).json({ error: "Department not found!" });
        } else {
            response.json(department);
        }
    });

    // Endpoint to delete department by id
    server.delete("/api/departments/delete/:id", (request, response) => {
        const departmentId = parseInt(request.params.id);

        const departmentsData = router.db.get("departments").value();

        const departmentIndex = departmentsData.findIndex(
            (dept) => dept.id === departmentId
        );

        if (departmentIndex === -1) {
            return response.status(404).json({ error: "Department not found" });
        }

        const department = departmentsData[departmentIndex];
        if (department.employee_list.length > 0) {
            return response
                .status(400)
                .json({ error: "Cannot delete department with employees" });
        }

        const updatedDepartments = departmentsData.filter(
            (dept) => dept.id !== departmentId
        );

        router.db.set("departments", updatedDepartments).write();

        response.json({ message: "Department deleted successfylly" });
    });
};