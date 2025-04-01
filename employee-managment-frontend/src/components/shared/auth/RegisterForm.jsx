import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  username: z.string().min(2,{
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6,{
    message: "Password must be at least 6 characters long.",
  }),
  confirmPassword:  z.string().min(6,{
    message: "Confirm password must be at least 6 characters.",
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
const RegisterForm = () => {
  const navigate = useNavigate();
  const {toast} = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8095/api/auth/register",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      toast({
        variant: "success",
        title: "Account created!",
        description: "You have been registered successfully. Please log in.",
      })

      navigate("/login");
    } catch (error) {
      console.log(error);
      toast ({
        variant: "destructive",
        title: "Registration Failed!",
        description: error.message,
      })
    }
  };

  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-2 w-96">
            <div className='text-center'>
              <h1 className='text-primary font-bold text-2xl mb-1'>
                Create an account
              </h1>
              <p className='text-nm font-normal text-gray-500 mb-4'>
                Enter your email here to create an account
                </p>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your username" {...field} />
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
                    <Input placeholder="your@example.com" {...field} />
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
                <Input type ="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
              </FormItem>
              )}
            />

            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
            <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input type ="password" placeholder="**********" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
             )}
          />
    
            
            <Button type="submit" className = 'w-full'>
              Register
              </Button>
          </form>
        </Form>
  )
}

export default RegisterForm