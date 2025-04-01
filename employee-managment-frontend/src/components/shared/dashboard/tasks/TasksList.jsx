import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DeleteTaskButton from "./DeleteTaskButton";
import { fetchTasks } from "@/store/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import EditTaskDialog from "./EditTaskDialog";

const TasksList = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleTaskDeleted = () => {
        dispatch(fetchTasks());
    };

    const handleTaskUpdated = () => {
        dispatch(fetchTasks());
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Checkbox /></TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map((task) => (
                    <TableRow key={task.id}>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                            <EditTaskDialog task={task} onUpdated={handleTaskUpdated} />
                            <DeleteTaskButton
                                taskId={task.id}
                                taskTitle={task.title}
                                onDeleted={handleTaskDeleted}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TasksList;