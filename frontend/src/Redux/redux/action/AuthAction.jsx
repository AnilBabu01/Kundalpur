import { toast } from "react-toastify";
import { serverInstance } from "../../../API/ServerInstance";

export const LoginwithOtp = (data, response) => {
  serverInstance("user/login-with-mobile", "POST", data).then((res) => {
    try {
      response(res);
    } catch (error) {
      toast.error(res.message);
    }
  });
};

export const VerifyOtp = (data, response) => {
  serverInstance("user/verify-opt", "POST", data).then((res) => {
    try {
      response(res);
    } catch (error) {
      toast.error(res.message);
    }
  });
};
