import React from 'react'
import NavBar from '@/components/shared/navbar/NavBar'
const Layout = ({children}) => {
    return (
    <div>
        <NavBar/>
        <hr/>

        <main className='container mx-auto'>
        {children}
        </main>
        </div>
)
}

export default Layout