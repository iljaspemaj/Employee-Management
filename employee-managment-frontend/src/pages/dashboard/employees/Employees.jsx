import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../Layout'
import Header from '../../../components/shared/dashboard/Header';
import EmployeesList from '../../../components/shared/dashboard/employees/EmployeesList';
import { useToast } from '@/hooks/use-toast'
import CreateEmployeeDialog from '../../../components/shared/dashboard/employees/CreateEmployeeDialog';
import { fetchEmployees } from '../../../store/employeesSlice';

const Employees = () => {
    const dispatch = useDispatch();
    const {toast} = useToast();
    const {
        data: employees,
        loading,
        error,
    } = useSelector((state) => state.employees);
    useEffect(() => {
        dispatch(fetchEmployees()).unwrap().catch((err) => {
            toast({
                title: "Error",
                description: err,
                variant: "destructive",
            });
        });
    }, [dispatch, toast]);
    return <Layout> 
        <Header 
        title="Employee Management"
        subtitle="Here you can manage all the users."
        >
            <CreateEmployeeDialog/>
        
        </Header>
        
        {loading ?(
            <p className='text-center'>Loading Employees...</p>
        ) : error ? 
            (<p className='text-center text-red-500 mt-4'>{error}</p>
        ) : (
            <EmployeesList employees={employees}/>
        )}
    </Layout>
}

export default Employees