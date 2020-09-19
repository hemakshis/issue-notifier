import React, { useState } from 'react'
import { Repository, Label } from '../../utils/types'
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Link, Card, CardContent, Button, Typography, CircularProgress } from "@material-ui/core"
import StarIcon from "@material-ui/icons/Star"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import CallSplitIcon from "@material-ui/icons/CallSplit"
import Labels from "./Labels"
import { getOptions } from "../../utils/apiUtils"

export type RepositoryCardProp = Repository

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
			fontSize: "0.85rem",
			"& svg": {
				marginTop: "-1px",
				fontSize: "1.2rem",
			},
		},
		viewLabelButton: ({viewLabels}: {viewLabels: boolean}) => {
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
);

const RepositoryCard: React.FC<RepositoryCardProp> = ({
	fullName,
	htmlUrl,
	forks,
	openIssues,
	stargazersCount,
}) => {
	const [viewLabels, toggleViewLabels] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false)
	const [data, setData] = useState<Repository>({
		fullName,
		htmlUrl,
		forks,
		openIssues,
		stargazersCount,
		labels: [],
	});
	
	const classes = useStyles({ viewLabels });

	const toggleAndFetchLabels = async () => {
		if (!viewLabels && (data.labels === undefined || data.labels.length === 0)) {
			setLoading(true)
			let pageNumber: number = 1
			let allLabels: Label[] = []
			let response: Label[] = [];
			do {
				response = []
				await fetch(
					`https://api.github.com/repos/${fullName}/labels?page=${pageNumber}`,
					getOptions()
				)
					.then((res) => res.json())
					.then((res) => {
						response = res
						allLabels = [...allLabels, ...response]
					});

				pageNumber++
			} while (response.length !== 0);

			setData((prev) => ({ ...prev, labels: [...allLabels] }));
			setLoading(false)
		}

		toggleViewLabels(!viewLabels);
	}

	const handleSubscribe = (labels: Label[]) => {
		console.log("You are subscribing to: " + labels.length + " labels")
	}

	return (
		<Card className={classes.root} elevation={9}>
			<CardContent className={classes.cardContent}>
				<div className={classes.summary}>
					<div className="div1">
						<Typography variant="h5" component="h2">
							<Link href={data.htmlUrl} target="_blank" rel="noopener">
								{data.fullName}
							</Link>
						</Typography>
						<Typography
							className={classes.repositorySummary}
							color="textPrimary"
						>
							<CallSplitIcon /> {data.forks}
							<ErrorOutlineIcon style={{marginLeft: "6px"}} /> {data.openIssues}
							<StarIcon style={{marginLeft: "6px"}} /> {data.stargazersCount}
						</Typography>
					</div>

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
				</div>
				{loading && <CircularProgress style={{ margin: "0 50%" }} />}
				{viewLabels && data.labels && (
					<Labels labels={data.labels} subscribe={handleSubscribe} />
				)}
			</CardContent>
		</Card>
	);
}

export default RepositoryCard