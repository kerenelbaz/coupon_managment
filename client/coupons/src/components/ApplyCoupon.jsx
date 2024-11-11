import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


export default function ApplyCoupon() {
    const [couponProperties, setCouponProperties] = useState({
        // price: '',
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


    const handleApplyCoupon = async (e) => {
        // e.preventDefault(); // prevent default form submission
        let code = couponProperties.code;
        //let finalPrice = couponProperties.finalPrice;

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
                setApplyCodeFailed(errorText)
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
            {applyCodeFailed && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {applyCodeFailed || "Error occurred while applying coupon code."}
                </Alert>
            )}
        </>
    )
}