"use client";
import { signUpSchema } from "@/app/models/UserSchema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<signUpSchema> = async (data) => {
    try {
      console.log("d", data);
      const res = await axios.post("/api/auth/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      reset();
      await res.data;
      toast.success(res.data?.message);
      router.push("/user/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "An Error Occurred");
      } else {
        toast.error((error as string) || "An Error Occurred");
      }
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                {...register("username", { required: true })}
                type="text"
                placeholder="Type UserName"
              />
              {errors?.username && (
                <span className="text-sm font-black text-red-500">
                  {errors?.username?.message}
                </span>
              )}
            </div>
            <div>
              <Input
                {...register("email", { required: true })}
                type="email"
                placeholder="Type Email"
              />
              {errors?.email && (
                <span className="text-sm font-black text-red-500">
                  {errors?.email?.message}
                </span>
              )}
            </div>
            <div>
              <Input
                {...register("password", { required: true })}
                type="password"
                placeholder="Type Password"
              />
              {errors?.password && (
                <span className="text-sm font-black text-red-500">
                  {errors?.password?.message}
                </span>
              )}
            </div>
            <Button type="submit">Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <p>
            Already an user ? <Link href="/user/login">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
