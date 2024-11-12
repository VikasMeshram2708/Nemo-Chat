import { signUpSchema } from "@/app/models/UserSchema";
import { ErrorHandler } from "@/lib/errorHandler";
import { prismaInstance } from "@/lib/prismaInstance";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();

    const parsedRes = signUpSchema.safeParse(reqBody);

    if (!parsedRes.success) {
      const filteredErr = parsedRes.error.issues.map((e) => ({
        filed: e.path.join("."),
        message: e.message,
      }));

      throw new Error(String(filteredErr) || "Invalid Data");
    }

    const parsedData = parsedRes.data;

    const userExist = await prismaInstance.user.findFirst({
      where: {
        email: parsedData.email,
      },
    });

    if (userExist) {
      throw new Error("User Already Exist");
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(parsedData.password, 10);
    await prismaInstance.user.create({
      data: {
        username: parsedData.username,
        email: parsedData.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User Registered",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return ErrorHandler(error as Error);
  }
};
