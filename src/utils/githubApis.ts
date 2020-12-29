import { ACCESS_TOKEN } from "../utils/constants"

export const getOptions = (method = "GET", body = {}) => {
	const accessToken: string = localStorage.getItem(ACCESS_TOKEN) || ""
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

export const parseLinkHeader = (linkHeader: string | null) => {
	if (linkHeader === null || linkHeader.length === 0) {
	  throw new Error("input must not be of zero length");
	}
  
	// Split parts by comma
	let parts = linkHeader.split(',');
	let links: any;
	// Parse each part into a named link
	parts.forEach(p => {
		const section = p.split(';');
		if (section.length !== 2) {
			throw new Error("section could not be split on ';'");
		}
		const url = section[0].replace(/<(.*)>/, '$1').trim();
		const name = section[1].replace(/rel="(.*)"/, '$1').trim();
		links[name] = url;
	});
  
	return links;
  }