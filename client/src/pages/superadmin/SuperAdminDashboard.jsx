import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellIcon, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetDashboardDetailsQuery, useGetPendingRequestQuery } from "@/features/api/superAdminApi";
import LoadingSpinner from "@/components/LoadingSpinner";

const SuperAdminDashboard = () => {


    const { data, isLoading } = useGetDashboardDetailsQuery();

    const { data: request, isLoading: requestIsLoading, isSuccess ,refetch } = useGetPendingRequestQuery();


    useEffect(()=>{
        refetch();
    },[])

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ];

    if (isLoading) return <LoadingSpinner />
    if (requestIsLoading) return <LoadingSpinner />

    const { requests } = request;
    const { revenue, totalcourses, users, instructors } = data?.data;
    console.log(requests);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Total Users", value: users.length, name: "users" },
                    { label: "Total instructors", value: instructors.length, name: "instructors" },
                    { label: "Revenue", value: `₹${revenue}`, name: "revenue" },
                    { label: "Courses", value: totalcourses, name: "courses" },
                ].map((stat, idx) => (
                    <Card className="" key={idx}>
                        <CardHeader>
                            <CardTitle className="text-2xl">{stat.label}</CardTitle>
                            <CardDescription className="text-xl">{stat.value}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-end">
                            <div className="hover:cursor-pointer hover:text-blue-500 hover:transition duration-200"><Link to={`/superadmin/${stat.name}`}>more...</Link></div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="shadow-md rounded-2xl p-4 col-span-2">
                    <h2 className="text-lg font-semibold mb-4">User Growth (Last 6 Months)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="desktop" fill="#10B981" />
                                <Bar dataKey="mobile" fill="#6366F1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <Card className="">
                    <CardHeader>
                        <div className="flex gap-1 items-center mb-6">
                            <CardTitle className="text-2xl">Pending Aprrovals</CardTitle>
                            <BellIcon className="mt-2 ml-2" />
                            <div className="bg-red-600 px-2 rounded-full mt-2 ml-2">{requests.length}</div>
                        </div>

                        <div className="max-h-48 overflow-auto space-y-3">
                            {
                                requests.map((req, idx) => (
                                    <Card className="shadow-2xl">
                                        <div className="flex justify-between p-4">
                                            <div className="font-medium">
                                                Instructor Application — {req.userId.name}
                                            </div>
                                            <div>{new Date(req.createdAt).toLocaleString()}</div>
                                            <div className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                                                <Link to={`/superadmin/request/${req._id}`}>Review Application</Link>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            }
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
