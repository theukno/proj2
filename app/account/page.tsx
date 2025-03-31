"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("loggedInUser")
    if (sessionUser) {
      setIsLoggedIn(true)
      setEmail(JSON.parse(sessionUser).email)
    }
  }, [])

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email)
  const validatePassword = (password: string) => password.length >= 6

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      toast({ title: "Error", description: "Invalid email format.", variant: "destructive" })
      return
    }
    setLoading(true)
    setTimeout(() => {
      const newOtp = generateOTP()
      setGeneratedOtp(newOtp)
      setOtpSent(true)
      setLoading(false)
      toast({ title: "OTP Sent", description: `Check your email for the code. (Demo OTP: ${newOtp})` })
    }, 1000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp !== generatedOtp) {
      toast({ title: "Invalid OTP", description: "The verification code is incorrect.", variant: "destructive" })
      return
    }
    setIsLoggedIn(true)
    sessionStorage.setItem("loggedInUser", JSON.stringify({ email }))
    toast({ title: "Login Successful", description: "Welcome back!" })
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email) || !validatePassword(password)) {
      toast({ title: "Error", description: "Invalid email or weak password (min 6 characters).", variant: "destructive" })
      return
    }
    setSignupSuccess(true)
    toast({ title: "Signup Successful", description: "Please log in." })
    setPassword("")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail("")
    setPassword("")
    setOtp("")
    setOtpSent(false)
    sessionStorage.removeItem("loggedInUser")
    toast({ title: "Logged Out", description: "See you soon!" })
  }

  return isLoggedIn ? (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {email}</p>
          <p>Member Since: {new Date().toLocaleDateString()}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>Log Out</Button>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Account Access</CardTitle>
        </CardHeader>
        <CardContent>
          {signupSuccess && <Alert className="mb-4"><CheckCircle2 /> Successfully signed up! Please log in.</Alert>}
          {otpSent ? (
            <form onSubmit={handleLogin}>
              <Label>Verification Code</Label>
              <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <Button type="submit" className="w-full mt-4">Verify & Login</Button>
              <Button type="button" variant="link" onClick={() => setOtpSent(false)}>Back</Button>
            </form>
          ) : (
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSendOTP}>
                  <Label>Email</Label>
                  <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Send OTP"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <Label>Email</Label>
                  <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Label>Password</Label>
                  <Input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Button type="submit" className="w-full mt-4">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
