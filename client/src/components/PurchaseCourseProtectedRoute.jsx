
import { useParams } from "react-router-dom";
import { useGetCourseDetailsWithPurchaseStatusQuery } from "@/features/api/coursePurchaseApi";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";


const PurchaseCourseProtectedRoute =({children})=>{
    const {courseId}=useParams();
    const {data ,isLoading}=useGetCourseDetailsWithPurchaseStatusQuery(courseId);
    if(isLoading)return <LoadingSpinner/>

    return data?.purchased?children : <Navigate to={`/course-details/${courseId}`}/>

}

export default PurchaseCourseProtectedRoute;