"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required packages
const dotenv_1 = require("dotenv");
const path = __importStar(require("path"));
const restify = __importStar(require("restify"));
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const botbuilder_1 = require("botbuilder");
const teams_ai_1 = require("@microsoft/teams-ai");
const responseFormatter_1 = require("./responseFormatter");
const VectraDataSource_1 = require("./VectraDataSource");
// Read botFilePath and botFileSecret from .env file.
const ENV_FILE = path.join(__dirname, '..', '.env');
(0, dotenv_1.config)({ path: ENV_FILE });
// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new teams_ai_1.TeamsAdapter({}, new botbuilder_1.ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.BOT_ID,
    MicrosoftAppPassword: process.env.BOT_PASSWORD,
    MicrosoftAppType: 'MultiTenant'
}));
// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    console.log(error);
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity('OnTurnError Trace', `${error}`, 'https://www.botframework.com/schemas/error', 'TurnError');
    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};
// Set the onTurnError for the singleton CloudAdapter.
adapter.onTurnError = onTurnErrorHandler;
// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo test your bot in Teams, sideload the app manifest.json within Teams Apps.');
});
if (!process.env.OPENAI_KEY && !process.env.AZURE_OPENAI_KEY) {
    throw new Error('Missing environment variables - please check that OPENAI_KEY or AZURE_OPENAI_KEY is set.');
}
// Create AI components
const model = new teams_ai_1.OpenAIModel({
    // OpenAI Support
    apiKey: process.env.OPENAI_KEY,
    defaultModel: 'gpt-3.5-turbo',
    // Azure OpenAI Support
    azureApiKey: process.env.AZURE_OPENAI_KEY,
    azureDefaultDeployment: 'gpt-3.5-turbo',
    azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    azureApiVersion: '2023-03-15-preview',
    // Request logging
    logRequests: true
});
const prompts = new teams_ai_1.PromptManager({
    promptsFolder: path.join(__dirname, '../src/prompts')
});
const planner = new teams_ai_1.ActionPlanner({
    model,
    prompts,
    defaultPrompt: 'chat'
});
// Define storage and application
const storage = new botbuilder_1.MemoryStorage();
const app = new teams_ai_1.Application({
    storage,
    ai: {
        planner
    }
});
// Register your data source with planner
planner.prompts.addDataSource(new VectraDataSource_1.VectraDataSource({
    name: 'teams-ai',
    apiKey: process.env.OPENAI_KEY,
    azureApiKey: process.env.AZURE_OPENAI_KEY,
    azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    indexFolder: path.join(__dirname, '../index')
}));
// Add a custom response formatter to convert markdown code blocks to <pre> tags
(0, responseFormatter_1.addResponseFormatter)(app);
// Register other AI actions
app.ai.action(teams_ai_1.AI.FlaggedInputActionName, async (context, state, data) => {
    await context.sendActivity(`I'm sorry your message was flagged: ${JSON.stringify(data)}`);
    return teams_ai_1.AI.StopCommandName;
});
app.ai.action(teams_ai_1.AI.FlaggedOutputActionName, async (context, state, data) => {
    await context.sendActivity(`I'm not allowed to talk about such things.`);
    return teams_ai_1.AI.StopCommandName;
});
// Listen for incoming server requests.
server.post('/api/messages', async (req, res) => {
    // Route received a request to adapter for processing
    await adapter.process(req, res, async (context) => {
        // Dispatch to application for routing
        await app.run(context);
    });
});
//# sourceMappingURL=index.js.map