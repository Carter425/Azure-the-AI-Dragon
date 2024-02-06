# Azure the AI Dragon Guide: Custom copilot connected to your data with Teams AI Library and Azure OpenAI

Azure the AI Dragon showcases how to build a custom copilot that takes your Teams users to another world weaving in your chosen data-sources into a cohesive story with instant analysis. Follow along to learn how to create your custom copilot powered by Azure OpenAI models and integrated into Teams with the Teams AI Library. We'll walkthrough building a local vector database connected to your model, implementing responsible AI content moderation, integrating your adaptive cards into your copilot, and more. Code snippets and a video are included to make this easy for you. Let's build it!

To learn more about the Teams AI library and build Azure the AI Dragon, watch **[Build a custom copilot with your data]()** video in the 5 Minute Copilot series on YouTube.

### Attribution statement

  This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of 
  the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The 
  SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at
  https://creativecommons.org/licenses/by/4.0/legalcode.
  
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

This is a learning exercise for creating your custom copilot using the Teams AI Library and Azure OpenAI. We are adapting the Teams Chefbot sample from the Teams AI Library by incorporating infromation from the other moderator and adaptive card samples to learn about multiple concepts. Additionally, we are updating the prompt and creating a local vector database. The README instructions are based off of starting with the chefbot sample to upgrade it to Azure the AI Dragon. The same concepts shown can be used to adapt Chefbot using your own data and use-case or for upgrading your existing app.

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

5. Go to Azure OpenAI Service in Azure and deploy `gpt-35-turbo-16k` or the chat based model of your choice and name it as **gpt-35-turbo**. Next, Deploy `text-embedding-ada-002` as your embedding model while naming it **embedding** and under advanced options when deploying you may maximize the Tokens per Minute Rate Limit to enable more data to be embedded in your local vector database.

6. In the renamed `.env` file, fill in your `AZURE_OPENAI_KEY` and `AZURE_OPENAI_ENDPOINT` variables appropriately. (Your Azure OpenAI key and endpoint may be found in Azure under Keys and Endpoint section under your Azure OpenAI resource.

7. Update `config.json` and `index.ts` with your chat model deployment name **gpt-35-turbo**. At this point you could press F5 to load Chefbot into Teams or continue to make Azure the AI Dragon.

## Adding Azure AI Content Safety Moderator (Optional)

1. Go to `src\index.ts` file and import the moderator classes by updating the  `import {...} from @microsoft/teams-ai` to match the code below:

 ```js
import {
    AI,
    Application,
    ActionPlanner,
    OpenAIModel,
    PromptManager,
    TurnState,
    TeamsAdapter,
    AzureContentSafetyModerator,
    ModerationSeverity,
    OpenAIModerator,
    Moderator
} from '@microsoft/teams-ai';
 ```

2. Add moderator to the application as shown to match the code below:

```js
// Define storage and application
const storage = new MemoryStorage();
const app = new Application<ApplicationTurnState>({
    storage,
    ai: {
        planner,
        moderator
    }
});
 ```

3. Create the moderator

```js
// Create appropriate moderator
let moderator: Moderator;
if (process.env.OPENAI_KEY) {
    moderator = new OpenAIModerator({
        apiKey: process.env.OPENAI_KEY!,
        moderate: 'both'
    });
} else 
    if (!process.env.AZURE_CONTENT_SAFETY_KEY || !process.env.AZURE_CONTENT_SAFETY_ENDPOINT) {
        throw new Error(
            'Missing environment variables - please check that both AZURE_CONTENT_SAFETY_KEY and AZURE_CONTENT_SAFETY_ENDPOINT are set.'
        );
    }
    moderator = new AzureContentSafetyModerator({
        apiKey: process.env.AZURE_CONTENT_SAFETY_KEY!,
        endpoint: process.env.AZURE_CONTENT_SAFETY_ENDPOINT!,
        apiVersion: '2023-04-30-preview',
        moderate: 'both',
        categories: [
            {
                category: 'Hate',
                severity: ModerationSeverity.High
            },
            {
                category: 'SelfHarm',
                severity: ModerationSeverity.High
            },
            {
                category: 'Sexual',
                severity: ModerationSeverity.High
            },
            {
                category: 'Violence',
                severity: ModerationSeverity.High
            }
        ]
        // breakByBlocklists: true,
        // blocklistNames: [] // Text blocklist Name. Only support following characters: 0-9 A-Z a-z - . _ ~. You could attach multiple lists name here.
    });
```

4. Replace the `AI.FlaggedInputActionName` with an updated message specificing why the input was flagged

```js
app.ai.action(AI.FlaggedInputActionName, async (context, state, data) => {
    let message = '';
    if (data?.categories?.hate) {
        message += `<strong>Hate speech</strong> detected.`;
    }
    if (data?.categories?.sexual) {
        message += `<strong>Sexual content</strong> detected`;
    }
    if (data?.categories?.selfHarm) {
        message += `<strong>Self harm</strong> detected.`;
    }
    if (data?.categories?.violence) {
        message += `<strong>Violence</strong> detected.`;
    }
    await context.sendActivity(
        `I'm sorry your message was flagged due to triggering Azure OpenAI’s content management policy. Reason: ${message}`
    );
    return AI.StopCommandName;
});
```
4. [Create your content safety resource in Azure](https://aka.ms/acs-create). Then, select the create button and fill out the details. Once created click on your content safety resource to find your content safety key and endpoint.
7. Go to the `.env` file and add in your moderator key and endpoint as new variables below your Azure OpenAI Key and Endpoint. Now, your Azure OpenAI moderator is ready to go.

```js
AZURE_CONTENT_SAFETY_KEY=
AZURE_CONTENT_SAFETY_ENDPOINT=
```

## Adding In your Adaptive Cards (Optional)

1. In the `src` folder, create the `cards` folder containing `index.ts` file and `staticCharacterCard.ts` files
2. In src\cards\index.ts add in the export

```js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Additional adaptive cards may be added here for export. 

