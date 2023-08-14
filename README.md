[![Frontend Masters](https://static.frontendmasters.com/assets/brand/logos/full.png)](https://frontendmasters.com)

This is a companion repo for the [Building a Slack Chat Bot with Jason Lengstorf](https://frontendmasters.com/courses/chat-apis/) course on [Frontend Masters](https://frontendmasters.com).

The `main` branch contains the final application. Use the `start` branch when following the course.

## Setup Instructions

> Note: Node version 18 is required for this course

### Netlify

Netlify is used as a live tunnel for testing the application. If you don't already have an account, create one before beginning the course:

1. Visit https://www.netlify.com
2. Click **Sign Up** to create a new account.

The Netlify CLI is also required for the course. These installation steps are covered in the **Creating a Netlify Tunnel** lesson:

1. Install the Netlify CLI: `npm i -g netlify-cli`
2. Login to your Netlify account: `ntl login`
3. Initialize the project: `ntl init`
4. Start the dev server: `ntl dev --live`

### Slack

A free Slack account and workspace is required for this course. We recommend creating a new workspace for testing the application. If you don't have a Slack account or workspace:

1. Visit https://slack.com
2. Create a new account or sign in
3. Click **Create a New Workspace** and follow the instructions

Creating a new Slack application is demonstrated in the **Slack App Setup** lesson.

1. Visit https://api.slack.com
2. Click **Create new App** and choose to create it from scratch
3. Name the application Food Fight and choose to deploy it to your test workspace

**Long description for the application (provided here to copy/paste)**

Is your workday going too smoothly? Everyone is being productive and that makes you suspicious? Why not derail the whole team by starting a heated argument about food?

- Is sous vide an acceptable way to cook a burger?
- Does mayonnaise go on french fries?
- Wnat to convince everyone that pineapple belongs on pizza?

Make your spiciest assertions and watch your team devolve into culinary fisticuffs. With Food Fight, remind your cowordkers that you are an agent of chaos!

### Notion

Notion is used to store data from the Slack application. You'll need to create a free Notion account:

1. Visit https://notion.com
2. Create a new account if you don't already have one.
3. [optional] Create a new workspace
4. Duplicate [the example database](https://frontendmasters-chatops.notion.site/7818ece038cc43129307fd41e91fd9c8)

A new integration is created during the **Integration with Notion** lesson:

1. Visit https://www.notion.so/my-integrations
2. Click the New Integration button
3. Select the workspace you want to use for the application
4. Add the basic information and an image from the `assets` directory.
5. Visit the Food Fight Database you duplicated into your workspace and add the Food Fight connection.
6. From the integrations section, copy the secret into a `NOTION_SECRET` environment variable
7. Copy the database ID into a `NOTION_DATABASE_ID` environment variable
