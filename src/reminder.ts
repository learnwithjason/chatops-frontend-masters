import { type Handler, schedule } from "@netlify/functions";
import { getNewItems } from "./util/notion";
import { blocks,slackApi } from "./util/slack";


const postnewNotionItemsToSlack: Handler = async() => {
    const items = await getNewItems();
    await slackApi('chat.postMessage',{

        channel: 'C05S3VAQT7B',
        blocks:[
            blocks.section({
                text:[
                    'Here are the pending tasks:',
                    '',
                    ...items.map(
                        (item) => `- ${item.tasks} (priority level : ${item.priority})`,
                    ),
                    '',
                    `See all tasks: <https://notion.com/${process.env.NOTION_DATABASE_ID}|in Notion>`
                ].join('\n')
            })
        ]
    })

    return{
        statusCode:200,
    }

};

export const handler = schedule('* 12 * * 1', postnewNotionItemsToSlack)