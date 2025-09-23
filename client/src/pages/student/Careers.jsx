import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLoadUserQuery } from '@/features/api/authApi'
import { useDeleteRequestMutation, useGetRequestStatusQuery, useRoleChangeMutation, useSendInstructorRequestMutation } from '@/features/api/superAdminApi'
import { AlertCircle, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Careers = () => {


    const { user } = useSelector(store => store.auth);
    const [sendInstructorRequest, { data, isLoading, isSuccess, isError, error }] = useSendInstructorRequestMutation();
    const { data: statusData, isLoading: statusDataIsLoading, refetch } = useGetRequestStatusQuery({ skipCache: true });

    const [roleChange, { data: roleChangeData, isLoading: roleChangeIsLoading, isSuccess: roleChangeIsSuccess, isError: roleChangeIsError, error: roleChangeError }] = useRoleChangeMutation();

    const [deleteRequest, { isLoading: deleteRequestIsLoading, isSuccess: deleteRequestIsSuccess, isError: deleteRequestIsError, error: deleteRequestError }] = useDeleteRequestMutation();
    const navigate = useNavigate();

    const [checked,setChecked]=useState(false);

    const [input, setInput] = useState({
        education: "",
        experience: "",
        resume: null
    })


    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message);
            refetch();
        }
        if (isError) {
            toast.error(error.data.message || "Error Sending Request")
        }
    }, [isSuccess, isError])


    useEffect(() => {
        if (deleteRequestIsSuccess) {
            refetch();
        }
        if (deleteRequestIsError) {
            toast.error(deleteRequestError.data.message);
        }
    }, [deleteRequestIsSuccess, deleteRequestIsError])

    const sendHandler = async () => {
        const formData = new FormData();
        formData.append("education", input?.education);
        formData.append("resume", input?.resume);
        formData.append("experience", input?.experience);


        await sendInstructorRequest({ data: formData });
    }

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setInput({ ...input, [name]: value })
    }

    const setResume = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setInput({ ...input, resume: file });
        }
    }

    const handleRoleChange = async () => {
        await roleChange();
    }

    const deleteReqHandler = async () => {
        await deleteRequest();
    }


    useEffect(() => {
        if (roleChangeIsSuccess) {
            toast.success("Welcome to E-learning This is Your Dashboard to Manage Courses");
            navigate("/admin/dashboard");
        }
        if (roleChangeIsError) {
            toast.error(roleChangeError.data.message);
        }
    }, [roleChangeIsError, roleChangeIsSuccess])


    if (statusDataIsLoading) return <LoadingSpinner />



    if (statusData?.request.length === 0)
        return (

            <div className='flex justify-center mt-40'>
                <Card className="md:w-1/3 lg:w-2/3 sm:w-1/4">
                    <CardHeader>
                        <CardTitle className="text-3xl">Instructor Role At E-learning</CardTitle>
                        <CardDescription className="text-xl">Become an instructor at E-learning Now</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    {/* htmlFor is if we click on that label the corresponding input will be foccused therfore we have id here in input */}
                                    <Label htmlFor="userName" className="ml-2">Name <span className='text-red-700'>*</span></Label>
                                    <Input
                                        id="userName"
                                        name="userName"
                                        placeholder="Name"
                                        required="true"
                                        value={user.name}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="education" className="ml-2">Education <span className='text-red-700'>*</span></Label>
                                    <Input
                                        id="education"
                                        name="education"
                                        placeholder="Education (College)"
                                        value={input.education}
                                        onChange={(event) => changeHandler(event)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="experience" className="ml-2">Experience <span className='text-red-700'>*</span></Label>
                                    <Input
                                        id="experience"
                                        name="experience"
                                        placeholder="Experience (in years)"
                                        value={input.experience}
                                        onChange={(event) => changeHandler(event)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="resume" className="ml-2">Resume <span className='text-red-700'>*</span></Label>
                                    <Input
                                        id="resume"
                                        name="resume"
                                        type="file"
                                        onChange={(event) => setResume(event)}>
                                    </Input>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-start gap-3">
                                    <Checkbox id="terms-2" onCheckedChange={(event)=>{setChecked(event)}}/>
                                    <div className="grid gap-2">
                                        <Label htmlFor="terms-2">Accept terms and conditions</Label>
                                        <p className="text-muted-foreground text-sm">
                                            By clicking this checkbox, you agree to the terms and conditions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=''><Button onClick={() => sendHandler()} disabled={isLoading || !checked}>
                            {
                                isLoading && <Loader2 className='animate-spin' />
                            }
                            Send Request
                        </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        )



    //when request is already submitted

    const status = statusData?.request[0].status;
    const msg = statusData?.request[0].rejectedMsg;




    return (
        <div className="flex flex-col items-center justify-center gap-6 mt-40 text-center">
            <h1 className="text-3xl font-semibold">
                Your Application is <span className="capitalize">{status}</span>
            </h1>

            {status === "rejected" && (
                <div className='flex flex-col items-center justify-center gap-6'>
                    <p className='flex gap-2'><AlertCircle className='text-red-800' /><span className='text-red-800'>{msg}</span></p>
                    <Button variant="destructive" onClick={deleteReqHandler} disabled={deleteRequestIsLoading}>{deleteRequestIsLoading && <Loader2 className='animate-spin' />}Create a New Request</Button>
                </div>
            )}

            {status === "accepted" && (
                <Button className="bg-green-500" variant="default" onClick={() => handleRoleChange()} disabled={roleChangeIsLoading}>
                    {
                        roleChangeIsLoading && <><Loader2 className='animate-spin' /></>
                    }
                    Start as Instructor</Button>
            )}

            {status === "underreview" && (
                <Button onClick={() => navigate(0)} className="bg-yellow-400 dark:bg-yellow-500 dark:text-black" variant="outline">
                    Refresh Status
                </Button>
            )}
        </div>
    );
}

export default Careers