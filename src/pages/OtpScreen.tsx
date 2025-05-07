import React, { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../services/store/store";
import {
  resendOtpUser,
  verifyAccount,
} from "../services/slices/auth/signUpSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


const OtpScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: ["", "", "", "", "", ""] }, // Array for OTP fields
  });

  const inputRefs: any = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits (0-9)

    const otp: any = [...watch("otp")];
    otp[index] = value;
    setValue("otp", otp, { shouldValidate: true });

    // Move focus to next input if a number is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onSubmit = async (data: any) => {
    const otpValue = data.otp.join(""); // Combine into a single OTP string
    const savedEmail = Cookies.get("user_email");
    const otpData: any = { email: savedEmail, otp: otpValue };

    try {
      const response = await dispatch(verifyAccount({ payload: otpData, navigate }));

      const resData = response.payload;
      if (resData?.status === 200) {
        console.log("abc")
        toast.success("OTP verified successfully!");
        navigate("/dashboard");
      } else {
        console.log(123)
        toast.error(resData?.data?.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("An unexpected error occurred.");
    }
    reset();
  };

  const resendOtp = () => {
    const savedEmail = Cookies.get("user_email");
    const data: any = { email: savedEmail };
    dispatch(resendOtpUser(data));
  };
  return (
    <div className="bg-img account vh-100 d-flex justify-content-center align-items-center">
      <div className="p-4 m-2 text-center bg-white rounded otp">
        <h3 className="fw-bold">One Time Password</h3>
        <p className="text-secondary">
          Please check your email and fill OTP (One Time Password)
        </p>

        <p className="fw-bold">OTP</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ul className="gap-3 p-0 d-flex justify-content-center">
            {watch("otp").map((_, index) => (
              <li
                key={index}
                className="px-3 py-2 border rounded border-success list-unstyled"
              >
                <Controller
                  name={`otp.${index}`}
                  control={control}
                  rules={{ required: "OTP is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      ref={(el: any) => (inputRefs.current[index] = el)}
                      type="text"
                      className="text-center bg-transparent border-0 otp-inputs"
                      maxLength={1}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={(e) => {
                        e.preventDefault();
                        const paste = e.clipboardData.getData("text").trim();
                        if (!/^\d{1,6}$/.test(paste)) return;

                        const otp = paste.split("").slice(0, 6);
                        otp.forEach((digit, idx) => {
                          setValue(`otp.${idx}`, digit, { shouldValidate: true });
                          if (inputRefs.current[idx]) {
                            inputRefs.current[idx]!.value = digit;
                          }
                        });

                        const nextIndex = otp.length < 6 ? otp.length : 5;
                        inputRefs.current[nextIndex]?.focus();
                      }}

                    />
                  )}
                />
              </li>
            ))}
          </ul>
          {errors.otp && <p className="mt-2 text-danger">OTP is required</p>}
          <button type="submit" className="px-3 mt-3 btn btn-success">
            Next
          </button>

          <button
            type="button"
            className="px-3 mt-3 btn btn-danger ms-3"
            onClick={() => resendOtp()}
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpScreen;
