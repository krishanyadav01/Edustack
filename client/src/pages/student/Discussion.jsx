import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useCreateMessageMutation, useGetCourseMessagesQuery } from '@/features/api/messageApi'
import { AlertCircle, MessageCircleWarning, Send, SendHorizonal, Store } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../../socket.js'
import { useGetCourseByIdQuery, useGetCourseQuery } from '@/features/api/courseApi'
import { useSelector } from 'react-redux'

const Discussion = () => {

  const params = useParams();
  const courseId = params.courseId;
  const userId = params.userId;

  const loggedInUser = useSelector(store => store.auth);

  const SUPER_ADMIN_ID = import.meta.env.VITE_SUPER_ADMIN_ID;
  //console.log(loggedInUser);


  const banned = false;
  const [input, setInput] = useState("");
  const [newMessages, setNewMessages] = useState([]);

  const scrollEndRef = useRef(null);//for scrolling after new chat is sent




  const [createMessage, { data, isLaoding, isSuccess }] = useCreateMessageMutation();

  const { data: getMessagesData, isLoading: getCourseMessageIsLoading, isSuccess: getCourseMessageIsSuccess, refetch } = useGetCourseMessagesQuery({ courseId });

  console.log(getMessagesData);
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {                              //receiving messages sent over connection
      setNewMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('receiveMessage');
  }, []);


  const sendMessageHandler = () => {
    if (input) {
      socket.emit("sendMessage", {                                    //sending message to connection
        userId,
        message: input,
        courseId
      });
      setInput("");
    }
  };





  const messages = [...(getMessagesData?.message ?? []), ...newMessages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isTyping = true;
  return (
    <div className='pt-11 flex justify-center'>
      <Card className="w-[600px] h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Discussion Forum</CardTitle>
          <CardDescription className="text-red-700">
            <div className='flex items-center'>
              <MessageCircleWarning></MessageCircleWarning>
              <span>Respect other participants and dont use and support vulagarity</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex-col overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div>
              {messages?.map((message) => (
                <div key={message._id}>
                  {message?.userId._id !== userId ? (
                    <>
                      <div className="inline-block text-sm bg-blue-200 dark:bg-blue-800 rounded-md p-2 pl-3">
                        <div className='flex flex-col'>
                          <div className='flex gap-2 items-center'>
                            <Avatar className="h-6 w-6 md:h-6 md:w-6">
                              <AvatarImage src={message.userId.photoUrl} alt="@shadcn" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            {/* if superadmin is logged in he sees the email address of person so that he can ban or unban the person */}
                            <span className='font-semibold text-base '>
                              {
                                loggedInUser.user._id === SUPER_ADMIN_ID ? (message.userId.email) : (message.userId.name)
                              }
                            </span>
                            <Badge className="bg">{

                              message.userId._id === message.courseId.creator ? <>Instructor</> : <>Student</>
                            }</Badge>
                          </div>
                          <div className='text-semibold max-w-[450px] break-words'>
                            {message.message}
                          </div>
                          <div className="text-right">
                            {new Date(message.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className='mt-6'></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <div className="inline-block text-sm bg-green-200 dark:bg-green-800 rounded-md p-2 pl-3">
                          <div className='flex flex-col'>
                            <div className='flex gap-2 items-center'>
                              <Avatar className="h-6 w-6 md:h-6 md:w-6">
                                <AvatarImage src={message.userId.photoUrl} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              {/* if superadmin is logged in he sees the email address of person so that he can ban or unban the person */}
                              <span className='font-semibold text-base '>
                                {
                                  loggedInUser.user._id === SUPER_ADMIN_ID ? (message.userId.email) : (message.userId.name)
                                }
                              </span>
                              <Badge className="bg">{
                                message.userId._id === message.courseId.creator ? <>Instructor</> : <>Student</>
                              }</Badge>
                            </div>
                            <div className='text-base max-w-[450px] break-words'>
                              {message.message}
                            </div>
                            <div className="text-right">
                              {new Date(message.createdAt).toLocaleString()}
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="mt-6"></div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div ref={scrollEndRef}></div>
          </ScrollArea>
        </CardContent>
        {
          banned ?
            <>
              <CardFooter className="flex gap-2">
                <AlertCircle className='text-red-700' />
                <h1 className='text-l font-semibold text-red-700'>You have been Banned from Discussion for not adhering to community guidelines</h1>
              </CardFooter>
            </> :
            <>
              <CardFooter className="flex pt-2 ">
                <Input
                  placeholder="Type your message here"
                  className="rounded-r-none focus:outline-none"
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  value={input}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      sendMessageHandler()
                  }}
                />
                <Button className="rounded-l-none" onClick={() => sendMessageHandler()}><Send /></Button>
              </CardFooter>
            </>
        }
      </Card>
    </div>

  )
}

export default Discussion