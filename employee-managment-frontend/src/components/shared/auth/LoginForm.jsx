import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { login } from '@/store/authSlice'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6,{
    message: "Password must be at least 6 characters long.",
  }),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  
  const onSubmit = async(data) => {
    try {
      const response = await fetch("http://localhost:8095/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to log in.");
        return; 
      }

      const responseData = await response.json();

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      dispatch(login(responseData.user));
      navigate("/overview")

    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again.")
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className='text-center'>
          <h1 className='text-primary font-bold text-2xl mb-1'>
            Login
          </h1>
          <p className='text-nm font-normal text-gray-500 mb-4'>Welcome back, please login to continue</p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@example.com" {...field} value={field.value || ""} />
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
                <Input type ="password" placeholder="**********" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
    
}

export default LoginForm