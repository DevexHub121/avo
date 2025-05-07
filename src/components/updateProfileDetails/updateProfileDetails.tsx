import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../services/store/store";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { updateProfileDetails, uploadLogoImage } from "../../services/slices/auth/signUpSlice";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  role: string;
  address: string;
  profile_photo: string;
}
const UpdateProfileDetails = ({ showProfileDetail, setShowProfileDetail }) => {
  const [file, setFile] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();
  const userDetails: any = useSelector(
    (state: RootState) => state.auth.userDetails
  );

  console.log("---------------userDetails-------------", userDetails)
  const handleClose = () => {
    setShowProfileDetail(false);
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data: ProfileFormData) => {
    try {
      let profilePhotoUrl = data.profile_photo;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const result = await dispatch(uploadLogoImage(formData)).unwrap();
        profilePhotoUrl = result.url;
      }
      const payload: any = {
        ...data,
        profile_photo: profilePhotoUrl,
        name: `${data.firstName} ${data.lastName}`
      }
      dispatch(updateProfileDetails(payload));
      reset();
      setImgFile(null);
      setShowProfileDetail(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  }

  const handleFileChange = (e: any) => {
    const fileData = e.target.files[0];
    setFile(fileData);
    setImgFile(URL.createObjectURL(fileData));
  };

  const handleFileUpload = () => {
    const formData: any = new FormData();
    formData.append("image", file);
    if (file) {
      dispatch(uploadLogoImage(formData))
        .unwrap()
        .then((res: any) => {
          setValue("profile_photo", res.url, { shouldValidate: true });
        });
    }
  }

  const handleDeleteImage = () => {
    setImgFile(null);
    setValue("profile_photo", "", { shouldValidate: true })
  }

  useEffect(() => {
    if (userDetails) {
      reset({
        firstName: userDetails?.name?.split(" ")?.[0] ?? "",
        lastName: userDetails?.name?.split(" ")?.[1] ?? "",
        email: userDetails?.email ?? "",
        number: userDetails?.number ?? "",
        role: userDetails?.role ?? "",
        address: userDetails?.address ?? "",
        profile_photo: userDetails?.profile_photo ?? ""
      });

      if (userDetails?.profile_photo) {
        setImgFile(userDetails.profile_photo);
      } else {
        setImgFile(null);
      }

    } else {
      reset();
    }


  }, [userDetails, showProfileDetail, reset]);

  return (
    <Modal show={showProfileDetail} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-normal fs-6">Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="table-responsive">
        <div className="p-2 my-2 rounded shadow-lg profile-edit">
          <h3 className="mb-3 text-center fw-semibold fs-5 text-md-start">
            Edit Profile
          </h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 row g-3">
              {/* First Name */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label className=" form-label">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your first name"
                    {...register("firstName", { required: true })}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Last Name */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label className=" form-label">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your last name"
                    {...register("lastName", { required: true })}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Email Address */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label className=" form-label">Email Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                    isInvalid={!!errors.email}
                    disabled={true}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>



              {/* Phone Number */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label>Phone Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>🇺🇸 +1</InputGroup.Text>
                    <Form.Control
                      type="tel"
                      placeholder="Phone Number"
                      {...register("number", { required: true })}
                      isInvalid={!!errors.number}
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </div>

              {/* User Role */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label className=" form-label">User Role</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your role"
                    {...register("role", { required: true })}
                    isInvalid={!!errors.role}
                    disabled={true}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Address */}
              <div className="col-12 col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label className="form-label">Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full address"
                    {...register("address", { required: true })}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                {imgFile === null ? (
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Profile Photo</Form.Label>
                    <Controller
                      name="profile_photo"
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <div
                          className={`d-flex align-items-center border p-2 rounded ${errors.profile_photo ? "border-danger" : ""
                            }`}
                        >

                          <input
                            type="file"
                            className="d-none"
                            id="uploadLogo"
                            accept="image/*"

                            onChange={(e) => {
                              handleFileChange(e);
                              field.onChange(e);
                            }}
                          />
                          <label
                            htmlFor="uploadLogo"
                            className="cursor-pointer d-flex align-items-center"
                          >
                            <FaUpload className="me-2" />
                            <span>Upload Photo</span>
                          </label>
                        </div>
                      )}
                    />
                    {errors.profile_photo && (
                      <span className="text-danger">This field is required</span>
                    )}
                  </Form.Group>
                ) : (
                  <div className="mt-3 mb-2 w-100">
                    <div className="mb-2 w-100">

                      <img className="w-25 rounded-circle" src={imgFile} alt="preview img" />
                    </div>
                    <div className="w-100">
                      <Button
                        className="w-20 mr-2 "
                        variant="danger"
                        onClick={() => handleDeleteImage()}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowProfileDetail(false)}
              >
                Cancel
              </Button>
              <Button variant=" btn-success" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProfileDetails;
