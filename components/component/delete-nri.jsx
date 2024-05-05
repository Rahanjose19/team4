"use client";

import { useRouter, useParams } from "next/navigation"; // For routing and parameter handling
import { useEffect, useState } from "react";
import { Button, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui"; // Assuming you have these components
import { toast } from "@/components/ui/toast"; // Optional, for user feedback

export default function DeleteNRI() {
  const router = useRouter();
  const { id } = useParams(); // Get the ID from the route
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to delete the applicant
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/nri/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the applicant");
      }

      const result = await response.json();
      console.log("Deletion successful:", result);

      toast.success("Applicant deleted successfully"); // Optional, for feedback
      router.push("/nri"); // Redirect after successful deletion
    } catch (error) {
      console.error("Error deleting applicant:", error);
      toast.error("Error deleting applicant"); // Optional
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Button onClick={() => setIsDialogOpen(true)}>Delete Applicant</Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            Are you sure you want to delete this applicant?
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
