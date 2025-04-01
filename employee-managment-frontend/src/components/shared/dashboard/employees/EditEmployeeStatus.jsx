import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

const EditEmployeeStatus = ({  userId, currentStatus, onStatusUpdated }) => {
    const { toast } = useToast();
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const statuses = [
        { value: "admin", label: "Admin"},
        { value: "employee", label: "Employee"},
    ];

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            const response = await fetch (
                `http://localhost:8095/api/employees/update-status`,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                    body: JSON.stringify({ 
                        user_id: userId,
                        status: newStatus, 
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update employee status.");
            }

            const result = await response.json();
            setStatus(result.data.status);

            onStatusUpdated(result.data)

            toast({
                title: "Success",
                description: `Status updated to "${result.data.status}"`,
                
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || `Failed to update status.`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
return (
        <>
            <Select
                value={status}
                onValueChange={(value) => handleStatusChange(value)}
                disabled={loading}
            >
                <SelectTrigger className='w-fit h-5 text-xs font-medium'>
                    <SelectValue placeholder="Select status"/>
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {loading && (
                <Button variant="ghost" disabled>
                    Updating...
                </Button>
            )}
        </>
    )
}

export default EditEmployeeStatus