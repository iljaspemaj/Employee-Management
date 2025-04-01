import React from 'react'
import Aside from '../../components/shared/auth/Aside';
import { Link } from 'react-router-dom';
import {Button} from '@/components/ui/button'
import RegisterForm from '../../components/shared/auth/RegisterForm';

const Register = () => {
    return  <div className='h-screen md:flex'>
        <Aside/>
        
        <div className='flex md:w-1/2 h-screen justify-center py-10 items-center bg-white relative'>
        <Link to='/login' className='absolute top-10 right-10 '>
        <Button variant='ghost'>Login</Button>
        </Link>
        <RegisterForm/>
        </div>
    </div>
};

export default Register