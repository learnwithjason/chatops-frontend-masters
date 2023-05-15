import type { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
	// TODO validate the Slack request

	// TODO handle slash commands

	// TODO handle interactivity (e.g. context commands, modals)

	return {
		statusCode: 200,
		body: 'TODO: handle Slack commands and interactivity',
	};
};
