import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, } from "@/components/ui/card";
import { useParams} from "react-router-dom";

const DepartmentEmployees = () => {
    const { id: selectedDepartmentId } = useParams();
    const { toast } = useToast();

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesRes, departmentsRes] = await Promise.all([
                    fetch(
                        `http://localhost:8095/api/employees/department/${selectedDepartmentId}`,
                        {
                            headers: { 
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`, 
                            },
                        }
                    ),
                    fetch(
                        `http://localhost:8095/api/departments`,
                        {
                            headers: { 
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`, 
                            },
                        }
                    ),
                ]);

                if (!departmentsRes.ok) {
                    throw new Error("Failed to fetch departments.");
                }

                const employeesData = employeesRes.ok && employeesRes.status !== 404
                ? await employeesRes.json()
                : [];

                const departamentsData = await departmentsRes.json();

                setEmployees(Array.isArray(employeesData) ? employeesData : []);
                setDepartments(Array.isArray(departamentsData) ? departamentsData : []);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
                setEmployees([]);
                setDepartments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDepartmentId, toast]);

    const handleDepartmentChange = async (userId, newDepartmentId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8095/api/employees/update-department`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ 
                        user_id: userId,
                        department_id: newDepartmentId 
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update department.");
            }

            toast({
                title: 'Success',
                description: `Employee's department updated successfully`,
            });

            setEmployees((prev) =>
                prev.filter((emp) => emp.user_id !== userId)
            );
    } catch (error) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    }
};

    return (
        <Card>
            <CardHeader>
                <CardTitle>Employees in Department </CardTitle>
            </CardHeader>
            <CardTitle>
                {loading ? (
                    <p>Loading...</p>
                ) : employees.length === 0 ? (
                <p className='text-gray-500 text-center'>
                    No employees found in this department.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Department</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(employees) && employees.length > 0 ? (
                                employees.map((employee, index) => (
                                    <TableRow key={employee.user_id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{employee.user_name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            <Select 
                                                defaultValue={String (
                                                    selectedDepartmentId
                                                    )} 
                                                    onValueChange = {(value) => 
                                                    handleDepartmentChange(
                                                        employee.user_id, 
                                                        value 
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Department"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {departments.map((dept) => ( 
                                                        <SelectItem key={dept.id} value={String(dept.id)}>
                                                            {dept.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center">
                                        No employee found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardTitle>
        </Card>
    )
}

export default DepartmentEmployees