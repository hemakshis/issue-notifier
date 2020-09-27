import React, { useState } from "react"
import SearchBar from "./SearchBar"
import { Container } from "@material-ui/core"
import RepositoryCard from "../RepositoryCard"
import { Repository } from "../../utils/types"
import { getOptions } from "../../utils/githubApis"

const HomePage: React.FC<any> = props => {

	const [repositories, setRepositories] = useState<Repository[]>([]);

	const fetchRepositories = (searchKey: string) => {
		fetch(
			`https://api.github.com/search/repositories?q=${searchKey}`,
			getOptions()
		)
			.then((res) => res.json())
			.then((res) => {
				let r: Repository[] = res.items.map((i: any) => ({
					fullName: i.full_name,
					htmlUrl: i.html_url,
					forks: i.forks,
					openIssues: i.open_issues,
					stargazersCount: i.stargazers_count,
				}));

				setRepositories([...r])
			})
	};

	const clearRepositories = () => {
		setRepositories([]);
	}

	const renderRepositoryCards = () =>
		repositories.map((r) => (
			<RepositoryCard
				key={r.fullName}
				{...r}
				inSettingsPage={false}
			/>
		));

	return (
		<Container maxWidth="md" style={{ marginTop: "48px" }}>
			<SearchBar
				fetchRepositories={(searchKey) => fetchRepositories(searchKey)}
				clearRepositories={clearRepositories}
			/>
			{repositories.length > 0 && renderRepositoryCards()}
		</Container>
	);
}

export default HomePage
