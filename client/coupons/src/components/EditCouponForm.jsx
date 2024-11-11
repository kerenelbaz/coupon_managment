import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function EditCouponForm({ coupon, onSave, onCancel }) {
    const [selectedDate, setSelectedDate] = useState('');

    const [editedCoupon, setEditedCoupon] = useState({
        ...coupon,
        // handle default values
        code: coupon.code || '',
        isDoublePromotions: coupon.isDoublePromotions ?? false,
        description: coupon.description || '',
        isPercentageDiscount: coupon.isPercentageDiscount ?? false,
        discount: coupon.discount ?? 0,
        expirationDate: coupon.expirationDate ? dayjs(coupon.expirationDate) : null,
        maxUsage: coupon.maxUsage ?? 0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedCoupon(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        // convert dayjs date back to standard date format before saving
        const updatedCoupon = {
            ...editedCoupon,
            expirationDate: editedCoupon.expirationDate ? editedCoupon.expirationDate.toISOString() : null
        };
        onSave(updatedCoupon); //calling onSave in CouponsMange.jsx
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value); 
    };

    return (
        <Box sx={{ p: 3, border: '1px solid #ddd', marginTop: 2, backgroundColor: '#f9f9f9' }}>
            <h3>Edit Coupon</h3>
            <TextField
                label="Code"
                name="code"
                value={editedCoupon.code}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="isDoublePromotions"
                        checked={!!editedCoupon.isDoublePromotions}
                        onChange={handleChange}
                    />
                }
                label="Is Double Promotions"
            />
            <TextField
                label="Description"
                name="description"
                value={editedCoupon.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="isPercentageDiscount"
                        checked={!!editedCoupon.isPercentageDiscount}
                        onChange={handleChange}
                    />
                }
                label="Is Percentage Discount"
            />
            <TextField
                label="Discount"
                name="discount"
                value={editedCoupon.discount}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            <TextField
                label="Expiration Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{
                    shrink: true, // מקטין את הלייבל מעל לשדה התאריך
                }}
            />

            <TextField
                label="Max Usage"
                name="maxUsage"
                value={editedCoupon.maxUsage}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2, mr: 1 }}>
                Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel} sx={{ mt: 2 }}>
                Cancel
            </Button>
        </Box>
    );
}
