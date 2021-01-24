import React, { useState, useEffect, useContext } from 'react'
import { Label } from '../../utils/types'
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Badge, Link, Card, CardContent, Button, Typography, CircularProgress } from "@material-ui/core"
import StarIcon from "@material-ui/icons/Star"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import CallSplitIcon from "@material-ui/icons/CallSplit"
import Labels from "./Labels"
import { fetchAllLabelsFromGithub } from "../../utils/githubApis"
import { AuthenticationContext } from '../../App'
import GithubLanguageColors from '../../utils/githubLanguageColors.json'

const GithubLanguageColorsMap: {[key: string]: string} = GithubLanguageColors

export type RepositoryCardProps = {
	fullName: string;
	htmlUrl: string;
	forks?: number;
	openIssues?: number;
	stargazersCount?: number;
	language?: string;
	labels?: Label[]
	inSubscriptionsPage: boolean;
	removeRepository?: (repoName: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor:
				theme.palette.type === "dark" ? theme.palette.grey[900] : "#fff",
			display: "flex",
			marginTop: 18,
		},
		cardContent: {
			flexGrow: 1,
		},
		repositorySummary: {
			marginBottom: 12,
			display: "flex",
			flex: "1 1 0",
			justifyContent: "end",
			paddingTop: 3,
			fontSize: "0.75rem",
			fontFamily: "'Roboto Mono', monospace",
			"& svg": {
				margin: "-1px 3px 0px 3px",
				fontSize: "1.2rem",
			},
		},
		language: ({languageColor, viewLabels}: {languageColor: string, viewLabels: boolean}) => {
			if (languageColor !== "") {
				return {
					"& .MuiBadge-root": {
						backgroundColor: theme.palette.augmentColor({ main: languageColor }).main,
						height: "9px",
						width: "9px",
						borderRadius: "50%",
						marginTop: "-2px",
					},
					"& span": {
						marginLeft: "4px"
					}
				}
			}

			return {}
		},
		viewLabelButton: ({languageColor, viewLabels}: {languageColor: string, viewLabels: boolean}) => {
			if (!viewLabels) {
				return {
					backgroundColor: theme.palette.augmentColor({ main: "#0d47a1" }).main,
					color: "#fff",
					"&:hover": {
						backgroundColor: theme.palette.augmentColor({ main: "#0d47a1" }).dark,
					}
				}
			} else {
				return {
					color: theme.palette.type === "dark" ? "#fff" : "#093170",
					borderColor: theme.palette.type === "dark" ? "#fff" : "#093170",
					"&:hover": {
						backgroundColor: "#093170",
						borderColor: "#093170",
						color: "#fff",
					},
					[theme.breakpoints.down(400)]: {
						width: "50%",
						fontSize: "0.75rem",
					},
				}
			}
		},
		bullet: {
			display: "inline-block",
			margin: "0 2px",
			transform: "scale(0.8)",
		},
		title: {
			fontSize: 14,
		},
		divider: {
			height: 18,
			margin: "4px 9px",
		},
		summary: {
			display: "flex",
			"& .div1": {
				flex: "80%",
			},
			"& .div2": {
				flex: "20%",
				textAlign: "end",
			},
		},
	})
)

