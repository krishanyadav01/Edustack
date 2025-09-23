import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAcceptRequestMutation, useGetRequestByIdQuery, useRejectRequestMutation } from '@/features/api/superAdminApi';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Request = () => {
    const [input, setInput] = useState("");
    const params = useParams();
    const { reqId } = params;
     const [rejected,setRejected]=useState(false);
    const { data, isLoading, isSuccess, isError } = useGetRequestByIdQuery({ reqId });
    const navigate=useNavigate();
    const [rejectRequest,{isLoading:rejectReqIsLoading,isSuccess:rejectReqIsSuccess,isError:rejectReqIsError,error:rejectReqError}]=useRejectRequestMutation();
    const [acceptRequest,{isLoading:acceptReqIsLoading,isSuccess:acceptReqIsSuccess,isError:acceptReqIsError,error:acceptReqError}]=useAcceptRequestMutation();
    
   


    

    useEffect(()=>{
        if(rejectReqIsSuccess){
            toast.success("Application Rejected Successfully");
            navigate("/");
        }
        if(acceptReqIsSuccess){
            toast.success("Application Accepted Successfully");
            navigate("/");
        }
        if(rejectReqIsError){
            toast.error(rejectReqError.data.message);
        }
        if(acceptReqIsError){
            toast.error(acceptReqError.data.message);
        }
    },[rejectReqIsSuccess,acceptReqIsSuccess,rejectReqIsError,acceptReqIsError])

    const acceptHandler=async()=>{
        await acceptRequest({reqId});
    }

    const rejectHandler=async()=>{
        await rejectRequest({reqId,msg:input});
    }

    if(isLoading || rejectReqIsLoading || acceptReqIsLoading) return <LoadingSpinner/>
    if (isError) return <ErrorBoundary />
    

    const { request } = data
    return (
        <div className="flex justify-center mt-40">
            <Card className="flex flex-col p-6 px-10 items-center gap-4 w-full max-w-md">
                <div className="text-lg font-semibold">Experience (in Years): <span className="font-normal">{request.yoe}</span></div>
                <div className="text-lg font-semibold">Education (College): <span className="font-normal">{request.education}</span></div>
                <div>
                    <Link
                        to={request.resume}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        View Resume
                    </Link>
                </div>
                <Label>Rejection Message</Label>
                <Input
                    className="w-full"
                    placeholder="Enter rejection message..."
                    value={input}
                    onChange={(event) =>{ setInput(event.target.value);
                        if(event.target.value) setRejected(true);
                        else setRejected(false)
                    }}
                />
                {
                    rejected          ? <Button className="bg-red-600" onClick={()=>rejectHandler()}>Reject</Button>:
                    <Button className="bg-green-600" onClick={()=>acceptHandler()}>Accept</Button>
                }
            </Card>
        </div>

    )
}

export default Request