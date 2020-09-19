import React, { useState } from 'react'
import './App.css'
import { Switch, Route } from 'react-router-dom'
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

const App: React.FC<any> = props => {

	const [darkMode, toggleDarkMode] = useState<boolean>(false)
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
  const [username, setUsername] = useState<string>("")

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

	const handleLogin = () => {
    const githubOAuth = GitHubOAuth.startGitHubOAuth("GitHubOAuth");
    githubOAuth
      .then(({ success, code }: {success: boolean, code: string}) => {
        if (success) performGitHubLogin(code)
      })
      .catch((err: any) => console.error(err))
  };

  const performGitHubLogin = (code: string) => {
    fetch(`/login/github/oauth2?code=${code}`)
      .then((res) => res.json())
      .then(({ authorized, accessToken, username }) => {
        if (authorized) {
					setAuthenticated(authorized)
					setUsername(username)
          localStorage.setItem("accessToken", accessToken);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    fetch("/logout")
      .then((res) => res.json())
      .then(({ success, authorized }) => {
        if (success) {
          setAuthenticated(authorized)
          setUsername("")
          localStorage.removeItem("accessToken");
        }
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper square={true} elevation={0}>
        <NavigationBar
          darkMode={darkMode}
          toggleDarkMode={() => toggleDarkMode((prev) => !prev)}
          username={username}
          isAuthenticated={isAuthenticated}
          login={handleLogin}
          logout={handleLogout}
        />
        <Switch>
          <Route path="/" render={(props) => <HomePage {...props} />} />
          <Route path="/settings" render={(props) => <Settings {...props} />} />
        </Switch>
      </Paper>
    </ThemeProvider>
  );
}

export default App
