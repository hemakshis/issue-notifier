import { Label } from "../components/RepositoryCard/Labels"

export type Repository = {
	fullName: string;
	htmlUrl: string;
	forks: number;
	openIssues: number;
	stargazersCount: number;
	labels: Label[]
};
