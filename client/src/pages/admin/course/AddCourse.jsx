import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'



const AddCourse = () => {

    const [courseTitle, setCourseTitle] = useState("");
    const [category, setCategory] = useState("");

    const [createCourse, { data, error, isSuccess, isLoading ,isError }] = useCreateCourseMutation();
    const navigate = useNavigate();


    const getSelectedCategory = (value) => {
        setCategory(value);
    }

    const createCourseHandler = async () => {
        await createCourse({ courseTitle, category });
       
    }

    //for diaplaying toast 
    useEffect(()=>{
        if(isSuccess){
            toast.success(data?.message||"Course Created Successfully")
            navigate("/admin/course")  //after creating we also need to refetch so that we see the latest course
        }
        if(isError)
            toast.error(error?.data.message||"Problem Creating Course");
    },[isSuccess,error,isError]);

    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>
                    Lets add course and some basic course details for your course
                </h1>
                <p1 className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio laborum blanditiis harum at rem ipsam adipisci autem veniam impedit commodi vel doloribus quam fugiat velit sit repudiandae, voluptatibus ducimus incidunt.
                </p1>
            </div>
            <div className='flex flex-col gap-4'>
                <div className="flex flex-col gap-2">
                    <Label> Title</Label>
                    <Input
                        type="text"
                        value={courseTitle}
                        onChange={(e) => { setCourseTitle(e.target.value) }}
                        name="courseTitle"
                        placeholder="Your coure name"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>  Category</Label>
                    <Select onValueChange={(event) => getSelectedCategory(event)}>               {/*custom DOM event onValueChange*/}
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="Next Js">Next Js</SelectItem>
                                <SelectItem value="Data Science">Data Science</SelectItem>
                                <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                <SelectItem value="Javascript">Javascript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Docker">Docker</SelectItem>
                                <SelectItem value="MongoDB">MongoDB</SelectItem>
                                <SelectItem value="HTML">HTML</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate("/admin/course")}>Back</Button>
                    <Button disabled={isLoading} onClick={createCourseHandler}>{
                        isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait
                            </>
                        ) : "Create"
                    }</Button>
                </div>
            </div>
        </div>
    )
}

export default AddCourse