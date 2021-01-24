import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Container, List, ListItem, ListItemIcon, Tooltip } from "@material-ui/core"
import GitHubIcon from '@material-ui/icons/GitHub'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import MailIcon from '@material-ui/icons/Mail'
import TwitterIcon from '@material-ui/icons/Twitter'
import LinkIcon from '@material-ui/icons/Link'

const useStyles = makeStyles((theme: Theme) => createStyles({
	root: {
		position: "absolute",
		bottom: 0,
		textAlign: "center",
		height: "81px",
		maxWidth: "100%",
		backgroundColor:
				theme.palette.type === "dark" ? theme.palette.grey[900] : theme.palette.action.selected,
		boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
	},
	content: {
		padding: "6px",
	},
	footerLinksList: {
		display: "flex",
		paddingBottom: "0px",
		justifyContent: "center",
	},
	footerLinkListItem: {
		width: "24px",
		margin: "0px 16px"
	}
}))

const FOOTER_LINKS = [{
	name: "GitHub",
	icon: <GitHubIcon />,
	link: "https://github.com/hemakshis",
	tooltip: "View and follow @hemakshis on GitHub"
}, {
	name: "LinkedIn",
	icon: <LinkedInIcon />,
	link: "https://linkedin.com/in/hemakshis",
	tooltip: "Connect with Hemakshi on LinkedIn"
}, {
	name: "Mail",
	icon: <MailIcon />,
	link: "sachdev.hemakshi@gmail.com",
	tooltip: "Copy mail to clipboard"
}, {
	name: "Link",
	icon: <LinkIcon />,
	link: "https://hemakshis.github.io",
	tooltip: "Visit Hemakshi's personal website"
}, {
	name: "Twitter",
	icon: <TwitterIcon />,
	link: "https://twitter.com/_hemakshis",
	tooltip: "Follow @_hemakshis on Twitter"
}]

const Footer: React.FC<any> = props => {

	const classes = useStyles()



	return (
		<Container className={classes.root}>
			<div className={classes.content}>
				<span>&#9400; 2021, Hemakshi Sachdev</span>
				<List className={classes.footerLinksList}>
					{FOOTER_LINKS.map(fl =>(
					<ListItem
						key={fl.name} 
						button 
						component="a" 
						href={fl.link} 
						className={classes.footerLinkListItem} 
						disableGutters 
						target="_blank"
					>
						<Tooltip title={fl.tooltip}>
							<ListItemIcon>
								{fl.icon}
							</ListItemIcon>
						</Tooltip>
					</ListItem>
					))}
				</List>
			</div>
		</Container>
	);
}

export default Footer