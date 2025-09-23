import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const EditLecture = () => {
    const params = useParams();
    const courseId = params.courseId;
    return (
        <div className='flex items-center justify-between mb-5'>
            <div className='flex flex-col gap-5 w-full'>
                <div className='flex flex-row gap-2'>
                    <Link to={`/admin/course/${courseId}/lecture`}>
                        <Button size="icon" variant="outline">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <h1 className='font-bold text-xl'>Update Your Lecture</h1>
                </div>
                <LectureTab />
            </div>
        </div>
    )
}

export default EditLecture