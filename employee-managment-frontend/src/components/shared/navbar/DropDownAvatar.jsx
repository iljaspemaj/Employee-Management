import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice'
import { Avatar, AvatarFallback,} from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
const DropDownAvatar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const getInitials = (username) => {
        if(!username) return "??";

        return username.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase();
    }

    const handleLogaout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        dispatch(logout());
        navigate("/")
    }

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer'>
    {/* <AvatarImage 
    {src="https://github.com/shadcn.png" 
    alt="@shadcn" />} */}
    <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
    </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
        <DropdownMenuItem className='cursor-pointer'>
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem className='cursor-pointer'>
        Billing
        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem className='cursor-pointer'>
        Settings
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem className='cursor-pointer'>
        Keyboard shortcuts
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem 
    className='cursor-pointer' 
    onClick = {handleLogaout}>
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
    </DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
);
};
export default DropDownAvatar