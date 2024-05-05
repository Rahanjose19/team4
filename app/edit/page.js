"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function SelectCourse() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);
  return (
    <div className="flex items-center justify-between m-6">
      <h1 className="text-2xl font-bold">Course Selection</h1>
      <div className="w-56">
        <Select
          onValueChange={(value) => {
            router.push(`/edit/${value}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
