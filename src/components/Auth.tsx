import React from 'react';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import styles from "./Auth.module.css";

import { useState } from 'react';

import { useDispatch } from 'react-redux';

import {auth, provider, storage} from "../firebase";

import {
Avatar,
Button,
CssBaseline,
TextField,
Paper,
Grid,
Typography,
makeStyles,
Modal,
IconButton,
Box,
} from "@material-ui/core";

import { AccountCircle, Email, Send } from '@material-ui/icons';

import { updateUserProfile } from '../features/userSlice';



function getModalStyle() {
    const top = 50;
    const left = 50;

    return {top: `${top}%`, left: `${left}%`, transform: `translate(-${top}%, -${left}%)`}
}

const useStyles = makeStyles((theme) => ({
    root: {height: '100vh'},

    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },

    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

    submit: {margin: theme.spacing(3, 0, 2)},

    modal: {
        outline: "none",
        position: "absolute",
        width: 400,
        borderRadius: 10,
        backgroundColor: "white",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(10),
    }

}));



const Auth: React.FC = () => {

    const classes = useStyles();

    const signInGoogle = async () => {
        await auth.signInWithPopup(provider).catch((err) => alert(err.message));
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const signInEmail = async () => {
        await auth.signInWithEmailAndPassword(email, password);
    };

    const dispatch = useDispatch();

    const signUpEmail = async () => {

        const authuser = await auth.createUserWithEmailAndPassword(email, password);

        let url = "";
        if (avatarImage){

            const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            const N = 16;

            const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join("");
            
            const fileName = randomChar + "_" + avatarImage.name;

            await storage.ref(`avatars/${fileName}`).put(avatarImage);

            url = await storage.ref("avatars").child(fileName).getDownloadURL();
        }

        await authuser.user?.updateProfile({
            displayName: username,
            photoURL: url,
        });

        dispatch(
            updateUserProfile({
                displayName: username,
                photoUrl: url,
            })
        );

    }

    const [username, setUsername] = useState("");

    const [avatarImage, setAvatarImage] = useState<File | null>(null);

    const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files![0]){
            setAvatarImage(e.target.files![0]);
            e.target.value = "";
        }
    }

    const [openModal, setOpenModal] = React.useState(false);

    const [resetEmail, setResetEmail] = useState("");

    const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
        await auth
        .sendPasswordResetEmail(resetEmail)
        .then(() => {
            setOpenModal(false);
            setResetEmail("");
        })
        .catch((err) => {
            alert(err.message);
            setResetEmail("");
        });
    }

    return (
        <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
        
        <Avatar className={classes.avatar}><LockOutlinedIcon /></Avatar>

        <Typography component="h1" variant="h5">
        {isLogin ? "Login" : "Register"}
        </Typography>

        <form className={classes.form} noValidate>

            {!isLogin && <>

                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus

                value={username}
                onChange={function (e: React.ChangeEvent<HTMLInputElement>) { setUsername(e.target.value); }}
                />

                <Box>
                <IconButton>
                <label>
                <AccountCircle
                fontSize='large'
                className={
                avatarImage
                ? styles.login_addIconLoaded
                : styles.login_addIcon
                }
                />
                <input
                className={styles.login_hiddenIcon}
                type='file'
                onChange={onChangeImageHandler}
                />
                </label>
                </IconButton>
                </Box>

            </>}

            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus

            value={email}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) { setEmail(e.target.value); }}
            />

            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"

            value={password}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) { setPassword(e.target.value); }}
            />

            <Button

            disabled={
            isLogin
            ? !email || password.length < 6
            : !username || !email || password.length < 6 || !avatarImage
            }

            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}

            startIcon={<Email />}
            onClick={
            isLogin
            ? async () => {
                try {
                    await signInEmail();
                }catch(err: any){
                    alert(err.message);
                }
            }
            : async () => {
                try {
                    await signUpEmail();
                }catch(err: any){
                    alert(err.message);
                }
            }
            }

            >
            {isLogin ? "Login" : "Register"}
            </Button>

            <Grid container>

            <Grid item xs>
            <span 
            className={styles.login_reset}
            onClick={() => {
                return setOpenModal(true);
            }}
            >Forgot Password</span>
            </Grid>

            <Grid item>
            <span className={styles.login_toggleMode} onClick={() => {
                                    return setIsLogin(!isLogin);
                                }}>
            {isLogin ? "to Register" : "to Login"}
            </span>
            </Grid>
            </Grid>

            <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signInGoogle}
            >
            Sign In with Google
            </Button>

        </form>

        <Modal open={openModal} onClose={() => {
                        return setOpenModal(false);
                    }}>
        <div style={getModalStyle()} className={classes.modal}>
        <div className={styles.login_modal}>
        <TextField
        InputLabelProps={{shrink: true}}
        type='email'
        name='email'
        label="Reset Email"
        value={resetEmail}
        onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
            setResetEmail(e.target.value);
        }}
        />
        <IconButton onClick={sendResetEmail}>
        <Send />
        </IconButton>
        </div>
        </div>
        </Modal>

        </div>
        </Grid>
        </Grid>
    );
}

export default Auth;
