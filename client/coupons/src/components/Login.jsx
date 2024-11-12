import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TaskAlt from '@mui/icons-material/TaskAlt';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import '../myStyle.css';

export default function Login() {
    const navigate = useNavigate();

    const [formLogin, setFormLogin] = useState({
        username: '',
        password: ''
    })

    const [loginFailed, setLoginFailed] = useState(false); //use state hook for unsucceeded login

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormLogin(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent default form submission
        let username = formLogin.username;
        let password = formLogin.password;

        try {
            const response = await fetch('https://localhost:7048/api/Admins/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username, password
                }),
                credentials: 'include'
            });
            if (response.ok) {
                console.log("Login successful")
                setFormLogin({ username: '', password: '' })
                setLoginFailed(false)
                navigate('/coupon-management');
            }
            else {
                setLoginFailed(true)
                console.log('Login failed, please check your username and password')
            }
        } catch (e) {
            console.log("Error during login:", e);
            setLoginFailed(true);
            console.log("Error occurred, please try again later");
        }

    }


    return (
        <div>
            <h2>Login</h2>
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
                <Link to="/">
                    {'Go back to apply coupons'}
                </Link>
            </form>
            {loginFailed && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Incorrect use rname or password.
                </Alert>
            )}

        </div>


    )

}