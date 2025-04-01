import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

const EditEmployeeDepartment = ({ userId, currentDepartmentName, departments, onDepartmentUpdated, }) => {
    const { toast } = useToast();
    const [selectedDepartmentName, setSelectedDepartmentName] = useState(currentDepartmentName);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSelectedDepartmentName(currentDepartmentName);
    }, [currentDepartmentName]);

    const handleDepartmentChange = async (newDepartmentName) => {
        setLoading(true);
        try {
            const department = departments.find(
                (dept) => dept.name === newDepartmentName
            );
            const newDepartmentId = department ? department.id : null;

            if (!newDepartmentId) {
                throw new Error("Invalid department.");
            }

            const response = await fetch(
                `http://localhost:8095/api/employees/update-department`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        department_id: newDepartmentId,
                        user_id: userId,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update department.");
            }

            setSelectedDepartmentName(newDepartmentName);
            onDepartmentUpdated(userId, newDepartmentId);

            toast({
                title: "Success",
                description: `Employee's department updated successfully`,
            });
        } catch (error) {
            console.error("Error updating department:", error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }
return (
    <>
        <Select 
            value={selectedDepartmentName}
            disabled={loading}
            onValueChange={handleDepartmentChange}
        >
            <SelectTrigger className="h-5 w-fit font-medium">
                <SelectValue>{selectedDepartmentName || "Select Department"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                    </SelectItem>
                ))}
            </SelectContent>
    </Select>
    </>
)
}

export default EditEmployeeDepartment