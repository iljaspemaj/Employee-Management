import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useParams} from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long."})
})

const EditDepartmentCard = () => {
    const { id } = useParams();
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    
    const {register, handleSubmit, formState, setValue, reset} = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {name: "" },
    
    });
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await fetch(`http://localhost:8095/api/departments/${id}`,{
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        
                    }
                });
                
                if(!response.ok) throw new Error("Failed to load department")

                    const data = await response.json();
                    
                setValue("name", data.name);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
            }
        }
        fetchDepartment();
    }, [id, setValue, toast]);
    
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8095/api/departments/${id}`,{
                method: "PUT",
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }
        );
        
            if(!response.ok) {
                throw new Error("Failed to update department")
            }

            const result = await response.json();
            toast({
                title: 'Success',
                description: `Department "${result.name}" updated successfully`,
            });
            reset({name: result.name});
        } catch (error) {
            toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className='lg:w-96 w-full'>
            <CardHeader>
                <CardTitle>Edit department</CardTitle>
                <CardDescription>Update the department{"'"}s name below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <label htmlFor="" className='block mb-2 text-sm font-medium'>
                            Name
                        </label>
                        <Input 
                        type="text" 
                        placeholder="Department Name" 
                        {...register("name")}
                        />
                        {formState.errors.name && (
                            <p className='text-red-500 text-sm mt-1'>{formState.errors.name.message}</p>
                            )}
                    </div>
                    <Button type="submit">
                        {loading? "Updating..." : "Update Department"}
                    </Button>
                </form>
            </CardContent>
        </Card>
)
}

export default EditDepartmentCard