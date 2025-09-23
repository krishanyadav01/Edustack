import BuyCourseButton from '@/components/BuyCourseButton'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useGetCourseDetailsWithPurchaseStatusQuery } from '@/features/api/coursePurchaseApi'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'



const CourseDetail = () => {

    const params = useParams();
    const navigate=useNavigate();
    const { courseId } = params;
    const { data, isLoading, isError, refetch } = useGetCourseDetailsWithPurchaseStatusQuery({courseId});

    useEffect(() => {
        refetch();
    }, [])

    


    if (isLoading)                //this type of thing is done for get because Query run asynchronously 
        return <LoadingSpinner />

    if (isError)
        return <h1>Error Getting Course Detaiils</h1>



    const course = data?.course;

    const coursePurchased =data?.purchased;

    const handleContinueCourse =()=>{
        if(coursePurchased){
            navigate(`/course-progress/${courseId}`)
        }
    }


    return (
        <div className='mt-20 space-y-5'>
            <div className='bg-[#2D2F31] text-white'>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                    <h1 className='font-bold text-2xl md:text-3xl'>{course.courseTitle}</h1>
                    <p className="text-base md:text-lg">{course.subTitle}</p>
                    <p>Created By{" "} <span className='text-[#C0C4FC] underline italic'>{course.creator.name}</span></p>
                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>Last updated {course.creator?.updatedAt ? new Date(course.creator.updatedAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                    <p>Students enrolled:{course.enrolledStudent.length}</p>
                </div>

            </div>
            <div className='max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10'>
                <div className="w-full lg:w-1/2 space-y-5">
                    <h1 className='font-bold text-xl md:text-2xl'>
                        Description
                    </h1>
                    <p className='text-sm' dangerouslySetInnerHTML={{ __html: course.description }} />    {/*this is dont since we have B I U forms of text*/}
                    <Card>
                        <CardHeader className="flex-col justify-start">
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>
                                {course.lectures.length} Lectures
                            </CardDescription>
                            <CardContent className="space-y-3">
                                {
                                    course.lectures.map((lecture, index) => (
                                        <div key={index} className='flex items-center gap-3 text-sm'>
                                            <span>
                                                {
                                                    <>
                                                        {lecture.isPreviewFree ? <PlayCircle size={14} /> : <Lock size={14} />}
                                                    </>
                                                }
                                            </span>
                                            <p>{lecture.lectureTitle}</p>
                                        </div>
                                    ))
                                }
                            </CardContent>
                        </CardHeader>
                    </Card>
                </div>
                <div className='w-full lg:w-1/3'>
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            <div className='w-full aspect-video mb-4'>
                                <ReactPlayer
                                width="100%"
                                height="100%"
                                url={course.lectures[0].videoUrl}//introductory video display
                                controls={true}
                                />
                            </div>
                            <h1>Lecture Title</h1>
                            <Separator className='my-2' />
                            <h1 className='text-lg md:text-xl font-semibold'>₹{course.coursePrice}</h1>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            {
                                coursePurchased ? (<Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>) : (<BuyCourseButton course={course} />)
                            }
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CourseDetail