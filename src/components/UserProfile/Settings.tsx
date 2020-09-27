import React, { useEffect, useState } from "react"
import RepositoryCard from "../RepositoryCard"
import { Label } from "../../utils/types"
import { Container, Typography } from "@material-ui/core"

export type SubscribedRepository = {
	repoName: string;
	htmlUrl: string;
	labels: Label[]
} 

const Settings: React.FC<any> = (props) => {

	const [subscribedRepositories, setSubscribedRepositories] = useState<SubscribedRepository[]>([])

	useEffect(() => {

		fetch("/api/v1/user/subscription/view")
			.then(res => res.json())
			.then(res => {
				const repositories = res.map((r: any) => ({
					...r,
					labels : r.labels.map((l: string) => {
						const [name, color] = l.split("_COLOR:")
						return {
							name, color,
							subscribed: false,
							selected: false
						}
					})
				}))

				setSubscribedRepositories(repositories)
			})		

	}, [])

	const renderRepositoryCards = () =>
		subscribedRepositories.map((r) => (
			<RepositoryCard
				key={r.repoName}
				{...r}
				fullName={r.repoName}
				removeRepository={handleRemoveRepository}
				inSettingsPage={true}
			/>
		));

	const handleRemoveRepository = (repoName: string) => {
		const newSubscribedRepositories = subscribedRepositories.filter(r => r.repoName !== repoName)
		setSubscribedRepositories(newSubscribedRepositories)
	}

	return (
		<Container maxWidth="md" style={{ marginTop: "48px" }}>
			{subscribedRepositories.length !== 0 && 
				<Typography variant="h3" align="left">
					Manage Subscriptions
				</Typography>
			}
			{subscribedRepositories.length === 0 && 
				<Typography variant="h4" align="center" color="textSecondary">
					You have not subscribed to any repositories or labels!
				</Typography>
			}
			{subscribedRepositories.length > 0 && renderRepositoryCards()}
		</Container>
	)
}

export default Settings