import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';


export default function CreateCoupon({ onSave, onCancel }) {
    const [error, setError] = useState(null);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        isDoublePromotions: false,
        description: '',
        isPercentageDiscount: false,
        discount: '',
        expirationDate: null,
        maxUsage: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCoupon(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        //checking required fields to be filled
        if (!newCoupon.code || !newCoupon.description || !newCoupon.discount === '') {
            setError("Please fill in all required fields.");
            return;
        }
        setError(null);
        //checking allowed fields if they are empty or undefined
        const c = {
            ...newCoupon,
            expirationDate: newCoupon.expirationDate || null,
            maxUsage: newCoupon.maxUsage === '' ? null : Number(newCoupon.maxUsage) 
        }
        onSave(c);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Box sx={{ p: 3, border: '1px solid #ddd', marginTop: 2, backgroundColor: '#f9f9f9', width: '450px' }}>
                <h3>Create New Coupon</h3>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    label="Code"
                    name="code"
                    value={newCoupon.code}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!newCoupon.code}
                    helperText={!newCoupon.code && "Required coupon code"} />

                <FormControlLabel
                    control={
                        <Checkbox
                            name="isDoublePromotions"
                            checked={newCoupon.isDoublePromotions}
                            onChange={handleChange} />}
                    label="Is Double Promotions"

                />
                <TextField
                    label="Description"
                    name="description"
                    value={newCoupon.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    helperText={!newCoupon.description && "Required"} />

                <FormControlLabel
                    control={
                        <Checkbox
                            name="isPercentageDiscount"
                            checked={newCoupon.isPercentageDiscount}
                            onChange={handleChange} />}
                    label="Is Percentage Discount"
                />
                <TextField
                    label="Discount"
                    name="discount"
                    value={newCoupon.discount}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={newCoupon.discount === ''}
                    helperText={newCoupon.discount === '' && "Required"}
                />

                <TextField
                    label="Expiration Date"
                    name="expirationDate"
                    value={newCoupon.expirationDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                />

                <TextField
                    label="Max Usage"
                    name="maxUsage"
                    value={newCoupon.maxUsage}
                    onChange={handleChange}
                    fullWidth
                    margin="normal" />

                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2, mr: 1 }}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={onCancel} sx={{ mt: 2 }}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );

}