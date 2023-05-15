import type { HandlerEvent } from '@netlify/functions';

import { createHmac } from 'crypto';

export function slackApi(
	endpoint: SlackApiEndpoint,
	body: SlackApiRequestBody,
) {
	const options: RequestInit = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8',
		},
	};

	if (body !== undefined) {
		options.method = 'POST';
		options.body = JSON.stringify(body);
	}

	return fetch(`https://slack.com/api/${endpoint}`, options).then((res) =>
		res.json(),
	);
}

export function verifySlackRequest(request: HandlerEvent) {
	const signing_secret = process.env.SLACK_SIGNING_SECRET!;
	const slack_signature = request.headers['x-slack-signature'];
	const timestamp = Number(request.headers['x-slack-request-timestamp']);
	const now = Math.floor(Date.now() / 1000); // match Slack timestamp precision

	// if the timestamp is more than five minutes off assume something’s funky
	if (Math.abs(now - timestamp) > 300) {
		return false;
	}

	const sig_basestring = `v0:${timestamp}:${request.body}`;
	const signature =
		'v0=' +
		createHmac('sha256', signing_secret).update(sig_basestring).digest('hex');

	const valid = signature === slack_signature;

	return valid;
}

export function modal({
	trigger_id,
	id,
	title,
	submit_text = 'Submit',
	blocks,
}) {
	return {
		trigger_id,
		view: {
			type: 'modal',
			callback_id: id,
			title: {
				type: 'plain_text',
				text: title,
			},
			submit: {
				type: 'plain_text',
				text: submit_text,
			},
			blocks,
		},
	};
}

export const blocks = {
	section: ({ text }: SectionBlockArgs) => {
		return {
			type: 'section',
			text: {
				type: 'mrkdwn',
				text,
			},
		};
	},
	input({
		id,
		label,
		placeholder,
		initial_value = '',
		hint = '',
	}: InputBlockArgs) {
		return {
			block_id: `${id}_block`,
			type: 'input',
			label: {
				type: 'plain_text',
				text: label,
			},
			element: {
				action_id: id,
				type: 'plain_text_input',
				placeholder: {
					type: 'plain_text',
					text: placeholder,
				},
				initial_value,
			},
			hint: {
				type: 'plain_text',
				text: hint,
			},
		};
	},
	select({ id, label, placeholder, options }: SelectBlockArgs) {
		return {
			block_id: `${id}_block`,
			type: 'input',
			label: {
				type: 'plain_text',
				text: label,
				emoji: true,
			},
			element: {
				action_id: id,
				type: 'static_select',
				placeholder: {
					type: 'plain_text',
					text: placeholder,
					emoji: true,
				},
				options: options.map(({ label, value }) => {
					return {
						text: {
							type: 'plain_text',
							text: label,
							emoji: true,
						},
						value,
					};
				}),
			},
		};
	},
};
