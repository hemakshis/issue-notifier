import React, { useEffect, useState } from 'react'
import './App.css'
import { Switch, Route, useHistory } from 'react-router-dom'
import {
	ThemeProvider,
	createMuiTheme,
	makeStyles,
	createStyles
} from "@material-ui/core/styles";
import { Paper, CssBaseline } from "@material-ui/core"
import HomePage from "./components/HomePage"
import Subscriptions from "./components/UserProfile/Subscriptions"
import NavigationBar from "./components/NavigationBar"
import Footer from "./components/Footer"
import GitHubOAuth from "./components/NavigationBar/GitHubOAuth"
import { ACCESS_TOKEN } from "./utils/constants"

declare module "@material-ui/core/styles/createBreakpoints" {
	interface BreakpointOverrides {
		xs: true;
		ss: true;
		s: true;
		sm: true;
		md: true;
		lg: true;
		xl: true;
	}
}

export const AuthenticationContext = React.createContext({ isAuthenticated: false, username: "" })

// TODO: 1. give alerts for user actions, 2. store theme preference somewhere for a user 3. auto logout or alert user when session expires

const useStyles = makeStyles(() => createStyles({
		root: {
			position: "relative",
			minHeight: "100vh"
		},
}))

const App: React.FC<any> = props => {

	const [darkMode, toggleDarkMode] = useState<boolean>(localStorage.getItem("theme") === "dark" ? true : false)
	const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
	const [username, setUsername] = useState<string>("")

	let history = useHistory()

	const classes = useStyles()

	const theme = createMuiTheme({
		palette: {
			type: darkMode ? "dark" : "light",
			background: {
				default: darkMode ? "#424242" : "#fff",
			},
		},
		breakpoints: {
			values: {
				xs: 0,
				ss: 300,
				s: 400,
				sm: 600,
				md: 960,
				lg: 1280,
				xl: 1920,
			},
		},
		overrides: {
			MuiMenuItem: {
				root: {
					height: "36px",
				},
			},
			MuiContainer:{
				maxWidthMd: {
					paddingBottom: "120px"
				}
			}
		},
	})

	useEffect(() => {
		const abortController = new AbortController()
		const signal = abortController.signal

		fetch("/api/v1/user/authenticated", { signal })
			.then(res => res.json())
			.then(({ username, accessToken }) => {
				setAuthenticated(true)
				setUsername(username)
				localStorage.setItem(ACCESS_TOKEN, accessToken)
			})
			.catch(err => {
				setAuthenticated(false)
				setUsername("")
				localStorage.removeItem(ACCESS_TOKEN)
			})

		return () => { abortController.abort() }
	}, [])

	const handleLogin = () => {
		const githubOAuth = GitHubOAuth.startGitHubOAuth("GitHubOAuth")
		githubOAuth
			.then(({ success, code }: { success: boolean, code: string }) => {
				if (success) performGitHubLogin(code)
			})
			.catch((err: any) => console.error(err))
	}

	const performGitHubLogin = (code: string) => {
		fetch(`/api/v1/login/github/oauth2?code=${code}`)
			.then(res => res.json())
			.then(({ username, accessToken }) => {
				setAuthenticated(true)
				setUsername(username)
				localStorage.setItem(ACCESS_TOKEN, accessToken)
			})
			.catch((err) => console.error(err))
	}

	const handleLogout = () => {
		fetch("/api/v1/user/logout")
			.then((res) => res.json())
			.then(res => {
				if (res === "Success") {
					setAuthenticated(false)
					setUsername("")
					localStorage.removeItem(ACCESS_TOKEN)
				}
			})
	}

	const handleSettings = () => {
		if (isAuthenticated)
			history.push("/subscriptions")
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthenticationContext.Provider value={{isAuthenticated, username}}>
				<Paper square={true} elevation={0} className={classes.root}>
					<NavigationBar
						darkMode={darkMode}
						toggleDarkMode={() => toggleDarkMode(() => {
							localStorage.setItem("theme", !darkMode ? "dark" : "light")
							return !darkMode
						})}
						username={username}
						isAuthenticated={isAuthenticated}
						login={handleLogin}
						logout={handleLogout}
						settings={handleSettings}
					/>
					<Switch>
						<Route exact path="/subscriptions" render={(props) => <Subscriptions {...props} />} />
						<Route exact path="/" render={(props) => <HomePage {...props} />} />
					</Switch>
					<Footer />
				</Paper>
			</AuthenticationContext.Provider>
		</ThemeProvider>
	)
}

export default App
