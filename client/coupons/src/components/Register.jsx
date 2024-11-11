import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TaskAlt from '@mui/icons-material/TaskAlt';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Link } from 'react-router-dom';

import '../myStyle.css';

export default function Register() {
    const [formRegister, setFormRegister] = useState({
        username: '',
        password: ''
    })
    const [registerFailed, setRegisterFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormRegister(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent default form submission
        let username = formRegister.username;
        let password = formRegister.password;

        try {
            const response = await fetch('https://localhost:7048/api/Admins/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username, password
                }),
                credentials: 'include',
            });
            if (response.ok) {
                setFormRegister({ username: '', password: '' })
                setRegisterFailed(false)
                setErrorMessage('');
                setSuccessMessage('Admin created successfully!');

            }
            else {
                setRegisterFailed(true)
                const errorText = await response.text();
                setErrorMessage(errorText)
                setSuccessMessage('');
            }
        } catch (e) {
            console.log("Error during login:", e);
            setRegisterFailed(true);
            console.log("Error occurred, please try again later");
            setSuccessMessage('');
        }

    }


    return (
        <div>
            <Link to="/coupon-management" style={{ textDecoration: 'none', color: 'blue', fontSize:'1.2rem'}}>
                back to coupon management
            </Link>
            <h2>Create new  admin</h2>
            <form onSubmit={handleSubmit}>
                <div className='field-container'>
                    <TextField
                        label={'Username'}
                        name="username"
                        onChange={handleChange}
                        required
                        autoFocus
                        className='field-input'
                    />
                </div>
                <div className='field-container'>
                    <TextField
                        label={'Password'}
                        name="password"
                        onChange={handleChange}
                        required
                        autoFocus
                        className='field-input'
                    />
                </div>
                <div>
                    <Button type="submit" variant="contained" endIcon={<TaskAlt />}>Send</Button>
                </div>
            </form>
            {registerFailed && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage || "Error occurred while creating new admin"}
                </Alert>
            )}
            {successMessage && (
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    {successMessage}
                </Alert>
            )}

        </div>


    )

}