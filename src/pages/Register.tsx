import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../services/store/store";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import {
  googleSignUpUser,
  signUpUser,
  uploadLogoImage,
} from "../services/slices/auth/signUpSlice";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../components/Register/validation/registerSchema";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-hot-toast";
import * as CSC from "country-state-city";
import { useLocation } from "react-router-dom";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  website?: string;
  address: string;
  profile_photo: string;
  businessRole: "user" | "business-admin";
  businessName?: string;
  businessAddress?: string;
  businessCity?: string;
  businessCountry?: string;
  businessState?: string;
  pinCode?: string;
  logo?: string;
  business_logo?: string;
};

interface SignUpFormData {
  firstName: string;
  lastName: string;
  businessRole: string;
  website: string;
  phone: string;
  businessName: string;
  address: string;
  email: string;
  password: string;
  logo: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessCountry: string;
  pinCode: string;
  business_logo: string;
}

const Register = () => {
  const [file, setFile] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [businessFile, setBusinessFile] = useState(null);
  const [businessImgFile, setBusinessImgFile] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [countries, setCountries] = useState(CSC.Country.getAllCountries());
  const [states, setStates] = useState<
    ReturnType<typeof CSC.State.getStatesOfCountry>
  >([]);
  const [cities, setCities] = useState<
    ReturnType<typeof CSC.City.getCitiesOfState>
  >([]);
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onBlur", // or 'onChange' / 'onSubmit'
  });

  const selectedCountry = watch("businessCountry");
  const selectedState = watch("businessState");

  useEffect(() => {
    const prefillEmail = (location.state as any)?.email;
    const tokenFromState = (location.state as any)?.token || null;
    setToken(tokenFromState);
    if (prefillEmail) {
      setValue("email", prefillEmail);
      setValue("password", "1234567890");
    }
  }, [location.state, setValue]);

  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      return;
    }
    setStates(CSC.State.getStatesOfCountry(selectedCountry));
    setCities([]);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }
    setCities(CSC.City.getCitiesOfState(selectedCountry, selectedState));
  }, [selectedCountry, selectedState]);

  const [showPassword, setShowPassword] = useState(false);

  const uploadImage = async (file: File | null) => {
    console.log("file", file);
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const res: any = await dispatch(uploadLogoImage(formData)).unwrap();
    return res.url;
  };
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const profileUrl = await uploadImage(file);
      let businessUrl = "";
      if (selectedRole === "business-admin" && businessFile instanceof File) {
        businessUrl = await uploadImage(businessFile);
      }

      const is_businessadmin = data.businessRole === "business-admin";
      const Phone = data.phone.replace(/^\+/, "");

      const commonFields = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        number: Phone,
        password: data.password,
        profile_photo: profileUrl,
        is_businessadmin,
        address: data.address,
        token: token,
      };

      let payload: Record<string, any>;
      if (is_businessadmin) {
        payload = {
          ...commonFields,
          business_name: data.businessName,
          business_address: data.address,
          business_city: data.businessCity,
          business_state: data.businessState,
          business_country: data.businessCountry,
          business_pincode: data.pinCode,
          business_logo: businessUrl,
          token: token,
        };
      } else {
        payload = { ...commonFields };
      }
      console.log("payload", payload);

      if (token) {
        dispatch(googleSignUpUser({ payload, navigate }))
          .unwrap()
          .then((res) => {
            toast.success("Signup successful!");
            reset();
            setFile(null);
            setImgFile(null);
            setBusinessFile(null);
            setBusinessImgFile(null);
            setSelectedRole("");
          });
      } else {
        dispatch(signUpUser({ payload: payload, navigate }))
          .unwrap()
          .then((res) => {
            toast.success("Signup successful!");
            reset();
            setFile(null);
            setImgFile(null);
            setBusinessFile(null);
            setBusinessImgFile(null);
            setSelectedRole("");
          })
          .catch((error) => {
            console.error("Signup error:", error);
            toast.error("Signup failed. Please try again.");
          });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };
  const handleFileChange = (e: any) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      setFile(selected);
      setImgFile(URL.createObjectURL(selected));
      setValue("logo", "", { shouldValidate: true });
    }
  };

  const handleBusinessFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setBusinessFile(selected);
    setBusinessImgFile(selected ? URL.createObjectURL(selected) : null);
    setValue("business_logo", "");
  };

  const handleDeleteBusinessImage = () => {
    setBusinessFile(null);
    setBusinessImgFile(null);
    setValue("business_logo", "");
  };

  const handleDeleteImage = () => {
    setFile(null);
    setImgFile(null);
    setValue("logo", "", { shouldValidate: true });
  };

  return (
    <div className="register-page bg-dark text-light vh-100 d-flex align-items-center mob-top">
      <div className="container-fluid">
        <Row className="px-5 justify-content-center mob-space">
          <Col md={12} lg={12}>
            <div className="">
              <Row className="">
                <Col
                  md={5}
                  className="py-4 text-white bg-dark d-flex flex-column justify-content-center"
                >
                  <h2 className="mb-3 fw-bold fs-1 buss">
                    Successfull Business <br></br> Strategies
                  </h2>
                  <p>
                    Avo allows you to control the narrative & aids in bringing
                    together local businesses to retain employees by creating a
                    community inspired discount program.
                  </p>
                  <img
                    className="mt-5 w-75"
                    src="/images/OBJECTS.png"
                    alt="img"
                  />
                  <div className="mt-auto">
                    <div className="d-flex align-items-center">
                      <div className="me-2">⬜⬜⬜⬜</div>
                    </div>
                  </div>
                </Col>

                {/* Right Section - Form */}
                <Col md={7}>
                  <Card.Body
                    className="p-4 text-black bg-white"
                    style={{
                      borderRadius: "24px",
                      borderLeft: "7px solid #198754",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      height: "60vh",
                      overflowY: "auto",
                      padding: "1.5rem",
                      marginBottom: "10px",
                    }}
                  >
                    <h4 className="mb-4 fw-bold">Sign-Up</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Row className="block-tab">
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="First Name"
                              {...register("firstName", { required: true })}
                              isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                              This field is required
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Last Name"
                              {...register("lastName", { required: true })}
                              isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                              This field is required
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="formJobRole" className="mb-3">
                            <Form.Label>Your Bussiness role</Form.Label>
                            <Form.Select
                              {...register("businessRole", { required: true })}
                              isInvalid={!!errors.businessRole}
                              onChange={(e) => {
                                setSelectedRole(e.target.value);
                                setValue("businessRole", e.target.value, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <option value="community-member">
                                Community Member
                              </option>
                              <option value="business-admin">
                                Business Admin
                              </option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              This field is required
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mob-block">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter your email"
                              {...register("email", { required: true })}
                              isInvalid={!!errors.email}
                              disabled={!!token}
                            />
                            <Form.Control.Feedback type="invalid">
                              This field is required
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Controller
                              name="phone"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <PhoneInput
                                  country={"us"} // default country
                                  value={value}
                                  onChange={onChange} // updates RHF state
                                  inputProps={{
                                    name: "phone",
                                    required: true,
                                  }}
                                  inputStyle={{ width: "100%" }}
                                />
                              )}
                            />
                            {errors.phone && (
                              <Form.Text className="text-danger">
                                {errors.phone.message}
                              </Form.Text>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your Address"
                              {...register("address", { required: true })}
                              isInvalid={!!errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                              This field is required
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Profile Photo</Form.Label>
                            {!imgFile ? (
                              <div className="p-2 border rounded d-flex align-items-center">
                                <input
                                  type="file"
                                  className="d-none"
                                  id="uploadLogo"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                                <label
                                  htmlFor="uploadLogo"
                                  className="cursor-pointer d-flex align-items-center"
                                >
                                  <FaUpload className="me-2" />
                                  <span>Upload Photo</span>
                                </label>
                              </div>
                            ) : (
                              <div className="mb-3 d-flex align-items-center">
                                <img
                                  className="w-25 rounded-circle me-3"
                                  src={imgFile}
                                  alt="preview"
                                />
                                <Button
                                  variant="danger"
                                  onClick={handleDeleteImage}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row></Row>
                      {!token && (
                        <Row>
                          <Col md={6} className="mob-w">
                            <Form.Group className="mb-3">
                              <Form.Label>Password</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  placeholder="Enter password"
                                  {...register("password", { required: true })}
                                  isInvalid={!!errors.password}
                                />
                                <InputGroup.Text
                                  onClick={() => setShowPassword(!showPassword)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                  This field is required
                                </Form.Control.Feedback>
                              </InputGroup>
                              <small className="text-muted">
                                Use 8+ characters with a mix of letters, numbers
                                & symbols
                              </small>
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        {selectedRole === "business-admin" && (
                          <>
                            <Row>
                              <Col md={6} className="mob-w">
                                <h2
                                  className="mb-3 font-bold"
                                  style={{ color: "black" }}
                                >
                                  Business Details
                                </h2>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Business Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Business Name"
                                    {...register("businessName", {
                                      required: true,
                                    })}
                                    isInvalid={!!errors.businessName}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    This field is required
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Business Logo</Form.Label>
                                  {!businessImgFile ? (
                                    <div className="p-2 border rounded d-flex align-items-center">
                                      <input
                                        type="file"
                                        className="d-none"
                                        id="uploadBusinessLogo"
                                        accept="image/*"
                                        onChange={handleBusinessFileChange}
                                      />
                                      <label
                                        htmlFor="uploadBusinessLogo"
                                        className="cursor-pointer d-flex align-items-center"
                                      >
                                        <FaUpload className="me-2" />
                                        Upload Logo
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="mb-3 d-flex align-items-center">
                                      <img
                                        src={businessImgFile}
                                        className="rounded w-25 me-3"
                                        alt="preview"
                                      />
                                      <Button
                                        variant="danger"
                                        onClick={handleDeleteBusinessImage}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Business Address</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Business Address"
                                    {...register("businessAddress", {
                                      required: true,
                                    })}
                                    isInvalid={!!errors.businessAddress}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    This field is required
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Country</Form.Label>
                                  <Form.Select
                                    {...register("businessCountry", {
                                      required: true,
                                    })}
                                    isInvalid={!!errors.businessCountry}
                                    defaultValue=""
                                  >
                                    <option value="" disabled>
                                      — Select country —
                                    </option>
                                    {countries.map((c) => (
                                      <option key={c.isoCode} value={c.isoCode}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    This field is required
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>State</Form.Label>
                                  <Form.Select
                                    {...register("businessState", {
                                      required: true,
                                    })}
                                    isInvalid={!!errors.businessState}
                                    defaultValue=""
                                    disabled={!states.length}
                                  >
                                    <option value="" disabled>
                                      — Select state —
                                    </option>
                                    {states.map((s) => (
                                      <option key={s.isoCode} value={s.isoCode}>
                                        {s.name}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    This field is required
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>City</Form.Label>
                                  <Form.Select
                                    {...register("businessCity", {
                                      required: true,
                                    })}
                                    isInvalid={!!errors.businessCity}
                                    defaultValue=""
                                    disabled={!cities.length}
                                  >
                                    <option value="" disabled>
                                      — Select city —
                                    </option>
                                    {cities.map((c) => (
                                      <option key={c.name} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    This field is required
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>

                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Pin Code</Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="Pin Code"
                                    {...register("pinCode", {
                                      required: true,
                                    })}
                                    isInvalid={!!errors.pinCode}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    This field is required
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </>
                        )}
                      </Row>
                      <div className="flex-row gap-5 mb-2 d-flex align-items-center  mob-block">
                        <Button
                          variant="primary"
                          type="submit"
                          className="content-fit btn-success"
                        >
                          Sign Up
                        </Button>

                        <p className="flex-grow-0 text-center mob-lft">
                          Already have an account?{" "}
                          <Link to="/login" className="text-success">
                            Log in
                          </Link>
                        </p>
                      </div>
                      <p className="">
                        <b>Copyright 2023 © </b> Designed by Tyler Fox.
                        UseAvo.com serving local businesses in Abington PA,
                        Ambler PA, Bryn Athyn PA, Dresher PA, Fort Washington
                        PA, Hatboro PA, Horsham PA, Huntingdon Valley PA,
                        Jamison PA, Montgomeryville PA, Oreland PA, Spring House
                        PA, Upper Dublin PA, Warminster PA, Warrington PA, &
                        Willow Grove PA and surrounding counties in Montgomery &
                        Bucks County, PA, and Philadelphia, PA.
                      </p>
                    </Form>
                  </Card.Body>
                </Col>
              </Row>
              <p></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;
