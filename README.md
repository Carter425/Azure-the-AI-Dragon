Attribution statement

  This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of 
  the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The 
  SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at
  https://creativecommons.org/licenses/by/4.0/legalcode.

# Azure the AI Dragon: Custom copilot connected to your data with Teams AI Library and Azure OpenAI

Azure the AI Dragon showcases how to build a custom copilot that takes your Teams users to another world weaving in your chosen data-sources into a cohesive story with instant analysis. Follow along to learn how to create your custom copilot powered by Azure OpenAI models and integrated into Teams with the Teams AI Library. We'll walkthrough building a local vector database connected to your model, implementing responsible AI content moderation, integrating your adaptive cards into your copilot, and more. Code snippets and a video are included to make this easy for you. Let's build it!

To learn more about the Teams AI library and build Azure the AI Dragon, watch **[Build a custom copilot with your data]()** video in the 5 Minute Copilot series on YouTube.

## Get started with Azure the AI Dragon

### Prerequisites

To get started, ensure that you have the following tools:

| Install                                                                                                                                                | For using...                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Visual Studio](https://visualstudio.microsoft.com/downloads/) (17.7.0 or greater)                                                                     | C# build environments. Use the latest version.                                                                                                                                                                                                                      |
| [Teams Toolkit](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/toolkit-v4/teams-toolkit-fundamentals-vs?pivots=visual-studio-v17-7) | Microsoft Visual Studio extension that creates a project scaffolding for your app. Use the latest version.                                                                                                                                                          |
| [Git](https://git-scm.com/downloads)                                                                                                                   | Git is a version control system that helps you manage different versions of code within a repository.                                                                                                                                                               |
| [Microsoft Teams](https://www.microsoft.com/microsoft-teams/download-app)                                                                              | Microsoft Teams to collaborate with everyone you work with through apps for chat, meetings, and call-all in one place.                                                                                                                                              |
| [Microsoft&nbsp;Edge](https://www.microsoft.com/edge) (recommended) or [Google Chrome](https://www.google.com/chrome/)                                 | A browser with developer tools.                                                                                                                                                                                                                                     |
| [Microsoft 365 developer account](/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant)                                           | Access to Teams account with the appropriate permissions to install an app and [enable custom Teams apps and turn on custom app uploading](../../../concepts/build-and-test/prepare-your-o365-tenant.md#enable-custom-teams-apps-and-turn-on-custom-app-uploading). |

<br/>

## Setting up the sample

1. Clone the repository

    ```bash
    git clone https://github.com/Microsoft/teams-ai.git
    ```

2. In the root JavaScript folder, install and build all dependencies

    ```bash
    cd teams-ai/js
    yarn install
    yarn build
    ```

3. In a terminal, navigate to the sample root.

    ```bash
    cd teams-ai/js/samples/04.ai.a.teamsChefBot/
    ```
    
4. Rename the `sample.env` in the `teams-ai/js/samples/04.ai.a.teamsChefBot` folder to `.env`.

5. *Go to Azure OpenAI and deploy `gpt-35-turbo-16k` or the conversational model of your choice and name it as **gpt-35-turbo**. Next, Deploy 'text-embedding-ada-002' as your embedding model while naming it **embedding**.

6. In the newly named '.env' file, fill in your `AZURE_OPENAI_KEY` and `AZURE_OPENAI_ENDPOINT` variables appropriately.

9. Update `config.json` and `index.ts` with your model deployment names

10. 



>
> - [Node.js](https://nodejs.org/), supported versions: 16, 18
> - A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)
> - [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teamsfx-cli)
> - [An Azure OpenAI Service resource](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model).
> *On Azure OpenAI deploy `gpt-35-turbo-16k` as your conversational model and name it as **gpt-35-turbo**. Deploy 'text-embedding-ada-002'as your embedding model while naming it **embedding**.*


1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
1. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
1. download the 
1. Rename the sample.env file as .env
1. Fillfill in your Azure OpenAI key `SECRET_OPENAI_API_KEY=<your-key>`.
1. In file *env/.env.local*, fill in your Azure OpenAI endpoint `AZURE_OPENAI_ENDPOINT=<your-endpoint>`.
1. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug (Edge)` or `Debug (Chrome)`.
1. When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.
1. You will receive a welcome message from the bot, or send any message to get a response.

**Congratulations**! You are running Clippy bot that can now interact with users in Teams.
