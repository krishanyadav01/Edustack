import LoadingSpinner from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
    useGetCourseProgressQuery,
    useMarkAsCompletedMutation,
    useMarkAsInCompleteMutation,
    useUpdateLectureProgressMutation
} from '@/features/api/courseProgressApi';
import { CheckCircle2, CirclePlay, MessageCircleCode, XCircleIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
    const params = useParams();
    const courseId = params.courseId;
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(
        { courseId },
        { skip: !courseId }
    );

    const [markAsCompleted, { isError: isErr, error, data: completedData, isSuccess: isCompletedSuccess }] = useMarkAsCompletedMutation();
    const [markAsIncomplete, { data: incompletedData, isSuccess: isIncompletedSuccess }] = useMarkAsInCompleteMutation();
    const [updateLectureProgress] = useUpdateLectureProgressMutation();

    const [currentLecture, setCurrentLecture] = useState(null);

    useEffect(() => {
        if (isErr) {
            toast.error(error?.data?.message || "Complete at least one video to mark as completed");
        }
        if (isCompletedSuccess) {
            toast.success(completedData?.message);
        }
    }, [isErr, error, isCompletedSuccess]);

    useEffect(() => {
        if (isIncompletedSuccess) {
            toast.error(incompletedData?.message);
        }
    }, [isIncompletedSuccess]);

    if (!user) return null
    if (!courseId) return <p>Invalid course ID</p>;
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <p>Failed to load course details</p>;

    const { courseDetails, progress, completed } = data?.data;
    const { courseTitle } = courseDetails;
    const initialLecture = currentLecture || (courseDetails?.lectures && courseDetails.lectures[0]);

    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
    };

    const handleLectureProgress = async (lectureId) => {
        await updateLectureProgress({ courseId, lectureId });
        refetch();
    };

    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
    };

    const markCompleteHandler = async () => {
        await markAsCompleted({ courseId: courseDetails._id });
        refetch();
    };

    const markInCompleteHandler = async () => {
        await markAsIncomplete({ courseId: courseDetails._id });
        refetch();
    };

    return (
        <div className='max-w-7xl mx-auto p-4 mt-20'>
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl font-bold'>{courseTitle}</h1>
                <div className='flex gap-3'>
                    <div>
                        <Button onClick={() => navigate(`/discussion-forum/${courseId}/user/${user._id}`)} className="hover:bg-gradient-to-r from-blue-700 via-blue-800 to-purple-800">
                            <MessageCircleCode />
                            <span>Discussion Forum</span>
                        </Button>
                    </div>
                    {
                        !completed ? (
                            <Button className="hover:bg-green-400" onClick={markCompleteHandler}>
                                <CheckCircle2 className='' />
                                <span>Completed</span>
                            </Button>
                        ) : (
                            <Button className="hover:bg-red-600" onClick={markInCompleteHandler}>
                                <XCircleIcon className='text-white' />
                                <span>Incomplete</span>
                            </Button>
                        )
                    }
                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                    <div>
                        <video
                            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                            controls
                            className='w-full h-auto md:rounded-lg'
                            onEnded={() => handleLectureProgress(currentLecture?._id || initialLecture._id)}
                        />
                    </div>
                    <div className='mt-2'>
                        <h3 className='font-medium text-lg'>{currentLecture?.lectureTitle || initialLecture.lectureTitle}</h3>
                    </div>
                </div>
                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                    <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
                    <div className='flex-1 overflow-y-auto'>
                        {
                            courseDetails?.lectures.map((lecture, idx) => (
                                <Card
                                    key={idx}
                                    onClick={() => handleSelectLecture(lecture)}
                                    className={`mb-3 cursor-pointer transition transform ${lecture._id === (currentLecture?._id || initialLecture._id) ? "bg-gray-300 dark:bg-gray-700" : "bg-gray-100"}`}
                                >
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className='flex items-center'>
                                            {
                                                isLectureCompleted(lecture._id) ? (
                                                    <CheckCircle2 size={24} className="text-green-500 mr-2" />
                                                  ) : (
                                                    <CirclePlay size={24} className="text-blue-500 mr-2" />
                                                )
                                            }
                                            <div>
                                                <CardTitle className="text-lg font-medium dark:text-black">{lecture.lectureTitle}</CardTitle>
                                            </div>
                                        </div>
                                        {
                                            isLectureCompleted(lecture._id) && (
                                                <Badge variant={"outline"} className="bg-green-200 text-green-600">Completed</Badge>
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProgress;
