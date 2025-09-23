//1LZ1tSPjljY1nocz
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useGoogleLoginUserMutation, useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


import { useGoogleLogin } from "@react-oauth/google"


const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

  const [googleLoginUser, { isSuccess: googleLoginSuccess, data: googleData, error: googleLoginError, isLoading: googleLoginIsLoading }] = useGoogleLoginUserMutation();

  const changeInputHandler = (event, type) => {
    const { name, value } = event.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    }
    else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  }

  const navigate = useNavigate();


  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult);
      await googleLoginUser({ code: authResult.code });

    } catch (error) {
      console.error(error);
    }
  }



  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,                  //authResult is automatically passed using this syntax
    onError: responseGoogle,
    flow: 'auth-code'
  })


  useEffect(() => {
    if (googleLoginSuccess && googleData) {
      toast.success(googleData.message || "Login Successfully")
      navigate("/");
    }
  }, [googleLoginSuccess, googleLoginError])


  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successfully")
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup failed")
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successfully")
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Login failed")
    }
  }, [loginIsSuccess, registerIsSuccess, loginError, registerError,loginData]) //triggers if any of these changes


  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">SignUp</TabsTrigger>
          <TabsTrigger value="login">LogIn</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create you new account now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(event) => changeInputHandler(event, "signup")}
                  placeholder="eg. Chirag"
                  required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(event) => changeInputHandler(event, "signup")}
                  placeholder="eg. Chirag@gmail.com"
                  required={true}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(event) => changeInputHandler(event, "signup")}
                  placeholder="eg. @3#eh$"
                  required="true"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button  disabled={registerIsLoading} onClick={() => handleRegistration("signup")}>
                {
                  registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate spin" />Please wait
                    </>
                  ) : "Signup"
                }
              </Button>
              <div className="flex rounded overflow-hidden flex-center">
                <div className="dark:bg-white px-2 py-1.5 pt-2 border-l-2 border-t-2 border-y-2 dark:border-none">
                  {
                    googleLoginIsLoading ? (<Loader2 className="animate-spin w-5 h-5" />) : (
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWIl8zC8WAMHi5JVmKUb3YVvZd5gvoCdy-NQ&s"
                        alt="Google"
                        className="w-5 h-5"
                      />)
                  }
                </div>
                <Button disabled={googleLoginIsLoading} onClick={() => googleLogin()} className="dark:bg-white bg-blue-600  hover:bg-blue-800 dark:hover:bg-slate-100 rounded-none border-none">
                  <div>Signup with Google</div>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login into your existing account now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(event) => changeInputHandler(event, "login")}
                  placeholder="eg. Chirag@gmail.com"
                  required="true"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="current">Password</Label>
                <Input type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(event) => changeInputHandler(event, "login")}
                  placeholder="eg. @3#eh$"
                  required="true"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-row gap-4">
              <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")}>
                {
                  loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate spin" />Please Wait
                    </>
                  ) : "Login"
                }
              </Button>
              <div className="flex rounded overflow-hidden flex-center">
                <div className="dark:bg-white px-2 py-1.5 pt-2 border-l-2 border-t-2 border-y-2 dark:border-none">
                  {
                    googleLoginIsLoading ? (<Loader2 className="animate-spin w-5 h-5" />) : (
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWIl8zC8WAMHi5JVmKUb3YVvZd5gvoCdy-NQ&s"
                        alt="Google"
                        className="w-5 h-5"
                      />)
                  }
                </div>
                <Button disabled={googleLoginIsLoading} onClick={() => googleLogin()} className="dark:bg-white bg-blue-600  hover:bg-blue-800 dark:hover:bg-slate-100 rounded-none border-none">
                  <div>Login with Google</div>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default Login;
