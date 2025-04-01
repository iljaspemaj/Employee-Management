import React from 'react'

const Header = ({
    title, 
    subtitle,
    children
}) => {
    return (
    <div className='flex items-center justify-between py-4'>
        <div>
            <h1 className='text-primary text-2xl font-bold '>{title}</h1>
            {subtitle && <p className='text-gray-500'>{subtitle}</p> }
        </div>
        <div>{children}</div>
    </div>
);
};
export default Header