import type { HandlerEvent } from '@netlify/functions';

import { createHmac } from 'crypto';

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

export function verifySlackRequest(request: HandlerEvent) {
	const secret = process.env.SLACK_SIGNING_SECRET!;
	const signature = request.headers['x-slack-signature'];
	const timestamp = Number(request.headers['x-slack-request-timestamp']);
	const now = Math.floor(Date.now() / 1000); // match Slack timestamp precision

	// if the timestamp is more than five minutes off assume something’s funky
	if (Math.abs(now - timestamp) > 300) {
		return false;
	}

	// make a hash of the request using the same approach Slack used
	const hash = createHmac('sha256', secret)
		.update(`v0:${timestamp}:${request.body}`)
		.digest('hex');

	// we know the request is valid if our hash matches Slack’s
	return `v0=${hash}` === signature;
}
