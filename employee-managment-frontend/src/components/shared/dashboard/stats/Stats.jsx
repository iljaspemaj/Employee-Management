import React from 'react'
import Stat from './Stat'
import { SiBuildkite } from "react-icons/si";
import { FiUsers } from "react-icons/fi";
import { BsActivity } from "react-icons/bs";
import { LiaTasksSolid } from "react-icons/lia";
const Stats = () => {
    return (
        <div className='grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6'>
            <Stat label={"Departments"} icon={<SiBuildkite size={22} />} stat={"4500"}/>
            <Stat label={"Total Users"} icon={<FiUsers size={22} />} stat={"5500"} />
            <Stat label={"All Tasks"} icon={<BsActivity size={22} />} stat={"4500"} />
            <Stat label={"Done Task"} icon={<LiaTasksSolid size={22} />} stat={"5500"} />
        </div>
)
}

export default Stats