import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    //const isLoading = false;
    const [lectureTitle, setLectureTitle] = useState("");
    const navigate = useNavigate();
    
    const params =useParams();
    const courseId=params.courseId;

    const [createLecture ,{data,isLoading,isSuccess,isError,error}]=useCreateLectureMutation();

    const {data:lectureData  , isLoading:lectureIsLoading  , isError:lectureIsError ,refetch}=useGetCourseLectureQuery(courseId);

    const createLectureHandler=async()=>{
        await createLecture({lectureTitle,courseId});
    }

    useEffect(()=>{
        if(isSuccess){
            refetch();
            //console.log({data})
            toast.success(data.message)
        }
        if(isError){
            toast.error(error.data.message)
        }
    }  ,[isSuccess,isError]);

    useEffect(()=>{
        refetch();
    },[])

    console.log(lectureData);


    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>
                    Lets add lecture and some basic details for your lecture
                </h1>
                <p1 className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio laborum blanditiis harum at rem ipsam adipisci autem veniam impedit commodi vel doloribus quam fugiat velit sit repudiandae, voluptatibus ducimus incidunt.
                </p1>
            </div>
            <div className='flex flex-col gap-4'>
                <div className="flex flex-col gap-2">
                    <Label>Lecture Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => { setLectureTitle(e.target.value) }}
                        name="lectureTitle"
                        placeholder="Your lecture name"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)} >Back to Course</Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>{
                        isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait
                            </>
                        ) : "Create Lecture"
                    }</Button>
                </div>
                <div className='mt-10'>
                    {
                        lectureIsLoading ? 
                        (<p>Loading Lectures</p>) : 
                        lectureIsError ? (<p>  Failed to Load Lectures</p>) 
                        : lectureData.lectures.length ===0 ? (<p>No Lecture Available</p>) :
                        (lectureData.lectures.map((lecture,index)=>(
                            <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId}/>
                        )))
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateLecture