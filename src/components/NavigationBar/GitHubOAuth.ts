import { Config } from "../../config";

class GitHubOAuth {
	private id: any;
	popupPromise: any;
	popupWindow: any;
	popupTimer: any;

	constructor(id: any) {
		this.id = id
	}

	checkPopup() {
		this.popupPromise = new Promise((resolve, reject) => {
			this.popupTimer = window.setInterval(() => {
				try {
					const popupWindow = this.popupWindow

					if (!popupWindow || popupWindow.closed || popupWindow.closed === undefined) {
						this.closePopup()
						reject("Popup was closed")

						return
					}

					if (popupWindow.location.pathname === "blank")
						return

					const code = popupWindow.location.href.match(/\\?code=(.*)/) &&
						popupWindow.location.href.match(/\\?code=(.*)/)[1]

					resolve({ code, success: true })

					this.closePopup()
				} catch (err) {
					console.log("Error: ", err)
				}
			}, 500)
		})
	}

	openPopup() {
		const width = 600,
			height = 600
		const left = window.innerWidth / 2 - width / 2
		const top = window.innerHeight / 2 - height / 2

		const callbackUrl = Config.ISSUE_NOTIFIER_API_ENDPOINT
		const clientId = Config.CLIENT_ID
		const url =
			`https://github.com/login/oauth/authorize?scope=read:user,user:email&client_id=${clientId}&redirect_uri=${callbackUrl}`

		this.popupWindow = window.open(
			url,
			"",
			`toolbar=no, location=no, directories=no, status=no, menubar=no, 
			scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
			height=${height}, top=${top}, left=${left}`
		)
	}

	closePopup() {
		this.cancelGitHubOAuth()
		this.popupWindow.close()
	}

	cancelGitHubOAuth() {
		if (this.popupTimer) {
			window.clearInterval(this.popupTimer)
			this.popupTimer = null
		}
	}

	then(...args: any[]) {
		return this.popupPromise.then(...args)
	}

	catch(...args: any[]) {
		return this.popupPromise.then(...args)
	}

	static startGitHubOAuth(id: string) {
		const popup = new this(id)

		popup.openPopup()
		popup.checkPopup()

		return popup
	}
}

export default GitHubOAuth