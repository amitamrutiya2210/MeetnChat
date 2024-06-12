"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { verifySchema } from "@/schemas/verifySchema";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { signIn } from "next-auth/react";
import { useAuth } from "@/app/hooks/useAuth";

function SignupForm() {
  const {
    onSignUpFormSubmit,
    onSendVerificationEmail,
    isSubmitting,
    sendMail,
  } = useAuth();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 300);

  const signupForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const sendVerificationEmailForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  return sendMail ? (
    <div className="flex  bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8  bg-secondary rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-6">Verify Your Account</h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(() =>
                onSignUpFormSubmit(signupForm.getValues(), username)
              )}
              className="w-full space-y-6 flex flex-col"
            >
              <FormField
                name="code"
                control={signupForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="flex mx-auto">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-start justify-start">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tighter mb-6">
            Please SignUp to Use
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...sendVerificationEmailForm}>
          <form
            onSubmit={sendVerificationEmailForm.handleSubmit(
              onSendVerificationEmail
            )}
            className="space-y-4 flex-col flex"
          >
            <FormField
              name="fullname"
              control={sendVerificationEmailForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="username"
              control={sendVerificationEmailForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <p
                    className={`flex text-xs ${
                      usernameMessage === "username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {username} {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={sendVerificationEmailForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={sendVerificationEmailForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <Button
              type="button"
              variant={"link"}
              onClick={() => signIn("google")}
              className="w-full"
            >
              Sign in with Google{" "}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignupForm;