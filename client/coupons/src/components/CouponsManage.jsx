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
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import EditCouponForm from './EditCouponForm';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CreateCoupon from './CreateCoupon';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DownloadIcon from '@mui/icons-material/Download';


export default function CouponsManage() {
    const navigate = useNavigate();
    const [couponsData, setCouponsData] = useState([]);
    const [editingCoupon, setEditingCoupon] = useState(null); //usestate for the coupon who editing
    const [createCoupon, setCreateCoupon] = useState(false);
    const [tabValue, setTabValue] = useState('1');

    //use state for filtering the coupon data:
    const [adminFilter, setAdminFilter] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7048/api/Coupons/Coupons', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'

                });
                if (!response.ok) {
                    alert("please reconnect you admin account")
                    navigate('/Login');
                }
                const responseData = await response.json();
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
        try {
            const response = await fetch('https://localhost:7048/api/Admins/Logout', {
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

    const handleDeleteCoupon = async (couponId) => {
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

    const handleCreateNewCoupon = async (newCoupon) => {
        try {
            const response = await fetch('https://localhost:7048/api/Coupons/CreateCoupon', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newCoupon)

            });
            if (response.ok) {
                const createdCoupon = await response.json();
                setCouponsData([...couponsData, createdCoupon]); // update the table with new coupon
                setCreateCoupon(false); //close the create coupon form
                console.log("New coupon added to the table:", newCoupon);

            } else {
                console.error("Failed to create a new coupon");
                const errorText = await response.text();
                console.error("Error creating a new coupon:", errorText);
                alert(errorText);

            }
        } catch (error) {
            console.error("Error creating a new coupon:", error);
        }
    };

    const handleSaveCouponClick = () => {
        setCreateCoupon(true);
    };

    const handleCancelCreateCoupon = () => {
        setCreateCoupon(false);
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setAdminFilter('');
        setDateRange({ start: '', end: '' })
    };

    // handle filtering by date range
    const handleFilterByDateRange = async () => {
        if (tabValue === '2' && dateRange.start && dateRange.end) {
            try {
                const apiURL = `https://localhost:7048/api/Coupons/dateRange?d1=${dateRange.start}&d2=${dateRange.end}`;

                const response = await fetch(apiURL, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const filteredCoupons = await response.json();
                    setCouponsData(filteredCoupons); // update table with filtered data
                    console.log("Filtered coupons:", filteredCoupons);
                }
                else {
                    console.error("Failed to filter coupons");
                    const errorText = await response.text();
                    console.error("Error fetching filtered coupons:", errorText);
                    alert(errorText);
                }
            } catch (error) {
                console.error("Error fetching filtered coupons:", error);
                alert(error.response?.data || "An error occurred while fetching coupons");
            }
        }
    };

    const handleFilterByAdmin = async () => {
        if (tabValue === '1' && adminFilter) {
            try {
                const apiURL = `https://localhost:7048/api/Coupons/CouponByAdmin/${adminFilter}`;

                const response = await fetch(apiURL, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const filteredCoupons = await response.json();
                    setCouponsData(filteredCoupons);
                    console.log("Filtered coupons by admin:", filteredCoupons);
                } else {
                    console.error("Failed to filter coupons by admin");
                    const errorText = await response.text();
                    console.error("Error fetching filtered coupons:", errorText);
                    alert(errorText);
                }
            } catch (error) {
                console.error("Error fetching filtered coupons:", error);
                alert("An error occurred while fetching coupons by admin");
            }
        }
    };



    // function for reset the table filter
    const handleResetFilters = async () => {
        try {
            const response = await fetch('https://localhost:7048/api/Coupons/Coupons', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                const allCoupons = await response.json();
                setCouponsData(allCoupons); // reset to show all coupons

                // clear the filter fields:
                setAdminFilter('');
                setDateRange({ start: '', end: '' });
                console.log("Filters reset, showing all coupons:", allCoupons);
            } else {
                console.error("Failed to fetch all coupons");
            }
        } catch (error) {
            console.error("Error resetting filters:", error);
        }
    };


    const handleExportToExcelClick = async () => {
        try {
            const response = await fetch('https://localhost:7048/api/Coupons/ExportExcel', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Coupons Report.xlsx'
                link.click();
                URL.revokeObjectURL(url);
            }
            else {
                console.error("Failed to export excel file");
            }
        } catch (error) {
            console.error("Error export file:", error);
        }
    }


    return (
        <div>
            <div>
                <Box px={4} pt={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>

                        <Box mt={2}>
                            <Button variant="outlined" onClick={handleLogout}>Logout</Button>

                        </Box>
                    </Box>

                    <h2 style={{ textAlign: 'center' }}>Welcome to coupons management! 👋🏻</h2>

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Box mt={1} fontSize="0.875rem">
                            <Link to="/Register" style={{ textDecoration: 'none', color: 'blue' }}>
                                Create new admin user
                            </Link>
                        </Box>
                        <Button variant="contained" onClick={handleSaveCouponClick}>Create Coupon</Button>
                        <Button variant="contained" endIcon={<DownloadIcon />} onClick={handleExportToExcelClick}>Excel </Button>

                    </Box>
                </Box>
            </div>
            <div>
                <Box sx={{ width: '100%', typography: 'body1', display: 'flex', flexDirection: 'column', m: 2 }}>
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-start' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab label="Filter by Admin" value="1" />
                                <Tab label="Filter by Date Range" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ display: tabValue === '1' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'flex-start', width: '50%' }}>
                            <TextField
                                label="Filter by Admin Username"
                                value={adminFilter}
                                onChange={(e) => setAdminFilter(e.target.value)}
                                fullWidth
                                sx={{ width: '50%' }}
                            />
                        </TabPanel>
                        <TabPanel value="2" sx={{ display: tabValue === '2' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'flex-start', width: '50%' }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                                <TextField
                                    label="Start Date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="End Date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    fullWidth
                                />
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Box>
                <Button onClick={tabValue === '1' ? handleFilterByAdmin : handleFilterByDateRange}>Filter</Button>
                <Button onClick={handleResetFilters}>Reset</Button>

            </div>

            <br />    <br />
            <TableContainer component={Paper} sx={{ width: 1100, margin: 'auto', marginBottom: 6 }}>
                <Table aria-label="user table">
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
                    {couponsData && (
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
                                            {dayjs(coupon.createdDate).locale('he').format('DD/MM/YYYY')}

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

                                            {coupon.expirationDate ? dayjs(coupon.expirationDate).locale('he').format('DD/MM/YYYY') : "No expiration date"}

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
                    )}
                </Table>
            </TableContainer>
            {editingCoupon && (
                <EditCouponForm
                    coupon={editingCoupon}
                    onSave={handleSaveChanges}
                    onCancel={handleCloseEdit}
                />
            )}
            {createCoupon && (
                <CreateCoupon
                    onSave={handleCreateNewCoupon}
                    onCancel={handleCancelCreateCoupon}
                />
            )}
        </div>
    );
}
