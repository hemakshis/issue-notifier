import { ACCESS_TOKEN } from "../utils/constants"

const GITHUB_API_URL = "https://api.github.com"

export const fetchRepositoriesFromGithub = (searchKey: string): Promise<any> => {
	return fetch(
		`${GITHUB_API_URL}/search/repositories?q=${searchKey}`,
		getOptions()
	)
		.then((res) => res.json())
}

export const fetchLabelsFromGithub = (repoName: string, pageNumber: number): Promise<any> => {
	return fetch(`${GITHUB_API_URL}/repos/${repoName}/labels?per_page=100&page=${pageNumber}`, getOptions())
			.then((res) => res.json())
}

const getOptions = (method = "GET", body = {}) => {
	const accessToken: string = localStorage.getItem(ACCESS_TOKEN) || ""
	const options: any = {
		headers: {
			Accept: "application/vnd.github.v3+json",
		},
	}

	if (accessToken) options.headers["Authorization"] = "token " + accessToken

	if (method === "POST" || method === "PUT") {
		options["method"] = method
		options["body"] = JSON.stringify(body)
	}

	return options
}
