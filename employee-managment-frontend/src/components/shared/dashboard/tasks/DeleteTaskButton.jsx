import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";

const DeleteTaskButton = ({ taskId, taskTitle, onDeleted }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8095/api/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            toast({
                title: "Task deleted successfully",
                description: `The task "${taskTitle}" has been deleted.`,
                status: "success",
            });

            onDeleted();
            setShowDialog(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "An error occurred while deleting the task.",
                status: "error",
                variant: "destructive",
            });
            console.error("Error deleting task:", error);
            } finally {
            setLoading(false);
            }
        };
        
        return (
            <>
            <Button variant="destructive" onClick={() => setShowDialog(true)}>
                Delete
            </Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                    Are you sure you want to delete the task "{taskTitle}"?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                    </Button>
                    <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={loading}
                    >
                    {loading ? "Deleting..." : "Confirm Delete"}
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
            </>
        );
};

export default DeleteTaskButton