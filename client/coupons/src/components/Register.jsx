import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TaskAlt from '@mui/icons-material/TaskAlt';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import '../myStyle.css';

export default function Register() {
    const [formRegister, setFormRegister] = useState({
        username: '',
        password: ''
    })
    const [registerFailed, setRegisterFailed] = useState(false);
    const [setErrorMessage] = useState('');

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
            });
            if (response.ok) {
                setFormRegister({ username: '', password: '' })
                setRegisterFailed(false)
                setErrorMessage('');
            }
            else {
                setRegisterFailed(true)
                const errorText = await response.text();
                setErrorMessage(errorText)
            }
        } catch (e) {
            console.log("Error during login:", e);
            setRegisterFailed(true);
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
            </form>
            {registerFailed && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Incorrect use rname or password.
                </Alert>
            )}

        </div>


    )

}