export * from './staticCharacterCard';
```
3. In the `staticCharacterCard.ts` file add the code below. You could update this with your own adaptive card information as well. Creating an adaptive card can be expedited with the [Adaptive Card Designer](https://adaptivecards.io/designer/).

```js
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Attachment, CardFactory } from 'botbuilder';

/**
 * Create a static search card. This card has a static list of IDEs.
 * @returns {Attachment} Static search card.
 */
export function createCharacterCard(): Attachment {
    return CardFactory.adaptiveCard({        
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",
    body: [
        {
            type: "Container",
            items: [
                {
                    type: "TextBlock",
                    text: "AI Dragon Quest",
                    size: "Large",
                    weight: "Bolder",
                    color: "Dark",
                    horizontalAlignment: "Center"
                }
            ],
            backgroundImage: {
                url: "https://images.pexels.com/photos/114979/pexels-photo-114979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            },
            bleed: true
        },
        {
            type: "TextBlock",
            text: "Welcome Adventurer!",
            wrap: true,
            style: "heading"
        },
        {
            type: "Image",
            url: "https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/Dragon.png",
            horizontalAlignment: "Center"
        },
        {
            type: "TextBlock",
            text: "Click on a character to learn more.",
            wrap: true,
            style: "heading"
        },
        {
            type: "ActionSet",
            actions: [
                {
                    type: "Action.ShowCard",
                    title: "Elf",
                    card: {
                        type: "AdaptiveCard",
                        body: [
                            {
                                type: "TextBlock",
                                text: "Your Elf character, with heightened dexterity and intelligence, is adept in both elven tools and wizardry, mastering a cantrip from the wizard's spell list. His keen senses, darkvision, and deep cultural knowledge make him an agile guardian of elven traditions and a bridge between worlds.",
                                wrap: true
                            },
                            {
                                type: "FactSet",
                                facts: [
                                    {
                                        title: "Speed:",
                                        value: "Fast"
                                    },
                                    {
                                        title: "Alignment:",
                                        value: "Chaotic Good"
                                    },
                                    {
                                        title: "Special Abilities:",
                                        value: "Darkvision, Keen Senses, and Trance"
                                    }
                                ]
                            },
                            {
                                type: "TextBlock",
                                text: "**Ask dragon copilot**",
                                wrap: true,
                                style: "default",
                                fontType: "Default",
                                size: "Medium",
                                weight: "Bolder"
                            }
                        ],
        actions: [
        {
            type: "Action.Submit",
            title: "Analyze an Elf for this cyber mission",
            data: {
                msteams: {
                    type: "imBack",
                    text: "Analyze an Elf for this cyber mission",
                    value: "Analyze an Elf for this cyber mission"
                }
            }
        },
        {
            type: "Action.Submit",
            title: "Compare an Elf vs an Orc",
            data: {
                msteams: {
                    type: "imBack",
                    text: "Compare an Elf vs an Orc",
                    value: "Compare an Elf vs an Orc"
                }
            }
        },
        {
            type: "Action.Submit",
            title: "What are Elf weaknesses",
            data: {
                msteams: {
                    type: "imBack",
                    text: "What are Elf weaknesses",
                    value: "What are Elf weaknesses"
                }
            }
        }
                ]
                    }
                },
                {
                    type: "Action.ShowCard",
                    title: "Dragonborn",
                    card: {
                        type: "AdaptiveCard",
                        body: [
                            {
                                type: "TextBlock",
                                text: "Your Dragonborn, brimming with draconic power, brandishes a breath weapon and resists a damage from certain elements tied to their lineage. They stand as a bold symbol of dragon heritage, merging might with ancient wisdom.",
                                wrap: true
                            },
                            {
                                type: "FactSet",
                                facts: [
                                    {
                                        title: "Speed:",
                                        value: "Fast"
                                    },
                                    {
                                        title: "Alignment:",
                                        value: "Tends toward extremes. Can be good or become a terrible villan"
                                    },
                                    {
                                        title: "Special Abilities:",
                                        value: "Breath Weapon, Damage Resistance, and Draconic Ancestry"
                                    }
                                ]
                            },
                            {
                                type: "TextBlock",
                                text: "**Ask dragon copilot**",
                                wrap: true,
                                style: "default",
                                fontType: "Default",
                                size: "Medium",
                                weight: "Bolder"
                            }
                        ],
        actions: [
        {
            type: "Action.Submit",
            title: "Analyze a Dragonborn for this cyber mission",
            data: {
                msteams: {
                    type: "imBack",
                    text: "Analyze a Dragonborn for this cyber mission",
                    value: "Analyze a Dragonborn for this cyber mission"
                }
            }
        },
        {
            type: "Action.Submit",
            title: "Compare a Dragonborn vs a Human",
            data: {
                msteams: {
                    type: "imBack",
                    text: "Compare a Dragonborn vs a Human",
                    value: "Compare a Dragonborn vs a Human"
                }
            }
        },
        {
            type: "Action.Submit",
            title: "What are Dragonborn weaknesses",
            data: {
                msteams: {
                    type: "imBack",
                    text: "What are Dragonborn weaknesses",
                    value: "What are Dragonborn weaknesses"
                }
            }
        }
                ]
                    }
                },
                {
                    type: "Action.ShowCard",
                    title: "Dwarf",
                    card: {
                        type: "AdaptiveCard",
                        body: [
                            {
                                type: "TextBlock",
                                text: "Your Dwarf character, forged in the depths of mountain halls, combines stalwart endurance with a mastery of stone and steel. With their resilience and expertise in craftsmanship, they are a bulwark in battle and a bastion of ancient tradition.",
                                wrap: true
                            },
                            {
                                type: "FactSet",
                                facts: [
                                    {
                                        title: "Speed:",
                                        value: "Slow"
                                    },
                                    {
                                        title: "Alignment:",
                                        value: "Lawful good"
                                    },
                                    {
                                        title: "Special Abilities:",
                                        value: "Darkvision, Dwarven	Resilience, and Tool Proficiency"
                                    }
                                ]
                            },
                            {
                                type: "TextBlock",
                                text: "**Ask dragon copilot**",
                                wrap: true,
                                style: "default",
                                fontType: "Default",
                                size: "Medium",
                                weight: "Bolder"
                            }
                        ],
        actions: [
        {
            type: "Action.Submit",
            title: "Analyze a Dwarf for this cyber mission",
            data: {
                msteams: {
                    type: "imBack",
                    text: "Analyze a Dwarf for this cyber mission",
                    value: "Analyze a Dwarf for this cyber mission"
                }
            }
        },
        {
            type: "Action.Submit",
            title: "Compare a Dwarf vs a Halfling",
            data: {
                msteams: {
                    type: "imBack",
                    text: "Compare a Dwarf vs a Halfling",
                    value: "Compare a Dwarf vs a Halfling"
                }
            }
        },
        {
            type: "Action.Submit",
            title: "What are Dragonborn weaknesses",
            data: {
                msteams: {
                    type: "imBack",
                    text: "What are Dwarf weaknesses",
                    value: "What are Dwarf weaknesses"
                }
            }
        }
                ]
                    }
                },
                {
                    type: "Action.ShowCard",
                    title: "Gnome",
                    card: {
                        type: "AdaptiveCard"
                    },
                    mode: "secondary"
                }
            ]
        }
    ]
}
);
}
```

4. In the `src\index.ts` file add in

```js
import { createCharacterCard } from './cards';
```

5. In the `src\index.ts` file add in your code for a trigger message to return your adaptive card when spoken in the chat.

```js
// Listen for messages that trigger returning an adaptive card
app.message(/character card/i, async (context, _state) => {
    const attachment = createCharacterCard();
    await context.sendActivity({ attachments: [attachment] });
});
```

## Updating the Prompt

1. Go to `skprompt.txt` to update the prompt from Chefbot to Azure the AI Dragon

```
You are Azure the AI dragon, a quest master, that will guide the player through a cyber futuristic version of the player's chosen city.

At the start of the conversation give an introduction explaining the game. End with asking the user their name and what city they want to play in. 

Let the player respond, then ask the play what character they want to play as from this list: Dragonborn, Dwarf, Elf, Gnome, Halfling, Half-Elf, Half-Orc, Human, Tiefling. Then, let the player know they can ask you for more information about each character or ask for the "Character Card"

Let the player respond, and then ask them if they are ready to start the game.

Let the player respond, if the user has confirmed they want to start the game every response should:

    - detailed and peaceful narrative of the adventure focused on a mystery and exploration fit for all ages to play similar to a PG rated movie.
   
    - include details about chosen city in the narrative such as real famous landmarks, it's unique culture, and it's weather all affecting the adventure. Include random encounters with creatures, equipment, and spells from the information in the 5th Edition (5e) SRD (System Reference Document). 
    
    - be influenced by the user's chosen character with its character traits for the adventure from the way they react to situations and how other characters react to them.

    - always end with a separate section for "Dragon copilot suggested actions" with three potential actions for the user to choose as shown in the format per the example below:

        Input: 'Explore the city'
        Output: 'narrative

        **Dragon copilot suggested actions**

        1. Action
        2. Action
        3. Action

Base your answer off the text below:
```

## Creating your Local Vector Database

1. Delete the existing database in the `teams-ai` folder
2. Replace the links under `index\teams-ai.links` and save the change. Alternatively, you can add links to your own local or web based text files here to create a local vector database with your data. If you recieve a rate limit error, then you need to edit deployment for your embedding model in Azure OpenAI Studio and under advanced options you may increase your rate limit allowing you to embed additional data.

```js
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/adventuring/adventuring.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/adventuring/equipment.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/character/character.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/character/classes.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/character/races.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/gamemaster_rules/gamemaster_rules.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/gamemaster_rules/halfdragon_template.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/rules/abilities1.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/rules/rules.md
https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/main/documents.data/license.md
```

4. Rename `vectra.keys.azure-example` file as `vectra.keys`
5. In the newly renamed `vectra.keys` add in your Azure OpenAI key endpoint, and the name of your embedding model you deployed "embedding"
6. Bring up the terminal and install vectra

```bash
npm install -g vectra
```

7. Navigate to the `index` file in the terminal

```bash
cd index
```
8. Have vectra create a `teams-ai` folder for our local vector database

```bash
vectra create teams-ai
```
9. Use vectra to create the local vector database with the links provided using our embedding model

```bash
vectra add teams-ai -k vectra.keys -l teams-ai.links
```
10. update `index.ts` and `config.json` if you chose another name besides `teams-ai`. Otherwise your local vector database is done.

## Add in photo, name, and comment out responseformatter

1. To update the photo shown for your custom copilot replace the existing `color.png` file under `appPackage` folder with the picture of your choice adjusted to 250 x250 pixel size maximum.
2. Go to `appPackage\manifest.json` and update the full and short name to `AzureAIDragon` and other information for Azure the AI Dragon.
3. in `src\index.ts`, remove `addResponseFormatter(app)`, if desired.

## Launching your App Locally in Teams

1. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug (Edge)` or `Debug (Chrome)`.
1. When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.
1. Send any message to Azure the AI Dragon to begin the game. 

**Congratulations**! You are running Azure the AI Dragon that can now interact with users in Teams.
