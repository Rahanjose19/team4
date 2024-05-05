"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // For routing and parameter handling
import { Label, Input, Button, Select, SelectTrigger, SelectContent, SelectGroup, SelectItem } from "@/components/ui"; // Importing necessary UI components
import { toast } from "@/components/ui/toast"; // Optional: for better user feedback with toasts

export default function EditNRI() {
  const [courses, setCourses] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [form, setForm] = useState({
    applicationNo: "",
    name: "",
    email: "",
    dateOfBirth: "",
    district: "",
    state: "",
    street: "",
    school: "",
    graduationYear: 2026,
    percentage: "",
    major: "",
    phone: "",
    address: "",
  });

  const router = useRouter();
  const { id } = useParams(); // Getting the ID from URL parameters
  const [isLoading, setIsLoading] = useState(true); // To manage loading state

  // Fetching data and courses for existing records
  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        // Fetch courses
        const coursesResponse = await fetch("/api/courses");
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        // Fetch the applicant's data
        if (id) {
          const applicantResponse = await fetch(`/api/nri/${id}`); // Assuming this endpoint gets the existing data
          const applicantData = await applicantResponse.json();

          setForm(applicantData.form);
          setPriorityList(applicantData.priorityList);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data"); // Optional: Displaying a toast for errors
      }
    };

    fetchApplicantData();
  }, [id]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAdd = () => {
    setPriorityList((prev) => [
      ...prev,
      { course: selectedCourse, priority: prev.length + 1 },
    ]);
    setSelectedCourse("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/nri/${id}`, {
        method: "PUT", // Update an existing record
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ form, priorityList }),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      console.log("Update successful:", result);

      toast.success("Update successful"); // Optional: Indicating success to the user
      router.push("/nri"); // Redirecting to a relevant page
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error updating data");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading state
  }

  return (
    <div className="px-4 md:px-6">
      <form onSubmit={handleSubmit} className="lg:px-8 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Edit NRI Applicant</h1>
          <p className="text-gray-500">
            Edit the details of the Non-Resident Indian applicant.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationNo">Applicant No</Label>
              <Input
                id="applicationNo"
                value={form.applicationNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={form.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select
                id="course"
                value={selectedCourse}
                onValueChange={(value) => setSelectedCourse(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectContent>
                    <SelectGroup>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                type="number"
                min="1"
                max="10"
                placeholder="Priority"
                value={priorityList.length + 1}
                disabled
              />
            </div>
          </div>
          <Button onClick={handleAdd} type="button">Add</Button>

          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="text-lg font-medium">Priority List</h3>
            {priorityList.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>{item.course}</div>
                <div>{index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
