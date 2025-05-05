import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { apiMultiPart } from "../../http/baseUrl";
import {
  startLoadingActivity,
  stopLoadingActivity,
} from "../activity/activitySlice";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Async thunk for signup
export const signUpUser = createAsyncThunk<
  any,
  { payload: any; navigate: (path: string) => void }
>(
  "auth/signUpUser",
  async ({ payload, navigate }, { dispatch, rejectWithValue }) => {
    try {
      console.log("payload----------------", payload)
      dispatch(startLoadingActivity());
      const response = await api.post("Avo/SignUp", payload);
      const resData = response.data;
      console.log("response------------------------000000000000", response.data)
      if (resData.status !== 200) {
        // Show toast here or handle in Register.tsx
        toast.error(resData.data?.message || "Signup failed");
        return rejectWithValue(resData.data?.message || "Signup failed");
      }

      // Proceed only if actual signup is successful
      Cookies.set("user_email", payload.email, { expires: 7 }); // Save for 7 days
      toast.success("OTP sent to email to verify your account!");
      navigate("/otp");
      return resData;
    } catch (error: any) {
      console.error("Signup catch error:", error);

      if (error.response && error.response.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during signup");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

export const uploadLogoImage = createAsyncThunk<any>(
  "auth/uploadLogoImage",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      console.log("hdfg")
      for (const [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }

      dispatch(startLoadingActivity());
      const response = await apiMultiPart.post("Avo/upload-image", payload, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        dispatch(stopLoadingActivity());
        toast.success("Logo uploaded successfully!");
        return response.data;
      } else {
        return rejectWithValue("Upload logo failed");
      }
    } catch (error) {
      console.error("uploadLogoImage error:", error.response?.data ?? error);
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during upload logo");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

export const verifyAccount = createAsyncThunk<
  any,
  { payload: any; navigate: (path: string) => void }
>(
  "auth/verifyAccount",
  async ({ payload, navigate }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoadingActivity());
      const response = await api.post("Avo/verify-otp", payload);
      if (response.status === 200) {
        dispatch(stopLoadingActivity());
        toast.success("Account verified successfully!");
        navigate("/login");
        return response.data;
      } else {
        return rejectWithValue("Account verification failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during verify account");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

export const resendOtpUser = createAsyncThunk<any>(
  "auth/resendOtpUser",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoadingActivity());
      const response = await api.post("Avo/resend-otp", payload);
      if (response.status === 200) {
        toast.success("OTP resend successfully!");
        dispatch(stopLoadingActivity());
        return response.data;
      } else {
        return rejectWithValue("resend otp failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during resend otp");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

export const signInUser = createAsyncThunk<
  any,
  { payload: any; from: string; navigate: (path: string, options?: any) => void }
>(
  "auth/signInUser",
  async ({ payload, from, navigate }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoadingActivity());
      const response = await api.post("Avo/signin", payload);
      if (response.status === 200) {
        dispatch(stopLoadingActivity());
        Cookies.set("user_data", JSON.stringify(response?.data?.data?.user), {
          expires: 30,
        });
        toast.success("User logged in successfully!");
        if (from !== "/") {
          navigate(from, { replace: true });
        } else {
          navigate("/dashboard");
        }
        return response.data;
      } else {
        toast.error("Something went wrong!");
        return rejectWithValue("SingIn failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during signIn");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

export const forgotPassword = createAsyncThunk<any>(
  "auth/forgotPassword",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoadingActivity());
      const response = await api.post("Avo/forgot-password", payload);
      if (response.status === 200) {
        dispatch(stopLoadingActivity());
        return response.data;
      } else {
        return rejectWithValue("Forgot password failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during forgot password");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

export const resetPassword = createAsyncThunk<any>(
  "auth/resetPassword",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoadingActivity());
      const response = await api.post("Avo/reset-password", payload);
      if (response.status === 200) {
        dispatch(stopLoadingActivity());
        return response.data;
      } else {
        return rejectWithValue("Reset password failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during reset password");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

export const getUserDetails = createAsyncThunk<any>(
  "auth/getUserDetails",
  async () => {
    try {
      const response = await api.get("Avo/user-details");
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
    } finally {
    }
  }
);

export const updateProfileDetails = createAsyncThunk<any>(
  "auth/updateProfileDetails",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoadingActivity());
      const response = await api.put("Avo/update-profile", payload);
      if (response.status === 200) {
        dispatch(getUserDetails())
        dispatch(stopLoadingActivity());
        toast.success("Profile updated successfully!");
        return response.data;
      } else {
        return rejectWithValue("Upload logo failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An error occurred during update profile");
    } finally {
      dispatch(stopLoadingActivity());
    }
  }
);

const initialState = {
  loading: false,
  data: [],
  userData: {},
  userDetails: {},
};

const signUpSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(signInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default signUpSlice.reducer;
