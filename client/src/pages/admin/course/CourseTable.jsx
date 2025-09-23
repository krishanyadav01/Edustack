import LoadingSpinner from '@/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { Edit, MessageCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'




   

const CourseTable = () => {
  const {data ,isLoading,refetch}=useGetCreatorCourseQuery(); //{} for query and []  for mutation
    const navigate=useNavigate();


      useEffect(()=>{
              refetch();
          },[])

          
    if(isLoading)
      return <LoadingSpinner/>
      //console.log(data.courses[0].creator);             ;
      //console.log(data.courses[0]);
    const course=data.courses;
    return (
        <div>
            <Button onClick={()=>navigate("create")}> Create a new Course</Button>
            <Table>
                <TableCaption>A list of your recent Courses</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Discussion Forum</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {course.map((course) => (
                        <TableRow key={course._id}>
                            <TableCell className="font-medium">₹{course?.coursePrice || "NA"}</TableCell>
                            <TableCell><Badge>{course.isPublished?"Published":"Draft"}</Badge></TableCell>
                            <TableCell>{course.courseTitle}</TableCell>
                            <TableCell className="ml-5"><Button onClick={()=>navigate(`/discussion-forum/${course._id}/user/${course.creator}`)}><MessageCircle/></Button></TableCell>
                            <TableCell className="text-right"><Button size="sm" variant='outline' onClick={()=>navigate(`${course._id}`)}><Edit/></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


        </div>
    )
}

export default CourseTable