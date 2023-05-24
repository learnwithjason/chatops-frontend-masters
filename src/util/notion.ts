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

export async function getNewItems(): Promise<NewItem[]> {
	const notionData = await notionApi(
		`/databases/${process.env.NOTION_DATABASE_ID}/query`,
		{
			filter: {
				property: 'Status',
				status: {
					equals: 'new',
				},
			},
			page_size: 100,
		},
	);

	const openItems = notionData.results.map((item: NotionItem) => {
		return {
			opinion: item.properties.opinion.title[0].text.content,
			spiceLevel: item.properties.spiceLevel.select.name,
			status: item.properties.Status.status.name,
		};
	});

	return openItems;
}