const RepositoryCard: React.FC<RepositoryCardProps> = ({
	fullName,
	htmlUrl,
	forks,
	openIssues,
	stargazersCount,
	language,
	labels,
	inSubscriptionsPage,
	removeRepository,
}) => {
	const [viewLabels, toggleViewLabels] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [data, setData] = useState<any>({
		fullName,
		htmlUrl,
		forks,
		openIssues,
		stargazersCount,
		labels,
	})
	const [isUpdate, setUpdate] = useState<boolean>(labels !== undefined ? labels.length > 0 : false)
	const { isAuthenticated } = useContext(AuthenticationContext)
	
	let languageColor: string = ""
	if (language !== undefined && GithubLanguageColorsMap[language] !== undefined)
		languageColor = GithubLanguageColorsMap[language]

	const classes = useStyles({ viewLabels, languageColor })

	useEffect(() => {
		if (viewLabels && isAuthenticated) {
			fetchSubscribedLabels(fullName)
				.then((res) => {
					if (res !== null || res !== undefined) {
						const fetchedLabelsFromGithub: Label[] = data.labels
						if (fetchedLabelsFromGithub != null && fetchedLabelsFromGithub.length > 0) {
							fetchedLabelsFromGithub.forEach(l  => 
								l.subscribed = (res.filter((r: any) => r.name === l.name).length > 0))
							
							setData((prev: any) => ({ ...prev, labels: [...fetchedLabelsFromGithub] }))
						}	
					}
				})
		}
	}, [isAuthenticated])

	const toggleAndFetchLabels = async () => {
		if (!viewLabels && (data.labels === undefined || data.labels.length === 0)) {
			setLoading(true)

			// Fetch labels from Gitub
			let pageNumber: number = 1
			let allLabels: Label[] = []
			let response: Label[] = []
			do {
				response = []
				await fetchAllLabelsFromGithub(fullName, pageNumber)
						.then((res) => {
							response = res.map((l: Label) => 
								({ name: l.name, color: "#" + l.color, selected: false }))
							allLabels = allLabels.concat(response)
						})

				pageNumber++
			} while (response.length !== 0)
			
			// Also fetch labels to which user has already subscribed 
			if (isAuthenticated) {
				await fetchSubscribedLabels(fullName)
					.then((res) => {
						if (res !== null || res !== undefined)
							allLabels.forEach(l  => 
								l.subscribed = (res.filter((r: any) => r.name === l.name).length > 0))
					})
			}

			setData((prev: any) => ({ ...prev, labels: [...allLabels] }))
			setLoading(false)
		}

		toggleViewLabels(!viewLabels)
	}

	const handleSubscribe = async (labels: Label[]): Promise<boolean> => {
		const reqBody = {
			repoName: fullName,
			labels: labels.map(l => ({name: l.name, color: l.color}))
		}
		
		const action = isUpdate ? "update" : "add"
		const method = isUpdate ? "PUT" : "POST"
		
		const success = await fetch(`/api/v1/user/subscription/${action}`, {
			method: method,
			body: JSON.stringify(reqBody),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})
			.then(res => {
				if (res.status === 201 || res.status === 204) {
					setUpdate(true)
					return true
				}
				return false
			})

		return success
	}

	const handleUnsubscribe = async (labels: Label[], isSelectAll: boolean): Promise<boolean> => {
		const reqBody = {
			repoName: fullName,
			labels: labels.map(l => ({name: l.name, color: l.color}))
		}

		const success = await fetch("/api/v1/user/subscription/remove", {
			method: "DELETE",
			body: JSON.stringify(reqBody),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})
			.then(res => {
				if (res.status === 204) {
					if (isSelectAll && removeRepository !== undefined) 
						removeRepository(fullName)
					return true
				}
				return false
			})

		return success
	}

	const fetchSubscribedLabels = (fullName: string): Promise<any> => {
		return fetch(`/api/v1/user/subscription/${fullName}/labels`)
				.then(res => res.json())
				.then((res) => {
					if (res !== null) {
						setUpdate(res.length > 0)

						return res
					}
					return []
				})
				.catch(err => console.error(err))
	}

	return (
		<Card className={classes.root} elevation={9}>
			<CardContent className={classes.cardContent}>
				<div className={classes.summary}>
					<div className="div1">
						<Typography variant="h5" component="h2" style={{fontFamily: "'Roboto Mono', monospace"}}>
							<Link href={data.htmlUrl} target="_blank" rel="noopener" style={{ color: "#03a9f4" }}>
								{data.fullName}
							</Link>
						</Typography>
						{!inSubscriptionsPage && 
							<Typography
								className={classes.repositorySummary}
								color="textPrimary"
							>
								{language !== undefined && languageColor !== "" && (
									<div  className={classes.language}>
										<Badge variant="dot" />
										<span style={{marginRight: "6px"}}>{language}</span>
									</div>
								)}
								<CallSplitIcon /> {data.forks}
								<ErrorOutlineIcon style={{marginLeft: "6px"}} /> {data.openIssues}
								<StarIcon style={{marginLeft: "6px"}} /> {data.stargazersCount}
							</Typography>
						}
					</div>

					{!inSubscriptionsPage && 
						<div className="div2">
							<Button
								size="small"
								variant={viewLabels ? "outlined" : "contained"}
								color="primary"
								className={classes.viewLabelButton}
								onClick={toggleAndFetchLabels}
							>
								{viewLabels ? "Hide Labels" : "View Labels"}
							</Button>
						</div>
					}
				</div>
				{loading && <CircularProgress style={{ margin: "0 50%" }} />}
				{(inSubscriptionsPage || viewLabels) && data.labels &&
					<Labels 
						labels={data.labels} 
						subscribe={handleSubscribe} 
						unsubscribe={handleUnsubscribe} 
						inSubscriptionsPage={inSubscriptionsPage}
					/>
				}
			</CardContent>
		</Card>
	)
}

export default RepositoryCard