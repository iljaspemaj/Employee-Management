import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
const DeleteButton = ({ departmentId, departmentName, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const {toast} = useToast();

  const handleDeleteConfirm = async () => {
    setLoading(true)

    try {
        const response = await fetch(`http://localhost:8095/api/departments/${departmentId}`,
        {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      if(!response.ok) {
        throw new Error('Failed to delete department');
      }

      toast({ 
        title: "Department Deleted!", 
        description: `The Department "${departmentName}" has been successfully deleted.`,
        variant: "destructive",
        duration: 3000,
    });

    onDeleted();
    setShowDialog(false);
    } catch (error) {
      toast({ 
        title: "Erorr!", 
        description: error.message || `An unexpected error ocurred.`,
        variant: "destructive",
        duration: 3000,
    });
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
    <Button variant="outline" size={"sm"} onClick={() => setShowDialog(true)}><FiTrash /></Button>
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Department</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the department {'"'}
            <b>{departmentName}</b>
            {'"'} ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button 
          variant="destructive"
          onClick={handleDeleteConfirm}
          disabled={loading}>
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default DeleteButton
