import React, { useEffect } from 'react'
import { useDispatch, useSelector} from "react-redux";
import { fetchDepartments } from "@/store/departmentsSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Link } from'react-router-dom';
import { FiEdit3 } from 'react-icons/fi';
import DeleteButton from './DeleteButton';

const DepartmentList = ({isListView}) => {
    const dispatch = useDispatch();
    const {departments, loading, error} = useSelector(
        (state) => state.departments);

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    const handleDepartmentDeleted = () => {
        dispatch(fetchDepartments());
    }

    return (
    <div>
        {loading && <p>Loading Departments...</p>}
        {error && (
            <p className='text-red-500'>
                Error: {error}{" "} 
            </p>
        )}

        {!loading && isListView && !error && departments.length > 0 &&(
            <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {departments.map((department) => {
                return (
                <TableRow key={department.id}>
                <TableCell className="font-medium capitalize">
                    {department.name}
                    </TableCell>
                <TableCell>
                    {department.employee_count || 0}
                    </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                    <Link 
                    to={`/edit-department/${department.id}`}>
                    
                    <Button variant={"outline"} size={"sm"}>
                        <FiEdit3 />
                    </Button>
                    </Link>

                    <DeleteButton 
                    departmentId={department.id}
                    departmentName={department.name}
                    onDeleted={handleDepartmentDeleted}
                    />
                </TableCell>
                </TableRow>
                );
                })}
            </TableBody>
            </Table>
        )}

        {!isListView && (
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {departments.map((department) => {
                    return (
                        <div key={department.id} className='p-4 border rounded-lg shadow-md bg-white'>
                        <h2 className='text-lg font-bold capitalize mb-2'>{department.name}</h2>
                        <p className='text-gray-500 mb-4'>Employees: {department.employee_count || 0}</p>
                        <div className='flex justify-end gap-2'>
                        <Link 
                    to={"/edit-department/${department.id}"}>
                    
                    <Button variant={"outline"} size={"sm"}>
                        <FiEdit3 />
                    </Button>
                    </Link>
                    <DeleteButton 
                    departmentId={department.id}
                    departmentName={department.name}
                    onDeleted={handleDepartmentDeleted}
                    />
                        </div>
                    </div>
                    );
                })}
            </div>
        )}
        {!loading && departments.length === 0 && (
            <p className='text-gray-500'>No departaments found.</p>
        )}
    </div>
)
}

export default DepartmentList