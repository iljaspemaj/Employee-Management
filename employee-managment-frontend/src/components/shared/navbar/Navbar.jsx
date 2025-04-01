import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import DarkLogo from '@/assets/img/DarkWorkForceProLogo.svg'
import DropDownAvatar from './DropDownAvatar';

const NavBar = () => {
    const navLinks = [
        { path: '/overview', label: 'Overview' },
        { path: '/employees', label: 'Employees' },
        { path: '/tasks', label: 'Tasks' },
    ];

    return ( <div>
            <nav className='flex justify-between items-center py-4 container mx-auto '>
        <ul className='flex items-center gap-10'>
        <li>
            <Link to='/overview'>
            <img src={DarkLogo} alt="WorkForce Pro Logo" />
            </Link>
        </li>

        {navLinks.map((link) => (
            <li key={link.path}>
                <NavLink
                to={link.path} 
                className={({isActive}) =>
                isActive 
                ?"text-slate-900 font-medium"
                :"text-slate-500 font-normal"}>
                    {link.label}    
                </NavLink>
            </li>
        ))}
        </ul>
        <DropDownAvatar/>
        </nav>
    </div>
    );
};

export default NavBar