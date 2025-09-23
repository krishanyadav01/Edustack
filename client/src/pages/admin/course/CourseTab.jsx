import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCourseByIdQuery, useRemoveCourseMutation, useUpdateCourseMutation, useUpdateIsPublishedMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CourseTab = () => {


    const [isDialogOpen , setIsDialogOpen]=useState(false);
    const navigate = useNavigate();
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: 0,
        courseThumbnail: ""
    });

    const params = useParams();
    const courseId = params.courseId;         //get the courseId from URL 'courseId' must be same as used in routes check App.jsx 

    const { data: courseByIdData, isLoading: courseByIdIsLoading, refetch } = useGetCourseByIdQuery(courseId);

    const course = courseByIdData?.course;

    const [updateIsPublished, { data: publishedData, isLoading: publishedIsLoading, isSuccess: publishedIsSuccess, isError: publishedIsError }] = useUpdateIsPublishedMutation();

    const [removeCourse , {data:removeCourseData , isLoading:removeCourseIsLoading ,isSuccess:removeCourseIsSuccess , error:removeCourseError}]=useRemoveCourseMutation();

    const publishStatusHandler = async (e) => {
        await updateIsPublished({ courseId, query: e });
    }

    useEffect(() => {
        if (publishedIsSuccess) {
            toast.success(publishedData.message);
            refetch();
        }
        if (publishedIsError) {
            toast.error(publishedData.data.message);
        }
    }, [publishedIsSuccess, publishedIsError])


    useEffect(() => {
        //console.log(courseByIdData);
        if (course) {
            setInput({
                courseTitle: course.courseTitle || "",
                subTitle: course.subTitle || "",
                description: course.description || "",
                category: course.category || "",
                courseLevel: course.courseLevel || "",
                coursePrice: course.coursePrice || "",
                courseThumbnail: course.courseThumbnail || ""
            })
        }
    }, [course])


    useEffect(() => {
        refetch();
    }, [])

    const [updateCourse, { data, isLoading, isSuccess, isError, error }] = useUpdateCourseMutation();

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    }

    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    }

    const selectThumbnail = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }


    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", Number(input.coursePrice));
        formData.append("courseThumbnail", input.courseThumbnail);
        await updateCourse({ formData, courseId });
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course Updated Successfully")
        }
        if (isError) {
            toast.error(error.data.message || "Problem UpdatingCourse")
        }
    }, [isSuccess, isError])


    const isPublished = true;

    const removeCourseHandler =async()=>{
        await removeCourse({courseId});
    }

    useEffect(()=>{
        if(removeCourseIsSuccess){
            toast.success(removeCourseData.message||"Course Removed Successfully");
            setIsDialogOpen(false);
            navigate("/admin/course");
        }
        if(removeCourseError){
            toast.error(removeCourseError.data.message||"Problem Removing Course");
        }
    },[removeCourseIsSuccess,removeCourseError])

    if (courseByIdIsLoading) return <LoadingSpinner />
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here.Click Save when done
                    </CardDescription>
                </div>
                <div className='flex flex-row gap-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0} onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")} variant="outline">
                        {//cannot publish till beacuse no    lectures
                            courseByIdData?.course.isPublished ? "Unpublish" : "Publish"
                        }
                    </Button>


                    <Dialog >
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                Remove Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Remove Course</DialogTitle>
                                <DialogDescription>
                                    Removing Course will remove all the lectures and details, You can consider unpublishing courses. Are you sure 
                                    you want to remove Course?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button disabled={removeCourseIsLoading} variant="destructive" onClick={removeCourseHandler}>
                                    {
                                        removeCourseIsLoading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Please Wait
                                            </>
                                        ) : "Remove Changes"
                                    }
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>
                            Title
                        </Label>
                        <Input
                            type="text"
                            placeholde="Ex . Full Stack Developer"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>
                            Subtitle
                        </Label>
                        <Input
                            type="text"
                            placeholde="Become a full stack developer from 0 to hero in 2 months"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>
                            Description
                        </Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex flex-row gap-10'>
                        <div className='flex flex-col gap-3'>
                            <Label>Category</Label>
                            <Select onValueChange={(value) => selectCategory(value)} value={input.category}>               {/*custom DOM event onValueChange*/}
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
                        <div className='flex flex-col gap-3'>
                            <Label>Course Level</Label>
                            <Select onValueChange={(value) => selectCourseLevel(value)} value={input.courseLevel}>               {/*custom DOM event onValueChange*/}
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Course Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>CCourse K=Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <Label>Price in INR</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="99"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            className="w-fit"
                            onChange={(event) => selectThumbnail(event)}
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-64 my-2' alt="Course Thumbnail" />
                            )
                        }
                    </div>
                    <div>
                        <Button variant="outline" onClick={() => navigate("/admin/course")}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>{
                            isLoading ? (<>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait</>) :
                                ("Save")}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card> 
    )
}

export default CourseTab