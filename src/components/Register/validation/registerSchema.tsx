// src/validation/registerSchema.ts
import * as Yup from 'yup';

export const registerSchema = Yup.object({
    firstName: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Must be a valid email'),
    address: Yup.string()
        .required('Address is required'),
    phone: Yup.string()
        .required('Phone number is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    website: Yup.string()
        .url('Must be a valid URL')
        .nullable(),
    profile_photo: Yup.mixed(),
    businessRole: Yup.string()
        .required('Role is required')
        .oneOf(['user', 'business-admin', 'community-member'], 'Invalid role'),
    businessName: Yup.string().when('businessRole', {
        is: 'business-admin',
        then: (schema) => schema.required('Business name is required'),
        otherwise: (schema) => schema.strip(),
    }),
    businessAddress: Yup.string()
        .when('businessRole', {
            is: 'business-admin',
            then: (schema) => schema.required('Business address is required'),
            otherwise: (schema) => schema.strip()
        },
        ),
    businessCity: Yup.string().when('businessRole', {
        is: 'business-admin',
        then: (schema) => schema.required('City is required'),
        otherwise: (schema) => schema.strip(),
    }),
    businessCountry: Yup.string().when('businessRole', {
        is: 'business-admin',
        then: (schema) => schema.required('Country is required'),
        otherwise: (schema) => schema.strip(),
    }),
    businessState: Yup.string().when('businessRole', {
        is: 'business-admin',
        then: (schema) => schema.required('State is required'),
        otherwise: (schema) => schema.strip(),
    }),
    pinCode: Yup.string().when('businessRole', {
        is: 'business-admin',
        then: (schema) => schema.required('Pincode is required'),
        otherwise: (schema) => schema.strip(),
    }),
    logo: Yup.mixed().when('businessRole', {
        is: 'business-admin',
        then: (schema) => schema.required('Business logo is required'),
        otherwise: (schema) => schema.strip(),
    }),
    business_logo: Yup.mixed().when('businessLogo', {
        is: 'business-admin',
        otherwise: (schema) => schema.strip(),
    }),
}); 
