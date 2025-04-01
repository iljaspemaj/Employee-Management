import React, { useState } from 'react'
import Layout from '../Layout';
import Header from '../../../components/shared/dashboard/Header';
import CreateDepartmentDialog from '../../../components/shared/dashboard/department/CreateDepartmentDialog';
import Stats from '../../../components/shared/dashboard/stats/Stats';
import DepartmentList from '../../../components/shared/dashboard/department/DepartmentList';
import { Button } from "@/components/ui/button"
import { CiBoxList } from "react-icons/ci";
import { PiSquaresFour } from "react-icons/pi";

const OverView = () => {
    const [isListView, setListView] = useState(true);
    return (
        <Layout>
        <Header 
        title="Dashboard"
        subtitle="Here you can manage all the departaments, users and tasks."
        >
            <CreateDepartmentDialog/>
        </Header>
        
        <Stats/>

        <div className='mt-10 '>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold mb-4'>
                    List of all Departments
                    </h1>
                <div className='flex flex-nowrap space-x-2'>
                    <Button 
                    variant={!isListView ? "outline" : ""} 
                    size={"icon"} 
                    onClick={()=> setListView(true)}>
                    <CiBoxList />
                    </Button>
                    
                    <Button 
                    variant={!isListView ? "" : "outline"} 
                    size={"icon"} 
                    onClick={()=> setListView(false)}>
                    <PiSquaresFour />
                    </Button>
                </div>
            </div>

                <DepartmentList isListView={isListView}/>
        </div>
        </Layout>
    );
};

export default OverView