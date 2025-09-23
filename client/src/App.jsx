import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import HeroSection from './pages/student/HeroSection'
import MainLayout from './layout/MainLayout'
import path from 'path'
import { RouterProvider } from 'react-router'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/admin/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import AddCourse from './pages/admin/course/AddCourse'
import CourseTable from './pages/admin/course/CourseTable'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ChatRoute, CoursePurchased, ProtectedRoute, StudentProtectedRoute, SuperAdminGuard, SuperAdminProtectedRoute } from './components/ProtectedRoutes'
import { Toaster } from 'sonner'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Discussion from './pages/student/Discussion'
import Course from './pages/student/Course'
import { Disc } from 'lucide-react'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import Users from './pages/superadmin/Users'
import Instructors from './pages/superadmin/Instructors'
import Revenue from './pages/superadmin/Revenue'
import AllCourses from './pages/superadmin/AllCourses'
import Careers from './pages/student/Careers'
import Request from './pages/superadmin/Request'


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element:
          <SuperAdminGuard>
            <>
              <HeroSection />
              <Courses />
            </>
          </SuperAdminGuard>
      },
      {
        path: "login",
        element:
          <AuthenticatedUser>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>  {/*google oauth components used in Login.jsx require GoogleOAuthProvider */}
              <Login />
            </GoogleOAuthProvider>
          </AuthenticatedUser>
      },
      {
        path: "my-learning",
        element:
          <SuperAdminGuard>
            <ProtectedRoute>
              <MyLearning />
            </ProtectedRoute>
          </SuperAdminGuard>
      },
      {
        path: 'profile',
        element:
          <SuperAdminGuard>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </SuperAdminGuard>
      },
      {
        path: 'course/search',
        element:
          <SuperAdminGuard>
            <SearchPage />
          </SuperAdminGuard>
      },
      {
        path: 'course-details/:courseId',
        element:
          <SuperAdminGuard>
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          </SuperAdminGuard>
      },
      {
        path: "course-progress/:courseId",
        element:
          <SuperAdminGuard>
            <CoursePurchased>
              <CourseProgress />
            </CoursePurchased>
          </SuperAdminGuard>
      },
      {
        path: "discussion-forum/:courseId/user/:userId",
        element:
          <ChatRoute>
            <Discussion />
          </ChatRoute>
      },
      {
        path: "user/careers",
        element:
          <StudentProtectedRoute>
            <Careers/>
          </StudentProtectedRoute>
      }
      ,

//admin routes 

{
  path: "admin",
    element:
  <SuperAdminGuard>
    <AdminRoute>
      <Sidebar />
    </AdminRoute>
  </SuperAdminGuard>,        //admin route will apply to all below components
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "course",
        element: <CourseTable />
      },
      {
        path: "course/create",
        element: <AddCourse />
      },
      {
        path: "course/:courseId",                           //dynamic routing check CoureTable.jsx edit button
        element: <EditCourse />
      },
      {
        path: "course/:courseId/lecture",
        element: <CreateLecture />
      },
      {
        path: "course/:courseId/lecture/:lectureId",
        element: <EditLecture />
      },
    ]
},

//super Admin
{
  path: "superadmin",
    element:
  <SuperAdminProtectedRoute>
    <MainLayout />
  </SuperAdminProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <SuperAdminDashboard />
      }
      ,
      {
        path: "users",
        element: <Users />
      },
      {
        path: "instructors",
        element: <Instructors />
      },
      {
        path: "revenue",
        element: <Revenue />
      },
      {
        path: "courses",
        element: <AllCourses />
      },
      {
        path:"request/:reqId",
        element:<Request />
      }
    ]
}
    ]
  }
])
function App() {


  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>

  )
}

export default App
