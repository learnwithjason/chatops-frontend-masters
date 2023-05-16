export function slackApi(
	endpoint: SlackApiEndpoint,
	body: SlackApiRequestBody,
) {
	return fetch(`https://slack.com/api/${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(body),
	}).then((res) => res.json());
}
