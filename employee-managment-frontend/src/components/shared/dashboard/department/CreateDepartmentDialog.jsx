import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux";
import {useToast} from "@/hooks/use-toast";
import { addDepartment } from"../../../../store/departmentsSlice";

import { Button } from "@/components/ui/button";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    name: z.string().nonempty("Please fill department name").min(2).max(50),
});

const CreateDepartmentDialog = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
        },
      });

      const onSubmit = async (data) => {
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8095/api/departments",
                {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem(
                        "token"
                    )}`,
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create department.");
        }

        const result = await response.json();

        dispatch(addDepartment(result));

        toast({ 
            title: "Success!", 
            description: `Department "${result.name}" created successfully.`,
            duration: 3000,
        });
        } catch (error) {
            toast({ 
                title: "Erorr!", 
                description: error.message || `An unexpected error ocurred.`,
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
      }
    return (
        <Dialog>
        <DialogTrigger asChild>
        <Button size={"sm"}>Create New Department +</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
            Provide department details you want to create.
            </DialogDescription>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department name</FormLabel>
              <FormControl>
                <Input placeholder="Department name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
        </DialogFooter>
      </form>
      </Form>
        </DialogContent>
    </Dialog>
   );
};

export default CreateDepartmentDialog