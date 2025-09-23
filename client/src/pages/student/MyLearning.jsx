import React, { useEffect } from 'react'
import Course from './Course'
import { useLoadUserQuery } from '@/features/api/authApi';



const MyLearning = () => {
  //purchased courses

  const { data, isLoading,refetch,isError } = useLoadUserQuery();

  useEffect(() => {
    refetch();
  }, [])
  
//console.log(data);
  if(isLoading) return <MyLearningSkeleton/>
  if (isError) return <h1>Error Getting Learnings</h1>

  const user = data?.user;
  const purchasedCourses=user?.enrolledCourses;
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
      <h1 className='font-bold text-2xl mb-6'>MY LEARNING</h1>
      {
        isLoading ? (<MyLearningSkeleton />) :
          purchasedCourses?.length == 0 ? (<p>You are not enrolled in any Course</p>) : (
            <div className='grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {
                purchasedCourses?.map((course, index) => <Course course={course} key={index} />)
              }
            </div>

          )
      }
    </div>

  )
}



const MyLearningSkeleton = () => (

  <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
    <h1 className='font-bold text-2xl mb-6'>MY LEARNING</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
        ></div>
      ))}
    </div>
  </div>

);


export default MyLearning