import React from 'react';
import { FormField } from './FormField';
import { UseFormRegister, FieldErrors, Controller } from 'react-hook-form';

interface Props {
    register: UseFormRegister<any>;
    errors: FieldErrors;
}

export const AdminFields: React.FC<Props> = ({ register, errors }) => (
    <>
        <FormField
            label="Business Name"
            register={register('business_name', { required: 'Required for admins' })}
            error={errors.business_name}
        />
        <FormField
            label="Business Address"
            register={register('business_address', { required: 'Required for admins' })}
            error={errors.business_address}
        />
        {/* Add city, state, pincode, etc. similarly */}
    </>
);
