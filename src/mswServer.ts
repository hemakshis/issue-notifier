import { rest } from "msw"
import { setupServer } from "msw/node"

// https://github.com/login/oauth/authorize?scope=read:user,user:email&client_id=69c3fc731ccb2d116412&redirect_uri=http://localhost:3000
// /api/v1/user/authenticated
// /api/v1/login/github/oauth2?code=${code}
// /api/v1/user/logout

// "/api/v1/user/subscription/view"
// `/api/v1/user/subscription/${fullName}/labels`
// `/api/v1/user/subscription/${action}`
// "/api/v1/user/subscription/remove"

// ${GITHUB_API_URL}/search/repositories?q=${searchKey}
// ${GITHUB_API_URL}/repos/${repoName}/labels?per_page=100&page=${pageNumber}

const mockBackEndAPI = [
	rest.get("/api/v1/user/authenticated", (req, res, ctx) => res(
		ctx.status(200),
		ctx.json({
			name: "Issue Notifier",
			username: "iss_notif",
			email: "issues@gmail.com",
			avatarImg: "http://issue.com/my_cute_pic",
			accessToken: "myaccesstokenyoudummy",
		})
	)),

	rest.get("/api/v1/login/github/oauth2", (req, res, ctx) => res(
		ctx.status(200),
		ctx.cookie("cookie-name", "myauthcookievalue"),
		ctx.json({
			name: "Issue Notifier",
			username: "iss_notif",
			email: "issues@gmail.com",
			avatarImg: "http://issue.com/my_cute_pic",
			accessToken: "myaccesstokenyoudummy",
		})
	))
]

const mockGithubAPI = [
	rest.get("/search/repositories", (req, res, ctx) => {
		res(
			ctx.status(200)
		)
	})
]

const mswServer = setupServer(...mockBackEndAPI, ...mockGithubAPI)

export default mswServer