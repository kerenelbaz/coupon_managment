import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';


export default function ApplyCoupon() {
    const [couponProperties, setCouponProperties] = useState({
        code: '',
        finalPrice: ''
    })

    const [applyCodeFailed, setApplyCodeFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCouponProperties(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleApplyCoupon = async () => {
        let code = couponProperties.code;

        try {
            const response = await fetch('https://localhost:7048/api/Coupons/apply-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(code),
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setCouponProperties(prevState => ({ ...prevState, finalPrice: data.finalPrice }))
                setApplyCodeFailed(false);
                setErrorMessage('');
            }
            else {
                setApplyCodeFailed(true)
                const errorText = await response.text();
                console.log("Error response text:", errorText);
                setErrorMessage(errorText)
            }
        } catch (e) {
            console.log("Error during application:", e);
            setApplyCodeFailed(true);
            setErrorMessage("Error occurred, please try again later");

        }

    }

    return (
        <>
            <h2>Use your coupons</h2>

            <br /><br /><br />



            <div>
                <h3>Your total price is:</h3>
                <div className='field-container'>
                    <TextField
                        label={'Code'}
                        name="code"
                        onChange={handleChange}
                        required
                        autoFocus
                        className='field-input'
                    />
                </div>
                <Button variant="outlined" onClick={handleApplyCoupon}>Apply</Button>


            </div>
            <div>
                <TextField
                    label="Final Price"
                    value={couponProperties.finalPrice}
                    variant="standard"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </div>
            <br /> <br />
            <Box mt={1} fontSize="1.1rem">
                <Link to="/Login" style={{ textDecoration: 'none', color: '#1876d2' }}>
                    {'Click here to login your admin account'}
                </Link>
            </Box>
            <br />
            {applyCodeFailed && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage || "Error occurred while applying coupon code."}
                </Alert>
            )}
        </>
    )
}