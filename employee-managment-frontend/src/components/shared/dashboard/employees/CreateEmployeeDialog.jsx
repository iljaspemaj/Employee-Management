import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
    username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters"}),
    email: z.string().email({ message: "Invalid email adress." }),
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters"}),
  });

const CreateEmployeeDialog = () => {
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
        },
      });    

      const onSubmit = async (data) => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:8095/api/auth/register",
            {
              method: "POST",
              headers: {"Content-Type": "application/json",},
              body: JSON.stringify({...data, status: "employee"}),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData.message || "Failed to register user.");
        }

        const newUser = await response.json();
        toast({ 
            title: "Success", 
            description: `User "${newUser.username}" registered successfully.`
        });

          form.reset();
        } catch (error) {
            toast({ 
                variant: "destructive", 
                title: "Error", 
                description: error.message || "An unexpected error ocurred." });
        } finally {
            setLoading(false);
        }
      }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm"> Register new User +</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register new User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" 
                type="password" 
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={loading}>{loading ? "Registering...": "Create"}</Button>
        </DialogFooter>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog