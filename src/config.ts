const envSettings = window as any;

export class Config {
	static ISSUE_NOTIFIER_API_ENDPOINT = envSettings.ISSUE_NOTIFIER_API_ENDPOINT;
	static CLIENT_ID = envSettings.CLIENT_ID
}