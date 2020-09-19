export const getOptions = (method = "GET", body = {}) => {
	const accessToken: string = localStorage.getItem("accessToken") || ""
	const options: any = {
		headers: {
			Accept: "application/vnd.github.v3+json",
		},
	}

	if (accessToken) options.headers["Authorization"] = "token " + accessToken

	if (method === "POST" || method === "PUT") {
		options["method"] = method;
		options["body"] = JSON.stringify(body)
	}

	return options
}