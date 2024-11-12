/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./modeToggle";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import img from "@/public/logo.jpg";
import Image from "next/image";

export default function Navbar() {
  const { data, status } = useSession();
  return (
    <header className="w-full border-b shadow p-2">
      <nav className="container mx-auto flex items-center justify-between">
        <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
          <Link href="/">Nemo Chat</Link>
        </h1>
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span>processing...</span>
          ) : status === "authenticated" ? (
            // @ts-ignore
            <ProfileDropDown user={data?.user} />
          ) : (
            <Button className="mr-2">
              <Link href="/user/login">Login / Sign Up</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

const ProfileDropDown = ({
  user,
}: {
  user: { id: number; username: string; email: string };
}) => {
  if (!user) {
    return "Loading...";
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Image
            className="border border-green-500 w-7 h-7 rounded-full"
            src={img}
            alt="User"
          />
          <span className="capitalize">{user?.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
