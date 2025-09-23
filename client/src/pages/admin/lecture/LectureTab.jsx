import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = "http://localhost:8080/api/v1/media";
const LectureTab = () => {

    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);
    const params = useParams()
    const { courseId, lectureId } = params;
    const navigate = useNavigate();

    const [editLecture, { isLoading:editLecetureIsLoading , data,  error, isSuccess }] = useEditLectureMutation();


    const editLectureHandler = async () => {
        await editLecture({ lectureTitle, videoInfo: uploadVideoInfo, courseId, lectureId, isPreviewFree })
    }

    const [removeLecture, {isLoading, data: removeLectureData, isSuccess: removeLectureIsSuccess, isError, error: removeLectureError }] = useRemoveLectureMutation();

    const {data:lectureData ,refetch}=useGetLectureByIdQuery({lectureId});
    const lecture=lectureData?.lecture;

    
    //console.log(lectureData);
    useEffect(()=>{
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsPreviewFree(lecture?.isPreviewFree);
            setUploadVideoInfo(lecture?.videoInfo);
        }
        refetch();
    },[lecture])



    useEffect(() => {
        if (isSuccess)
            toast.success(data.message);
        if (error)
            toast.error(error.data.message);
    }, [isSuccess, error])

    const removeLectureHandler = async () => {
        await removeLecture({ lectureId });
    }

    useEffect(() => {
        if (removeLectureIsSuccess) {
            toast.success(removeLectureData?.message || "Lecture Remmoved Successfully")
            navigate(-1);
        }
        if (isError) {
            toast.error(removeLectureError?.data.message || "Problem Removing Lecture")
        }
    }, [removeLectureIsSuccess, isError])


    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("videoInfo", uploadVideoInfo);
            formData.append("isPreviewFree", isPreviewFree);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100)) / total-1);
                    }
                });
                if (res.data.success) {                           //res=data same like [updateLecture,{data,isLoading}=useUpdateLectureMutation() in rtk]
                    console.log(res.data.data.public_id);
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                //console.log(error);
                toast.error("Problem Uploading Video")
            } finally {
                setMediaProgress(false);
            }
        }
    }


    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div className='flex flex-col gap-2'>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make Changes and click Save when you're done</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button disabled={isLoading}
                    variant="destructive" onClick={removeLectureHandler}>{
                        isLoading ? <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        </>  : "Remove Lecture"
                    }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        value={lectureTitle}
                        onChange={(e) => { setLectureTitle(e.target.value) }}
                        type="text"
                        placeholder="Ex. Introduction to JavaScript"
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-600'>*</span></Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        placeholder="Ex. Introduction to JavaScript"
                        className="w-fit"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch checked={isPreviewFree} id=" " onCheckedChange={(e) => setIsPreviewFree(e)} />
                    <Label>  Is This Video Free?</Label>
                </div>

                {
                    mediaProgress && (
                        <div className='my-4'>
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }
                <div className='mt-4'>
                    <Button disabled={editLecetureIsLoading} onClick={editLectureHandler}>
                        {
                            editLecetureIsLoading ? <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            </>:"Update Lecture"
                        }
                        </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab