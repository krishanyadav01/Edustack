import LoadingSpinner from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetInstructorPurchasedCoursesQuery } from '@/features/api/coursePurchaseApi'
import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const Dashboard = () => {

  const { data, isLoading, isSuccess, isError } = useGetInstructorPurchasedCoursesQuery();

  if (isLoading) return <LoadingSpinner />
  if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>

  const sales = data?.instructorSoldCourse || [];

  const courseData = sales.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice
  }))

  let revenue = 0;
  sales.forEach((course) => {
    revenue += course.courseId.coursePrice;
  });

  console.log(courseData);
  return (
    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='tex-3xl font-bold text-blue-600'>
            {sales.length}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='tex-3xl font-bold text-blue-600'>
          ₹ {revenue}
          </p>
        </CardContent>
      </Card>


      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30} // Rotated labels for better visibility
                textAnchor="end"
                interval={0} // Display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value, name) => [`₹${value}`, name]}
                contentStyle={{
                  backgroundColor: "#1f2937"
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2" // Changed color to a different shade of blue
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard