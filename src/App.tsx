import React, { useEffect, useState } from 'react'
import './App.css'
import { Switch, Route, useHistory } from 'react-router-dom'
import HomePage from './components/HomePage'
import Settings from './components/UserProfile/Settings'
import NavigationBar from './components/NavigationBar'
import GitHubOAuth from './components/NavigationBar/GitHubOAuth'
import {
	ThemeProvider,
	createMuiTheme,
} from "@material-ui/core/styles";
import { Paper, CssBaseline } from "@material-ui/core";

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

export const AuthenticationContext = React.createContext({ isAuthenticated: false, username: ""});

const App: React.FC<any> = props => {

	const [darkMode, toggleDarkMode] = useState<boolean>(false)
	const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")

    let history = useHistory()

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
		},
	});

	useEffect(() => {
		fetch("/api/v1/user/authenticated")
			.then(res => res.json())
			.then(({username}) => {
                setAuthenticated(true)
                setUsername(username)
                localStorage.setItem("username", username);
            })
            .catch(err => {
                setAuthenticated(false)
                setUsername("")
                localStorage.removeItem("username");
            })
	}, [])

	const handleLogin = () => {
		const githubOAuth = GitHubOAuth.startGitHubOAuth("GitHubOAuth");
		githubOAuth
			.then(({ success, code }: { success: boolean, code: string }) => {
				if (success) performGitHubLogin(code)
			})
			.catch((err: any) => console.error(err))
	};

	const performGitHubLogin = (code: string) => {
		fetch(`/api/v1/login/github/oauth2?code=${code}`)
			.then((res) => res.json())
			.then(({username}) => {
                setAuthenticated(true)
                setUsername(username)
                localStorage.setItem("username", username);
            })
			.catch((err) => console.error(err));
	};

	const handleLogout = () => {
		fetch("/api/v1/user/logout")
			.then((res) => res.json())
			.then(res => {
                if (res === "Success") {
                    setAuthenticated(false)
                    setUsername("")
                    localStorage.removeItem("username");
                }
			});
	}

	const handleSettings = () => {
		if (isAuthenticated)
        	history.push("/settings")
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
            <AuthenticationContext.Provider value={{isAuthenticated, username}}>
                <Paper square={true} elevation={0}>
                    <NavigationBar
                        darkMode={darkMode}
                        toggleDarkMode={() => toggleDarkMode((prev) => !prev)}
                        username={username}
                        isAuthenticated={isAuthenticated}
                        login={handleLogin}
                        logout={handleLogout}
                        settings={handleSettings}
                    />
                    <Switch>
                        <Route path="/settings" render={(props) => <Settings {...props} />} />
                        <Route path="/" render={(props) => <HomePage {...props} />} />
                    </Switch>
                </Paper>
            </AuthenticationContext.Provider>
		</ThemeProvider>
	);
}

export default App
