import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function InputField({ name, type = "text", value, onChange, register, errors }) {
  return (
    <div className="input-group mb-3">
      <input
        {...register(name, { required: `${name} is required` })}
        onChange={onChange}
        value={value}
        id={name}
        type={type}
        className="form-control"
        placeholder={name}
        aria-label={name}
        aria-describedby="basic-addon1"
      />
      {errors[name] && <p className="text-danger">{errors[name].message}</p>}
    </div>
  );
}

export default InputField;
