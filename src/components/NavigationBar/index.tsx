import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
	Switch,
	Menu,
	MenuItem,
	IconButton,
	AppBar,
	Toolbar,
	Typography,
	Tooltip,
	Button,
	FormGroup,
	FormControlLabel,
	Divider
} from "@material-ui/core"
import {
	makeStyles,
	Theme,
	createStyles,
} from "@material-ui/core/styles"
import MoreIcon from "@material-ui/icons/MoreVert"
import GitHubIcon from "@material-ui/icons/GitHub"
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew"
import WbSunnyOutlinedIcon from "@material-ui/icons/WbSunnyOutlined"
import Brightness2OutlinedIcon from '@material-ui/icons/Brightness2Outlined'
import SubscriptionsIcon from '@material-ui/icons/Subscriptions'

const useStyles = makeStyles((theme: Theme) => {
	return createStyles({
		grow: {
			flexGrow: 1,
			backgroundColor:
				theme.palette.type === "dark" ? theme.palette.grey[900] : "#fff",
		},
		button: {
			backgroundColor: "#2e2e2e",
			borderColor: "#2e2e2e",
			color: "#fff",
			"&:hover": {
				backgroundColor: theme.palette.grey["A400"],
				color: "#fff",
			},
		},
		username: {
			display: "none",
			[theme.breakpoints.up("sm")]: {
				display: "block",
			},
			fontFamily: "Roboto Mono, monospace",
			marginRight: theme.spacing(1),
		},
		themeSwitch: {
			marginLeft: theme.spacing(2),
			display: "none",
			[theme.breakpoints.up("s")]: {
				display: "block",
			},
			"& label > .MuiFormControlLabel-label": {
				marginTop: "auto",
			},
		},
		sectionDesktop: {
			display: "none",
			[theme.breakpoints.up("md")]: {
				display: "flex",
			},
		},
		sectionMobile: {
			display: "flex",
			[theme.breakpoints.up("md")]: {
				display: "none",
			},
		},
		divider: {
			height: 28,
			marginTop: 3,
			display: "none",
			[theme.breakpoints.up("sm")]: {
				display: "block",
			},
		},
	})
})

export type NavigationBarProps = {
	isAuthenticated: boolean;
	username: string;
	darkMode: boolean;
	toggleDarkMode: () => void;
	login: () => void;
	logout: () => void;
	settings: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
	isAuthenticated,
	username,
	darkMode,
	toggleDarkMode,
	login,
	logout,
	settings,
}) => {
	const classes = useStyles()
	const [
		mobileMoreAnchorEl,
		setMobileMoreAnchorEl,
	] = useState<null | HTMLElement>(null)
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	}
	
	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMoreAnchorEl(event.currentTarget)
	}

	const mobileMenuId = "primary-search-account-menu-mobile"
	const renderMobileMenu = () => (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			id={mobileMenuId}
			keepMounted
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
			getContentAnchorEl={null}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
		>
			{isAuthenticated ? ([
				<MenuItem key="mobile-subscription-menu-item">
					<Button
						color="inherit" 
						startIcon={<SubscriptionsIcon />}
						onClick={settings}
					>
						Subscriptions
					</Button>
				</MenuItem>,
				<MenuItem key="mobile-logout-menu-item">
					<Button
						color="inherit" 
						startIcon={<PowerSettingsNewIcon />}
						onClick={logout}
					>
						Logout
					</Button>
				</MenuItem>
			]) : (
				<MenuItem key="mobile-github-login-menu-item">
					{gitHubLoginButton("mobile-test-id")}
				</MenuItem>
			)} 
		</Menu>
	)

	const renderNoAuthMenuItems = () => (
		<div className={classes.sectionDesktop}>
			{gitHubLoginButton("desktop-test-id")}
		</div>
	)

	const renderAuthMenuItems = () => (
		<div className={classes.sectionDesktop}>
			<Tooltip title="Subscriptions">
				<IconButton color="inherit" style={{ marginRight: "-5px" }} onClick={settings}>
					<SubscriptionsIcon />
				</IconButton>
			</Tooltip>
			<IconButton color="inherit" style={{ marginLeft: "-5px" }} onClick={logout}>
				<PowerSettingsNewIcon />
			</IconButton>
		</div>
	)

	const gitHubLoginButton = (testId: string) => (
		<Button
			variant="contained"
			startIcon={<GitHubIcon />}
			className={classes.button}
			onClick={login}
			data-testid={testId}
		>
			Login with GitHub
		</Button>
	)

	return (
		<div className={classes.grow}>
			<AppBar position="static" color="transparent">
				<Toolbar>
					<Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
						<Typography variant="h6" noWrap>
							GitHub Issue Notifier
						</Typography>
					</Link>
					<div className={classes.grow} />
					{isAuthenticated && username && ([
						<p key="username" className={classes.username}>Hello, {username}</p>,
						<Divider key="divider" className={classes.divider} orientation="vertical" />
					])}
					{!isAuthenticated ? renderNoAuthMenuItems()	: renderAuthMenuItems()}
					<FormGroup className={classes.themeSwitch}>
						<FormControlLabel
							control={
								<Switch
									checked={darkMode}
									color="default"
									inputProps={{ "aria-label": "checkbox with default color" }}
									onChange={toggleDarkMode}
								/>
							}
							label={darkMode ? <Brightness2OutlinedIcon /> : <WbSunnyOutlinedIcon />}
						/>
					</FormGroup>
					<div className={classes.sectionMobile}>
						<IconButton
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu()}
		</div>
	)
}

export default NavigationBar
