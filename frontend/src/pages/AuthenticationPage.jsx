import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LightPurpleButton } from '../utils/buttonStyles';
import { authUser } from '../redux/userHandle';
import styled from 'styled-components';
import Popup from '../components/Popup';

const AuthenticationPage = ({ mode, role }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!email || !password) {
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        if (mode === "Register") {
            const name = event.target.userName.value;

            if (!name) {
                if (!name) setUserNameError(true);
                return;
            }

            if (role === "Seller") {
                const shopName = event.target.shopName.value;

                if (!shopName) {
                    if (!shopName) setShopNameError(true);
                    return;
                }

                const sellerFields = { name, email, password, role, shopName };
                dispatch(authUser(sellerFields, role, mode));
            } else {
                const customerFields = { name, email, password, role };
                dispatch(authUser(customerFields, role, mode));
            }
        } else if (mode === "Login") {
            const fields = { email, password };
            dispatch(authUser(fields, role, mode));
        }
        setLoader(true);
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'userName') setUserNameError(false);
        if (name === 'shopName') setShopNameError(false);
    };

    useEffect(() => {
        if (status === 'success' && currentRole !== null) {
            navigate('/');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    container
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    alignItems="center"
                    justifyContent="center"
                    sx={{ margin: 'auto' }}
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#f7f9fc',
                            padding: '2rem',
                            borderRadius: '8px',
                        }}
                    >
                        <StyledTypography>
                            {role} {mode}
                        </StyledTypography>

                        {role === "Seller" && mode === "Register" &&
                            <Typography variant="h7" align="center" sx={{ mb: 2 }}>
                                Create your own shop by registering as a seller.
                                <br />
                                You will be able to add products and sell them on EM gagets.
                            </Typography>
                        }

                        {role === "Customer" && mode === "Register" &&
                            <Typography variant="h7" align="center" sx={{ mb: 2 }}>
                                Register now to explore and buy the best gadgets.
                            </Typography>
                        }

                        {mode === "Login" &&
                            <Typography variant="h7" align="center" sx={{ mb: 2 }}>
                                Welcome back! Please enter your details to continue.
                            </Typography>
                        }

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {mode === "Register" &&
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="userName"
                                    label="Enter your name"
                                    name="userName"
                                    autoComplete="name"
                                    autoFocus
                                    variant="outlined"
                                    error={userNameError}
                                    helperText={userNameError && 'Name is required'}
                                    onChange={handleInputChange}
                                />
                            }
                            {mode === "Register" && role === "Seller" &&
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="shopName"
                                    label="Create your shop name"
                                    name="shopName"
                                    autoComplete="off"
                                    variant="outlined"
                                    error={shopNameError}
                                    helperText={shopNameError && 'Shop name is required'}
                                    onChange={handleInputChange}
                                />
                            }
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : mode}
                            </LightPurpleButton>
                            <Grid container>
                                <Grid item>
                                    {mode === "Register" ?
                                        "Already have an account?"
                                        :
                                        "Don't have an account?"
                                    }
                                </Grid>
                                <Grid item sx={{ ml: 2 }}>
                                    {mode === "Register" ?
                                        <StyledLink to={`/${role}login`}>
                                            Log in
                                        </StyledLink>
                                        :
                                        <StyledLink to={`/${role}register`}>
                                            Sign up
                                        </StyledLink>
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
}

export default AuthenticationPage

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;

const StyledTypography = styled.h4`
    margin: 0;
    font-weight: 600;
    font-size: 2.125rem;
    line-height: 1.235;
    letter-spacing: 0.00735em;
    color: #2c2143;
    margin-bottom: 16px;
    text-transform: capitalize;
`;
