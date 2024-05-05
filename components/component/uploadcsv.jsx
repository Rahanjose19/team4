"use client"
import React, { useState } from 'react';
import CsvReader from 'react-csv-reader';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from '../ui/button';

export function Uploadcsv() {
  const [data, setData] = useState([]);
  const [reducedData, setReducedData] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reducedData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      // Handle response data here
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleForce = (data, fileInfo) => {
    setData(data);
    console.log(data, fileInfo);
    const [header, ...rows] = data;

    const applicants = rows.map(row => {
      const applicant = {};
      header.forEach((key, i) => {
        applicant[key] = row[i];
      });
      return applicant;
    });
  
    setReducedData(applicants);
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl w-full px-6 py-12 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="space-y-4 text-center ">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Upload Allotments</h1>
          <p className="text-gray-600 dark:text-gray-400">upload a csv</p>
          <div className="flex justify-center pl-60">
            <CsvReader
              cssClass="csv-reader-input"
              onFileLoaded={handleForce}
              inputId="file-upload"
              inputStyle={{color: 'white'}}
            />
          </div>
          <Button onClick={handleSubmit} >Upload</Button>
        </div>
        <div className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                {data[0] && data[0].map((heading, i) => <TableHead key={i}>{heading}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(1).map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, i) => <TableCell key={i}>{cell}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

export default Uploadcsv;