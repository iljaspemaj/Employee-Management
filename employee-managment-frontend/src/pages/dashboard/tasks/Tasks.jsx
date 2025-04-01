import React from 'react'
import Layout from '../Layout'
import Header from '../../../components/shared/dashboard/Header';
import CreateTasksDialog from '../../../components/shared/dashboard/tasks/CreateTasksDialog';
import TasksList from '../../../components/shared/dashboard/tasks/TasksList';

const Tasks = () => {
    // const [tasks, setTasks] = useState([]);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchTasks = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8095/api/tasks/all', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('token')}`, 
    //                 },
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch tasks');
    //             }

    //             const data = await response.json();
    //             setTasks(data);  
    //         } catch (error) {
    //             setError(error.message);  
    //         }
    //     };

    //     fetchTasks();  
    // }, []);  
    return (
        <Layout>
            <Header 
        title="Task Management"
        subtitle="Here you can manage all the tasks."
        >
            <CreateTasksDialog/>
        
        </Header>
        
        <TasksList/>
        </Layout>
    );
};

export default Tasks