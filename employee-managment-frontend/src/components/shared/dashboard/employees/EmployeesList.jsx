import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import EditEmployeeStatus from './EditEmployeeStatus';
import EditEmployeeDepartment from './EditEmployeeDepartment';

const EmployeesList = ({ employees, }) => {
  const [updatedEmployees, setUpdatedEmployees] = useState(employees);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      
      try {
        const response = await fetch(`http://localhost:8095/api/departments`, 
        {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      
        if (!response.ok) {
          throw new Error("Failed to load departments");
        }

        const data = await response.json();
        setDepartments(data);
    } catch (error) {
        console.error("Error fetching departments:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentUpdated = (userId, newDepartmentId) => {
    setUpdatedEmployees((prev) => 
      prev.map((emp) =>
        emp.user_id === userId 
    ? {
          ...emp,
          department_id: newDepartmentId,
          department_name: departments.find(
          (dept) => dept.id === newDepartmentId
        )?.name,
        }
      : emp
    )
  );
};
  
  

  const handleStatusUpdated = (updatedEmployees) => {
    setUpdatedEmployees((prev) => 
      prev.map((emp) =>
        emp.user_id === updatedEmployees.user_id
      ? updatedEmployees
      : emp 
      )
    );
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Departments</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {updatedEmployees.map((employee, index) => (
            <TableRow key={employee.user_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{employee.user_name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell><EditEmployeeStatus
              userId={employee.user_id}
              currentStatus={employee.status}
              onStatusUpdated={handleStatusUpdated}
              />
              </TableCell>
              <TableCell>
                <EditEmployeeDepartment
                userId={employee.user_id}
                currentDepartmentName={employee.department_name}
                departments={departments}
                onDepartmentUpdated={handleDepartmentUpdated}
                />
              </TableCell>
            </TableRow>
          
        ))}
      </TableBody>
    </Table>
  );
}

export default EmployeesList