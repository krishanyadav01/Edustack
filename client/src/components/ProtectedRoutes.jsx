import { useGetCourseDetailsWithPurchaseStatusQuery } from "@/features/api/coursePurchaseApi";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useLoadUserQuery } from "@/features/api/authApi";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(store => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login/" />
  }

  return children;
}


export const StudentProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector(store => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login/" />
  }
  if (!user) return null;


  if (user.role !== "student") {
    return <Navigate to="/" />
  }


  return children;
}


export const CoursePurchased = ({ children }) => {
  const { isAuthenticated } = useSelector(store => store.auth);

  const params = useParams();
  const { courseId } = params;


  const { data, isLoading, isError, refetch } = useGetCourseDetailsWithPurchaseStatusQuery({ courseId });

  if (!isAuthenticated) {
    return <Navigate to="/login/" />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (isError) {
    return <h1>Error getting Course Progress</h1>
  }

  const coursePurchased = data?.purchased;
  console.log(data);
  if (!coursePurchased) {
    return <Navigate to={`/course-details/${courseId}`} />;
  }

  return children;
}


export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector(store => store.auth);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setShouldRedirect(true);
      });

    }
  }, [isAuthenticated]);

  if (shouldRedirect) {
    return <Navigate to="/" />;
  }

  return children;
};


export const AdminRoute = ({ children }) => {
  const { data, refetch, isLoading } = useLoadUserQuery(null,
    { skipCache: true });


  //why skipCache when we were clicking on start as 
  //instructor the inital role of student was loaded(using  cache) here and as this is a 
  //protected route we were redirected to home beacuse we still werent instructor a/q to fetched data 
  //so we skipCache and fetched completely from DB again so we get 
  //updated role as instructor and 
  //we are now not redirected to home

  //By default, RTK Query caches responses. If you call a query like loadUserQuery(), 
  //and the same query with the same parameters was made recently, 
  //RTK Query reuses the cached result instead of making a new network request.

  //you tell RTK Query:

  //"Ignore any cached response. Always make a fresh API call to the server."

  //This ensures you get the latest user data (e.g., updated role) right after it's changed.


  const { user, isAuthenticated } = useSelector(store => store.auth);


  if (isLoading) return <LoadingSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login /" />
  }

  if (data.user.role !== "instructor") {
    return <Navigate to="/" />
  }
  return children;
}

export const SuperAdminGuard = ({ children }) => {
  const { user, isAuthenticated } = useSelector(store => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!user) {
    return null;      //renders nothing until user is fetched
  }

  if (user.role === "superadmin") {
    return <Navigate to="/superadmin/dashboard" />
  }
  return children;
}

export const SuperAdminProtectedRoute = ({ children }) => {

  const { user, isAuthenticated } = useSelector(store => store.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  if (!user) {
    return <LoadingSpinner />;
  }
  if (user.role !== "superadmin") {
    return <Navigate to="/login" />
  }

  return children;
}


export const  ChatRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector(store => store.auth);


  const params = useParams();
  const { courseId ,userId} = params;


  const { data, isLoading, isError, refetch } = useGetCourseDetailsWithPurchaseStatusQuery({ courseId });

  if (!isAuthenticated) {
    return <Navigate to="/login/" />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (isError) {
    return <h1>Error getting Course Progress</h1>
  }

  const coursePurchased = data?.purchased;
  const instructorId=data.course.creator._id ;

  if(user._id!==userId)
  {
   return <Navigate to={`/course-details/${courseId}`} />;
  }
  if (!coursePurchased && user.role !== "superadmin" && userId!==instructorId) {
    return <Navigate to={`/course-details/${courseId}`} />;
  }

  return children;
}