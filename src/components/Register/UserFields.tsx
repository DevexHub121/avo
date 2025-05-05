import React from 'react';
import { FormField } from './FormField';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface Props {
    register: UseFormRegister<any>;
    errors: FieldErrors;
}

export const UserFields: React.FC<Props> = ({ register, errors }) => (
    <>
        <FormField
            label="Name"
            register={register('name', { required: 'Name is required' })}
            error={errors.name}
        />
        <FormField
            label="Email"
            type="email"
            register={register('email', { required: 'Email is required' })}
            error={errors.email}
        />
        <FormField
            label="Phone Number"
            register={register('number', { required: 'Number is required' })}
            error={errors.number}
            placeholder="+91..."
        />
        <FormField
            label="Password"
            type="password"
            register={register('password', { required: 'Password is required' })}
            error={errors.password}
        />
        <FormField
            label="Website"
            type="url"
            register={register('website')}
            error={errors.website}
        />
    </>
);
