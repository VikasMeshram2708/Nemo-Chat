/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { loginSchema } from "@/app/models/UserSchema";
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
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<loginSchema> = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      console.log("res", res);
      if (!res?.ok) {
        console.log("ar", res?.error);
        // @ts-ignore
        return toast.error(res?.error?.message || "Login Failed");
      }
      toast.success("Logged In");
      reset();
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "An Error Occurred");
      } else {
        toast.error((error as string) || "An Error Occurred");
      }
    }
  };

  useEffect(() => {}, [router]);
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
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
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <p>
            Not an user ? <Link href="/user/signup">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
