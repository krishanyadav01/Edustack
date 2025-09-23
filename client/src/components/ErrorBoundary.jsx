import { useNavigate, useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();//gives error in routes while loading 
  console.error(error);
  const navigate=useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Oops! 😢</h1>
      <p className="text-lg mb-2">Something went wrong.</p>
      <p className="text-gray-600 dark:text-gray-400 mb-4"> 
        {error.statusText || error.message}
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorBoundary;