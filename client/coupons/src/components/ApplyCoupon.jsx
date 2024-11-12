import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

/**
 * ApplyCoupon component
 * this component allows users to apply a coupon code to get discount.
 * it displays the final price
 */
export default function ApplyCoupon() {
    const [couponProperties, setCouponProperties] = useState({
        code: '',
        finalPrice: ''
    })

    const [applyCodeFailed, setApplyCodeFailed] = useState(false); //state to track if coupon application failed
    const [errorMessage, setErrorMessage] = useState(''); //state to mange the error message from the server

    /**
     * handle changes to the input fields and update the couponProperties state
     * @param {Event} e - event conatining information about the input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCouponProperties(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    /**
     * send the coupon code to the server to apply the discount and update the final price.
     */
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
                const errorData = await response.json();
                setApplyCodeFailed(true)
                setErrorMessage(errorData.message) // set the error message from the server
            }
        } catch (e) {
            console.log("Error during application:", e);
            setApplyCodeFailed(true);
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
                    {errorMessage || "Error occurred while applying coupon code."} {/*present the error message from the server if there is*/}
                </Alert>
            )}
        </>
    )
}