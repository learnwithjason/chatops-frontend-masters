const DATABASE_ID = '7818ece038cc43129307fd41e91fd9c8';

export async function notionApi(endpoint: string, body: {}) {
	const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			authorization: `Bearer ${process.env.NOTION_SECRET}`,
			'Notion-Version': '2022-06-28',
			'content-type': 'application/json',
		},
		body: JSON.stringify(body),
	}).catch((err) => console.error(err));

	if (!res || !res.ok) {
		console.error(res);
	}

	const data = await res?.json();

	return data;
}

export async function getNewItems() {
	const notionData = await notionApi(`/databases/${DATABASE_ID}/query`, {
		filter: {
			property: 'Status',
			status: {
				equals: 'new',
			},
		},
		page_size: 100,
	});

	const openItems = notionData.results.map((item) => {
		return {
			opinion: item.properties.opinion.title[0].text.content,
			spiceLevel: item.properties.spiceLevel.select.name,
			status: item.properties.Status.status.name,
		};
	});

	return openItems;
}

export async function saveItem({ opinion, spiceLevel, submitter }) {
	const res = await notionApi('/pages', {
		parent: {
			database_id: DATABASE_ID,
		},
		properties: {
			opinion: {
				title: [{ text: { content: opinion } }],
			},
			spiceLevel: {
				select: {
					name: spiceLevel,
				},
			},
			submitter: {
				rich_text: [{ text: { content: `@${submitter} on Slack` } }],
			},
		},
	});

	console.log(res);
}
