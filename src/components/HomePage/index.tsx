import React, { useState } from "react"
import SearchBar from "./SearchBar"
import { Container } from "@material-ui/core"
import RepositoryCard from "../RepositoryCard"
import { Repository } from "../../utils/types"
import { fetchRepositoriesFromGithub } from "../../utils/githubApis"

const HomePage: React.FC<any> = props => {

	const [repositories, setRepositories] = useState<Repository[]>([])

	const handleFetchRepositories = (searchKey: string) => {
		fetchRepositoriesFromGithub(searchKey)
			.then((res) => {
				setRepositories(res.items.map((i: any) => ({
					fullName: i.full_name,
					htmlUrl: i.html_url,
					forks: i.forks,
					openIssues: i.open_issues,
					stargazersCount: i.stargazers_count,
				})))
			})
	}

	const handleClearRepositories = () => {
		setRepositories([])
	}

	const renderRepositoryCards = () =>
		repositories.map((r) => (
			<RepositoryCard
				key={r.fullName}
				{...r}
				inSettingsPage={false}
			/>
		))

	return (
		<Container maxWidth="md" style={{ marginTop: "48px" }}>
			<SearchBar
				fetchRepositories={(searchKey) => handleFetchRepositories(searchKey)}
				clearRepositories={handleClearRepositories}
			/>
			{repositories.length > 0 && renderRepositoryCards()}
		</Container>
	)
}

export default HomePage
