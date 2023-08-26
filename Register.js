import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './Register.css';

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
        .required("Password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/,
            "Password should be at least 8 characters long with 1 uppercase, 1 lowercase, and 1 special character."
        ),
    email: Yup.string().required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("User Role is required"),
});

const Register = () => {
    const navigate = useNavigate();
    const onSubmit = async (values) => {

        console.log(values);
        console.log("Submitted values:", values);

        let regobj = { username: values.username, password: values.password }
        console.log('regobj', regobj);

        let responseData;
        if (values) {

            try {
                const response = await fetch("http://localhost:8000/user", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(regobj)
                });

                if (response.ok) {
                    responseData = await response.json();
                    toast.success('Registered successfully.');
                } else {
                    toast.error('Failed to register.');
                }
            } catch (err) { toast.error('Failed :' + err.message); }

        }

        navigate('/login', { state: responseData });


    };

    return (
        <div className="form-container">
            <Formik
                initialValues={{ username: "", password: "", email: "", phone: "", role: "admin" }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form className="child-container">
                    <div>
                        <h1>User Registration</h1>
                        <div>

                            <div className="input-group">
                                <label>User Name</label>
                                <Field type="text" name="username" />
                                <ErrorMessage name="username" component="span" className="error" />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <Field type="password" name="password" />
                                <ErrorMessage name="password" component="span" className="error" />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <Field type="email" name="email" />
                                <ErrorMessage name="email" component="span" className="error" />
                            </div>
                            <div className="input-group">
                                <label>Phone</label>
                                <Field type="phone" name="phone" />
                                <ErrorMessage name="phone" component="span" className="error" />
                            </div>
                            <div className="input-group">
                                <label>Role</label>
                                <div className="radio-container">
                                    <Field type="radio" name="role" value="admin" />
                                    <label>Admin</label>
                                    <Field type="radio" name="role" value="user" />
                                    <label>User</label>
                                </div>
                                <ErrorMessage name="role" component="div" />
                            </div>
                        </div>
                        <div className="input-group">
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="button-link" >Register</button> 
                        <Link to={'/login'} className="button-link">Close</Link>
                    </div>
                </Form>
            </Formik>

        </div>
    );
}

export default Register;