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
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';

export default function CouponsManage() {
    const [couponsData, setCouponsData] = useState([]);

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

    const handleDeleteRow = (username) => {
        console.log("Delete coupon");

    };

    const handleEditUser = (user) => {
        console.log("Edit coupon");
    };


    return (
        <div>
            <h2>Welcome to coupons management! 👋🏻</h2><br />


            {/* <Button variant="outlined" onClick={props.onLogout}>Logout</Button> */}
            <br />    <br />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Coupon ID</TableCell>
                            <TableCell align="left">Code</TableCell>
                            <TableCell align="left">Is double promotion?</TableCell>
                            <TableCell align="left">Admin ID</TableCell>
                            <TableCell align="right">Created date</TableCell>
                            <TableCell align="right">Is precentage discount</TableCell>
                            <TableCell align="right">Discount</TableCell>
                            <TableCell align="right">Experation date</TableCell>
                            <TableCell align="right">Max usages</TableCell>
                            <TableCell align="right">Description</TableCell>

                            <TableCell align="right">Actions</TableCell>
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
                                <TableCell align="left">
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
                                <TableCell align="right">
                                    <span>
                                        {coupon.discount}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span>
                                        {dayjs(coupon.expirationDate).locale('he').format('DD/MM/YYYY')}

                                    </span>
                                </TableCell>

                                <TableCell align="right">
                                    <span>
                                        {coupon.maxUsage != null ? coupon.maxUsage : "Unlimited"}
                                    </span>
                                </TableCell>

                                <TableCell align="right">
                                    <span>
                                        {coupon.description}
                                    </span>
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton aria-label="edit" onClick={() => handleEditUser(coupon)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDeleteRow(coupon.CouponId)}>
                                        <DeleteIcon />
                                    </IconButton>

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
}
