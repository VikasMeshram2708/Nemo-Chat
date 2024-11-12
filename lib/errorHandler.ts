import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const ErrorHandler = (error: Error) => {
  if (error instanceof PrismaClientKnownRequestError) {
    return NextResponse.json(
      {
        message: error?.message,
        stack:
          process.env.NODE_ENV === "development"
            ? error?.stack
            : "Error Occurred",
      },
      {
        status: 422,
      }
    );
  }
  if (error instanceof ZodError) {
    const filteredMsg = error.issues.map((e) => ({
      filed: e.path.join("."),
      message: e.message,
    }));
    return NextResponse.json(
      {
        message: filteredMsg,
        stack:
          process.env.NODE_ENV === "development"
            ? error?.stack
            : "Error Occurred",
      },
      {
        status: 422,
      }
    );
  }
  return NextResponse.json(
    {
      message: error?.message,
      stack:
        process.env.NODE_ENV === "development"
          ? error?.stack
          : "Error Occurred",
    },
    {
      status: 500,
    }
  );
};
