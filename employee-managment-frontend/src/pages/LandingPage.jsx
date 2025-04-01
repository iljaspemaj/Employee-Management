import React from 'react'
import { MoveRight, Lightbulb } from "lucide-react";
import { Link } from 'react-router-dom';
import WebImage from '../components/shared/landing/WebImage';


const LandingPage = () => {
    return <main className='pt-24 bg-white'>
        <div className='px-12 mx-auto max-w-7xl'>
            <div className='w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center'>
            <h1 className='mb-8 text-4xl font-extrabold leading-none tracking-normal text-slate-800 md:text-6xl md:tracking-tight'>
            <span>Start</span> {" "}
            <span className='block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-red-800 to-red-500 lg:inline'>managing employees</span> {" "}
            <span>with our product?</span>
            </h1>
            <p className='px-0 mb-8 text-lg text-gray-600 md:text-xl lg:px-24'>
                Stop gaining the traction you{"'"}ve always wanted with our next-level templates and designs. Crafted to help you tell your story. 
            </p>
            <div className='mb-4 space-x-0 md:space-x-2 md:mb-8 '>
                <Link 
                to='/login' 
                className='inline-flex items-center 
                justify-center w-full px-6 py-2 mb-2 
                text-lg text-white bg-red-700 rounded-2xl sm:w-auto sm:mb-0'
                >
                    Get Started <MoveRight className='ml-2' /></Link>
                <Link 
                to='/register' 
                className='inline-flex items-center 
                justify-center w-full px-6 py-2 mb-2 
                text-lg  bg-gray-100 rounded-2xl sm:w-auto sm:mb-0'
                >
                    Sign Up <Lightbulb className='ml-2' /></Link>
            </div> 
        </div>
        <WebImage/>
    </div>
    </main>
};

export default LandingPage;