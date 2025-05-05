import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface Props {
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    type?: string;
    placeholder?: string;
}

export const FormField: React.FC<Props> = ({
    label,
    register,
    error,
    type = 'text',
    placeholder,
}) => (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <input
            className={`form-control ${error ? 'is-invalid' : ''}`}
            type={type}
            placeholder={placeholder}
            {...register}
        />
        {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
);
