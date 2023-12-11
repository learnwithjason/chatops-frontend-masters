import {type Handler, schedule} from "@netlify/functions";
import {getNewItems} from "./util/notion";
import {blocks, slackApi} from "./util/slack";

const postNewNotionItemsToSlack: Handler = async () => {
    const items = await getNewItems();

    await slackApi('chat.postMessage', {
        channel: 'C0694QTCABZ',
        blocks: [
            blocks.section({
                text: [
                    'Here are the opinions awaiting judgement:',
                    '',
                    ...items.map(item => `- ${item.opinion} (spice level: ${item.spiceLevel}`),
                    '',
                    `See all items: <https://notion.com/${process.env.NOTION_DB_ID}|in Notion>`
                ].join('\n')
            })
        ]
    })
    return {
        statusCode: 200
    }
}

export const handler = schedule('0 9 * * 1', postNewNotionItemsToSlack);
