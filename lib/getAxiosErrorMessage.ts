/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getAxiosErrorMessage = (error: AxiosError) => {
  // @ts-ignore
  const errMsg = error?.response?.data?.message;
  console.log(`Axios Error : ${errMsg}`);
  toast.error(errMsg || "An Error Occurred. Please try again.");
};
