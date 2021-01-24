import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { render, screen, act } from "@testing-library/react"
import { rest } from "msw"
import mswServer from "./mswServer"
import App from "./App"

const app = (
	<Router>
		<App />
	</Router>
)

describe('<App />', () => {
	beforeAll(() =>	mswServer.listen())

	afterEach(() => mswServer.resetHandlers())

	afterAll(() => mswServer.close())

	it('renders correct component', () => {
		const { getByText, getByPlaceholderText } = render(app)

		expect(getByText("GitHub Issue Notifier")).toBeInTheDocument();
		expect(getByPlaceholderText("Search for repositories")).toBeInTheDocument();
	})

	it("fetches authenticated user details from back-end", async () => {
		await act(async () => {
			render(app)
		})

		expect(screen.findByText("Hello, iss_notif"))
	})

	it("shows `Login with GitHub` button when user not authenticated", async () => {
		mswServer.use(
			rest.get("/api/v1/user/authenticated", (req, res, ctx) => res(
				ctx.status(401),
				ctx.text("Unauthorized")
			))
		)

		await act(async () => {
			render(app)
		})

		expect(screen.findByText("Login with GitHub"))
	})
})