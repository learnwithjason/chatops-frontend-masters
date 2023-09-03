import type { Handler } from "@netlify/functions";

import { parse } from "querystring";
import {
  blocks,
  slackApi,
  verifySlackRequest,
  createModal,
} from "./util/slack";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
  // TODO handle slash commands
  switch (payload.command) {
    case "/foodfight":
      // const joke = fetch("https://icanhazdadjoke.com/", {
      //   headers: {
      //     accept: "text/plain",
      //   },
      // }).then((res) => res.text());

      // const response = await slackApi("chat.postMessage", {
      //   channel: payload.channel_id,
      //   text: await joke,
      // });
      const response = await slackApi(
        "views.open",
        createModal({
          id: "foodfight-modal",
          title: "Start Food Fight",
          submit_text: "Start",
          trigger_id: payload.trigger_id,
          blocks: [
            blocks.section({
              text: "Send your spiciest food intakes so we can all argue whether it's good or not.",
            }),
            blocks.input({
              id: "opinion",
              label: "Deposit your opinion",
              placeholder: "Example: is this the best place to take it?",
              initial_value: payload.text ?? "",
              hint: "This is the drama that will be shared with everyone.",
            }),
            blocks.select({
              id: "spice_level",
              label: "How spicy is your opinion?",
              placeholder: "Select spicies level",
              options: [
                { label: "Mild", value: "mild" },
                { label: "Medium", value: "medium" },
                { label: "Hot", value: "hot" },
                { label: "Fire", value: "fire" },
              ],
            }),
          ],
        })
      );

      if (!response.ok) {
        console.error(response);
      }
      break;
    default:
      return {
        statusCode: 200,
        body: `Slash command not found, ${payload.command}}`,
      };
  }

  return {
    statusCode: 200,
    body: "",
  };
}

async function handleInteractivity(payload: SlackModalPayload) {
  const callback_id = payload.callback_id ?? payload.view.callback_id;
  switch (callback_id) {
    case "foodfight-modal":
      const data = payload.view.state.values;
      const fields = {
        opinion: data.opinion_block.opinion.value,
        spiceLevel: data.spice_level_block.spice_level.selected_option.value,
        submitter: payload.user.name,
      };

      await slackApi("chat.postMessage", {
        channel: "C05R34QUR17",
        text: `:fire: ${fields.opinion} :fire: \n\n <@${payload.user.id}>, just started a food fight! \n\n *Spice Level:* ${fields.spiceLevel} \n\n *Submitter:* ${fields.submitter}`,
      });

      break;
    case "start-food-fight-message":
      const channel = payload.channel?.id;
      const user = payload.user.id;
      const thread_ts = payload.message.thread_ts ?? payload.message.ts;

      await slackApi("chat.postMessage", {
        channel,
        text: `Hey :fire: <@${user}> :fire: \n\n , just started a food fight!`,
        thread_ts,
      });

      break;
    default:
      console.log("Unknown callback_id", callback_id);
      return {
        statusCode: 400,
        body: `Unknown callback_id, ${callback_id}}`,
      };
  }

  return {
    statusCode: 200,
    body: "",
  };
}

export const handler: Handler = async (event) => {
  const valid = verifySlackRequest(event);

  if (!valid) {
    console.error("Invalid Slack request");
    return {
      statusCode: 400,
      body: "Invalid Slack request",
    };
  }

  // TODO validate the Slack request
  const body = parse(event.body ?? "") as SlackPayload;
  if (body.command) {
    return handleSlashCommand(body as SlackSlashCommandPayload);
  }
  // TODO handle slash commands

  // TODO handle interactivity (e.g. context commands, modals)
  if (body.payload) {
    const payload = JSON.parse(body.payload);
    return handleInteractivity(payload);
  }

  return {
    statusCode: 200,
    body: "TODO: handle Slack commands and interactivity anytime you want!",
  };
};
