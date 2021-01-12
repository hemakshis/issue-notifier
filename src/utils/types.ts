export type Label = {
	name: string;
	color: string;
	selected: boolean;
	subscribed: boolean;
}

export type Repository = {
	fullName: string;
	htmlUrl: string;
	forks: number;
	openIssues: number;
	stargazersCount: number;
	labels: Label[]
}
