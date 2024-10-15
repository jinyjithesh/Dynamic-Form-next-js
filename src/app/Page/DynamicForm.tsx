'use client';
import React, { useState } from 'react';


type FormDataType = {
    [key: string]: string | string[] | File | undefined;
};
interface FormData {
    [key: string]: string | number | boolean | File | undefined;
}
interface Errors {
    [key: string]: string;
}
const DynamicForm = () => {
    const formSpec = {
        formElements: [
            {
                type: "text",
                id: "username",
                label: "Username",
                name: "username",
                placeholder: "Enter your username",
                required: true,
                validation: {
                    regex: "^[a-zA-Z0-9_]{5,20}$",
                    errorMessage: "Username must be 5-20 characters and contain only letters, numbers, and underscores."
                }
            },
            {
                type: "email",
                id: "email",
                label: "Email",
                name: "email",
                placeholder: "Enter your email",
                required: true,
                validation: {
                    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                    errorMessage: "Please enter a valid email address."
                }
            },
            {
                type: "password",
                id: "password",
                label: "Password",
                name: "password",
                placeholder: "Enter your password",
                required: true,
                validation: {
                    regex: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
                    errorMessage: "Password must be at least 8 characters long and include at least one letter and one number."
                }
            }, {
                type: 'checkbox',
                id: 'gender',
                label: 'Gender',
                name: 'gender',
                required: true,
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' }
                ]
            },
            {
                type: 'file',
                id: 'profileImage',
                label: 'Profile Image',
                name: 'profileImage',
                required: true
            }
        ]
    };

    // const [formData, setFormData] = useState({});
    const [formData, setFormData] = useState<FormDataType>({
        username: '',
        email: '',
        password: '',
        profileImage: undefined,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [allSubmissions, setAllSubmissions] = useState<FormDataType[]>([]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, files, checked } = e.target;

        setFormData((prevData: FormDataType) => {
            console.log("prevData", prevData)
            if (type === 'checkbox') {

                const existingValues = prevData[name] || [];
                if (checked) {

                    return {
                        ...prevData,
                        [name]: Array.isArray(existingValues) ? [...existingValues, value] : [value],
                    };
                } else {

                    return {
                        ...prevData,
                        [name]: Array.isArray(existingValues)
                            ? existingValues.filter((item: string) => item !== value)
                            : [],
                    };
                }
            } else if (type === 'file' && files) {

                return {
                    ...prevData,
                    [name]: files[0],
                };
            } else {

                return {
                    ...prevData,
                    [name]: value,
                };
            }
        });
    };


    const validateField = (
        name: string,
        value: string | number | boolean,
        regex: string,
        errorMessage: string
    ) => {
        const pattern = new RegExp(regex);

        // Perform validation
        if (!pattern.test(value.toString())) {
            setErrors(prev => ({
                ...prev,
                [name]: errorMessage
            }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            console.log('Form is valid!');
            setAllSubmissions(prevSubmissions => [...prevSubmissions, formData]);
            setFormData({});
        } else {
            console.log('Form has errors!');
        }
    };

    return (
        <div className="flex-grow flex overflow-hidden">
            <div className="w-1/3 bg-pink-100 shadow-md flex flex-col p-4">
                <h6 className="text-center">Dynamic Form</h6>

                <form onSubmit={handleSubmit}>
                    {formSpec.formElements.map((element) => (
                        <div key={element.id} style={{ marginBottom: '15px' }}>
                            <label htmlFor={element.id} style={{ display: 'block', marginBottom: '5px' }}>
                                {element.label}
                            </label>

                            {element.type === 'file' ? (
                                <input
                                    type="file"
                                    id={element.id}
                                    name={element.name}
                                    required={element.required}
                                    onChange={handleChange}
                                />
                            ) : element.type === 'checkbox' ? (
                                element.options?.map(option => (
                                    <div key={option.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                        <input
                                            type="checkbox"
                                            id={`${element.id}-${option.value}`}
                                            name={element.name}
                                            value={option.value}
                                            checked={
                                                Array.isArray(formData[element.name]) &&
                                                (formData[element.name] as string[]).includes(option.value)
                                            }
                                            onChange={handleChange}
                                        />
                                        <label htmlFor={`${element.id}-${option.value}`} style={{ marginLeft: '5px' }}>
                                            {option.label}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <input
                                    type={element.type}
                                    id={element.id}
                                    name={element.name}
                                    placeholder={element.placeholder}
                                    required={element.required}
                                    value={
                                        typeof formData[element.name] === 'string'
                                            ? formData[element.name] as string
                                            : ''
                                    }
                                    onChange={(e) => {
                                        handleChange(e);

                                        // Check if validation exists before calling validateField
                                        if (element.validation) {
                                            validateField(
                                                e.target.name,
                                                e.target.value,
                                                element.validation.regex,
                                                element.validation.errorMessage
                                            );
                                        }
                                    }}
                                    style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                                />
                            )}

                            {errors[element.name] && (
                                <span style={{ color: 'red', fontSize: '12px' }}>{errors[element.name]}</span>
                            )}
                        </div>
                    ))}
                    <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
                </form>
            </div>

            <div className="flex flex-col w-2/3 bg-gray-100 overflow-y-auto p-4">

                {allSubmissions.length > 0 && (
                    <div style={{ marginTop: '30px' }}>
                        <h3 className='text-center'>Dynamic Form Data</h3>
                        {allSubmissions.map((submission, index) => (
                            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                                <h4>No:{index + 1}:</h4>
                                <ul>
                                    {Object.entries(submission).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {key === 'profileImage' ? (value as File).name : Array.isArray(value) ? value.join(", ") : value}
                                        </li>
                                    ))}
                                </ul>
                                {submission.profileImage && (
                                    <div>
                                        <h5>Image:</h5>
                                        {submission.profileImage instanceof File ? (
                                            <img
                                                src={URL.createObjectURL(submission.profileImage)}
                                                alt="Profile"
                                                width="200"
                                            />
                                        ) : (
                                            <p>No valid image file uploaded.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DynamicForm;

