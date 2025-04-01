import React from 'react'
import Aside from '../../components/shared/auth/Aside';
import { Link } from 'react-router-dom';
import {Button} from '@/components/ui/button'
import LoginForm from '../../components/shared/auth/LoginForm';

const Login = () => {
    return <div className='h-screen md:flex'>
        <Aside/>
        
        <div className='flex md:w-1/2 h-screen justify-center py-10 items-center bg-white relative'>
        <Link to='/register' className='absolute top-10 right-10 '>
        <Button variant='ghost'>Register</Button>
        </Link>
        <LoginForm/>
        </div>
    </div>
};

export default Login