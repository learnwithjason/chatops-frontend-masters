import type { HandlerEvent } from "@netlify/functions";
import { createHmac } from "crypto";

// TODO create Slack utilities
export function slackApi(
  endpoint: SlackApiEndpoint,
  body: SlackApiRequestBody
) {
  return fetch(`https://slack.com/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

export function verifySlackRequest(request: HandlerEvent) {
  const secret = process.env.SLACK_SIGNING_SECRET ?? "";
  const signature = request.headers["x-slack-signature"];
  const timestamp = Number(request.headers["x-slack-request-timestamp"]);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > 60 * 5) {
    return false;
  }

  const hmac = createHmac("sha256", secret)
    .update(`v0:${timestamp}:${request.body}`)
    .digest("hex");

  return `v0=${hmac}` === signature;
}

export const blocks = {
  section: ({ text }: SectionBlockArgs): SlackBlockSection => {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text,
      },
    };
  },
  input: ({
    id,
    label,
    placeholder,
    initial_value = "",
    hint = "",
  }: InputBlockArgs): SlackBlockInput => {
    return {
      type: "input",
      block_id: `${id}_block`,
      label: {
        type: "plain_text",
        text: label,
      },
      element: {
        type: "plain_text_input",
        action_id: id,
        placeholder: {
          type: "plain_text",
          text: placeholder,
        },
        initial_value,
      },
      hint: {
        type: "plain_text",
        text: hint,
      },
    };
  },
  select: ({
    id,
    label,
    placeholder,
    options,
  }: SelectBlockArgs): SlackBlockInput => {
    return {
      block_id: `${id}_block`,
      type: "input",
      label: {
        type: "plain_text",
        text: label,
      },
      element: {
        action_id: id,
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: placeholder,
        },
        options: options.map(({ label, value }) => ({
          text: {
            type: "plain_text",
            text: label,
          },
          value,
        })),
      },
    };
  },
};

export function createModal({
  title,
  submit_text = "Submit",
  id,
  blocks,
  trigger_id,
}: ModalArgs) {
  return {
    trigger_id,
    view: {
      type: "modal",
      callback_id: id,
      title: {
        type: "plain_text",
        text: title,
      },
      submit: {
        type: "plain_text",
        text: submit_text,
      },
      blocks,
    },
  };
}
