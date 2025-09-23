import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/LoadingSpinner'

const Profile = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");


    const { data, isLoading, refetch } = useLoadUserQuery();

    const [updateUser, { data: updateUserData, isLoading: updateIsLoading, error, isSuccess, isError }] = useUpdateUserMutation();   //updateUser is defined in useUpdateUserMutation

    const changeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
    }

    const updateUserHandler = async () => {
        //console.log(name,profilePhoto);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePhoto", profilePhoto);
        await updateUser(formData);
        setIsDialogOpen(false);
    };

    useEffect(() => {
        refetch();
    }, [])




    useEffect(() => {
        if (isSuccess) {
            refetch();  //after updating the profile data useLoadUserQuery() is called again
            toast.message(data.message || "Profile Updated Successfully");
        }
        if (isError)
            toast.error(error.message || "Problem Updating Profile");
    }, [error, updateUserData, isSuccess, isError])


    

    if (isLoading)
        return <><LoadingSpinner /></>

    const user = data && data.user;

    useEffect(() => {
        if(user){
        setName(user.name);
        }
    }, [user])

    return (
        <div className='max-w-4xl mx-auto px-4 my-24'>
            <h1 className='font-bold text-2xl text-center md:text-left'>Profile</h1>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5'>
                <div className='flex flex-col items-center'>
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage src={user && user.photoUrl || "https://github.com/shadcn.png"} alt='@shadcn' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Name:
                            <span className='font-normal text-gray-700 dark:text-gray-300 ml-1'>{user && user.name}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Email:
                            <span className='font-normal text-gray-700 dark:text-gray-300 ml-1'>{user && user.email}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Role:
                            <span className='font-normal text-gray-700 dark:text-gray-300 ml-1'>{user && user.role.toUpperCase()}</span>
                        </h1>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size='sm' className="mt-2">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription className="text-black">
                                    Make Changes to your profile here. Click Save chages when you are done
                                </DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4 py-4'>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label>Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        type="text" placeholder="Name" className="col-span-3" />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label>Profile Photo</Label>
                                    <Input
                                        onChange={changeHandler} type="file" accept="image/*" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={updateIsLoading} onClick={updateUserHandler}>
                                    {
                                        updateIsLoading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Please Wait
                                            </>
                                        ) : "Save Changes"
                                    }
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <h1 className='font-medium text-lg'>Courses You are Enrolled In</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                    {
                        user && user.enrolledCourses.length === 0 ? (<h1>You haven't enrolled in any Courses yet</h1>) : (
                            user && user.enrolledCourses.map((course, index) => <Course course={course} key={course._id} />)
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile