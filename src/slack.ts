import type { Handler } from '@netlify/functions';

import {parse} from 'querystring';
import {blocks, modal, slackApi, verifySlackRequest } from './util/slack';
import { saveItems } from './util/notion';

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
	switch (payload.command) {
		case'/slackbotty' :
		const response = await slackApi('views.open',
			modal({
				id: 'foodfight-modal',
				title: 'Lets create a task list',
				trigger_id: payload.trigger_id,
				blocks: [
					blocks.section({
						text: 'Enter your task and its priority that you want to set. Tasks will be updated accordingly to your Notion'
					}),
					blocks.input({
						id: 'tasks',
						label: 'Create a task',
						placeholder: 'Deliver the project by 6 PM',
						initial_value: payload.text ?? '',
						hint: 'Make it precise and understandable'
					}),
					blocks.select({
						id: 'priority',
						label: 'Priority',
						placeholder: 'How urgent is it ?',
						options: [
							{label: 'Can be done anytime', value: 'low'},
							{label: 'Just keep in mind', value: 'normal'},
							{label: 'Not urgent but do it ASAP', value: 'medium'},
							{label: 'Urgent', value: 'high'},
							{label: 'Should have been done till now', value: 'Emergency'},
						],
					}),

				],

			}),
		);

		  if(! response.ok) {
			console.log(response);
		  }
		  break;

		  default: 
		    return {
				statusCode: 200,
				body: `Command ${payload.command} is not recognized`,
			}

	}
	return {
		statusCode: 200,
		body: '',
	}
}

async function handleInteractivity(payload: SlackModalPayload) {
	const callback_id = payload.callback_id ?? payload.view.callback_id;

	switch(callback_id) {
		case 'foodfight-modal':
		const data = payload.view.state.values;
		const fields = {
			tasks: data.tasks_block.tasks.value,
			priority: data.priority_block.priority.selected_option.value,
			submitter: payload.user.name
		};

		await saveItems(fields);

		await slackApi('chat.postMessage',{
			channel: 'C05S3VAQT7B',
			text: `ok Got it, <@${payload.user.id}> We have a new Task for you : ${fields.tasks}at a priority of ${fields.priority} \n\n Lets get it done`
		});
		break;

		case 'create-a-task':
			const channel = payload.channel?.id;
			const user_id = payload.user.id;
			const thread_ts = payload.message.thread_ts ?? payload.message.ts;

			await slackApi('chat.postMessage',{
				channel,
				thread_ts,
				text: `Hey <@${user_id}>, you can take a note of all of your Tasks. Run the \'/slackbotty\' slash command in a main channel to start! `
			})
			break;

		default: 
		console.log(`No handler defined for ${callback_id}`);
		return {
			statusCode: 400,
			body: `No handler defined for ${callback_id}`,
		}

	}
	return {
		statusCode: 200,
		body:'',
	}
	
}

export const handler : Handler = async (event) => {
	const valid = verifySlackRequest(event);

	if(!valid){
		console.error('invalid request');

		return {
			statusCode: 400,
			body: 'invalid request'
		}
	}

	const body = parse(event.body ?? '') as SlackPayload;
	if(body.command) {
		return handleSlashCommand(body as SlackSlashCommandPayload);
	}

	 if(body.payload){
		const payload = JSON.parse(body.payload);
		return handleInteractivity(payload);
	 }

	return {
		statusCode: 200,
		body: 'TODO: handle Slack commands and interactivity',
	};
};
