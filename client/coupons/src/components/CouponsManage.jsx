import React from 'react'
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import EditCouponForm from './EditCouponForm';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function CouponsManage() {
    const navigate = useNavigate();
    const [couponsData, setCouponsData] = useState([]);
    const [editingCoupon, setEditingCoupon] = useState(null); //usestate for the coupon who editing

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7048/api/Coupons/Coupons', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'

                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const responseData = await response.json();
                console.log("Fetched Data:", responseData); // Add this line to log the fetched data

                setCouponsData(responseData);
            } catch (e) {
                console.error('Error fetching data:', e.message, e);

            }
        };
        fetchData();
    }, []);

    const handleEditCoupon = (coupon) => {
        console.log("Edit coupon");
        setEditingCoupon(coupon);
    };

    const handleCloseEdit = () => {
        setEditingCoupon(null);
    }

    // send to the server the updated coupon
    const handleSaveChanges = async (editedCoupon) => {
        try {
            const response = await fetch(`https://localhost:7048/api/Coupons/${editedCoupon.couponId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editedCoupon)
            });
            if (response.ok) {
                const updatedCoupons = couponsData.map(coupon =>
                    coupon.couponId === editedCoupon.couponId ? editedCoupon : coupon
                );
                setCouponsData(updatedCoupons);
            } else {
                console.error("Failed to update coupon");
            }
        } catch (error) {
            console.error("Error updating coupon:", error);
        } finally {
            setEditingCoupon(null); // close editing mode
        }
    }

    // handle logout admin user 
    const handleLogout = async () => {
        try{const response = await fetch('https://localhost:7048/api/Admins/Logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            }),
            credentials: 'include'
        });
        if (response.ok) {
            console.log("Login successful")
            navigate('/');
        }
        else {
            console.log('Logout failed');
        }
    } catch (e) {
        console.log("Error during logout:", e);
    }
    }

    const handleDeleteCoupon = async (couponId)=>{
        console.log(couponId)
        try {
            const response = await fetch(`https://localhost:7048/api/Coupons/${couponId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
    
            if (response.ok) {
                // filter out the deleted coupon from the local state
                const updatedCoupons = couponsData.filter(coupon => coupon.couponId !== couponId);
                setCouponsData(updatedCoupons);
                console.log("Coupon deleted successfully");
            } else {
                console.error("Failed to delete coupon");
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    }

    return (
        <div>
            <div>
            <Box px={4} pt={2}> 
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
               
                <Box mt={2}> 
                    <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                    <Box mt={1} fontSize="0.875rem">
                        <Link to="/Register" style={{ textDecoration: 'none', color: 'blue' }}>
                            Create new admin user
                        </Link>
                    </Box>
                </Box>
            </Box>

            <h2 style={{ textAlign: 'center' }}>Welcome to coupons management! 👋🏻</h2>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button variant="contained">Create Coupon</Button>
                <Button>Report</Button>
            </Box>
        </Box>
        </div>

            <br />    <br />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Coupon ID</TableCell>
                            <TableCell align="left">Code</TableCell>
                            <TableCell align="center">Is double promotion?</TableCell>
                            <TableCell align="left">Admin ID</TableCell>
                            <TableCell align="left">Created date</TableCell>
                            <TableCell align="left">Is precentage discount</TableCell>
                            <TableCell align="left">Discount</TableCell>
                            <TableCell align="left">Experation date</TableCell>
                            <TableCell align="center">Max usages</TableCell>
                            <TableCell align="left">Description</TableCell>

                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {couponsData.map((coupon, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <span>
                                        {coupon.couponId}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span>
                                        {coupon.code}
                                    </span>
                                </TableCell>
                                <TableCell align="center">
                                    <span>
                                        {coupon.isDoublePromotions ? "Yes" : "No"}
                                    </span>
                                </TableCell>
                                <TableCell align="left">
                                    <span>
                                        {coupon.adminId}
                                    </span>
                                </TableCell>

                                <TableCell align="left">
                                    <span>
                                        {coupon.expirationDate ? dayjs(coupon.createdDate).locale('he').format('DD/MM/YYYY') : "No expiration date"}

                                    </span>
                                </TableCell>
                                <TableCell align="left">
                                    <span>
                                        {coupon.isPercentageDiscount ? "Yes" : "No"}
                                    </span>
                                </TableCell>
                                <TableCell align="left">
                                    <span>
                                        {coupon.discount}
                                    </span>
                                </TableCell>
                                <TableCell align="left">
                                    <span>
                                        {dayjs(coupon.expirationDate).locale('he').format('DD/MM/YYYY')}

                                    </span>
                                </TableCell>

                                <TableCell align="left">
                                    <span>
                                        {coupon.maxUsage != null ? coupon.maxUsage : "Unlimited"}
                                    </span>
                                </TableCell>

                                <TableCell align="left">
                                    <span>
                                        {coupon.description}
                                    </span>
                                </TableCell>

                                <TableCell align="center">
                                    <IconButton aria-label="edit" onClick={() => handleEditCoupon(coupon)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDeleteCoupon(coupon.couponId)}>
                                        <DeleteIcon />
                                    </IconButton>

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {editingCoupon && (
                <EditCouponForm 
                    coupon={editingCoupon}
                    onSave={handleSaveChanges}
                    onCancel={handleCloseEdit}
                />
            )}
        </div>
    );
}
