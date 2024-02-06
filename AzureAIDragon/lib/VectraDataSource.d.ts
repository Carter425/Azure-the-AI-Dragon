import { DataSource, Memory, RenderedPromptSection, Tokenizer } from '@microsoft/teams-ai';
import { TurnContext } from 'botbuilder';
/**
 * Options for creating a `VectraDataSource`.
 */
export interface VectraDataSourceOptions {
    /**
     * Name of the data source and local index.
     */
    name: string;
    /**
     * OpenAI API key to use for generating embeddings.
     */
    apiKey: string;
    /**
     * Azure OpenAI API key to use as alternative way for generating embeddings.
     */
    azureApiKey: string;
    azureEndpoint: string;
    /**
     * Path to the folder containing the local index.
     * @remarks
     * This should be the root folder for all local indexes and the index itself
     * needs to be in a subfolder under this folder.
     */
    indexFolder: string;
    /**
     * Optional. Maximum number of documents to return.
     * @remarks
     * Defaults to `5`.
     */
    maxDocuments?: number;
    /**
     * Optional. Maximum number of chunks to return per document.
     * @remarks
     * Defaults to `50`.
     */
    maxChunks?: number;
    /**
     * Optional. Maximum number of tokens to return per document.
     * @remarks
     * Defaults to `600`.
     */
    maxTokensPerDocument?: number;
}
/**
 * A data source that uses a local Vectra index to inject text snippets into a prompt.
 */
export declare class VectraDataSource implements DataSource {
    private readonly _options;
    private readonly _index;
    /**
     * Name of the data source.
     * @remarks
     * This is also the name of the local Vectra index.
     */
    readonly name: string;
    /**
     * Creates a new `VectraDataSource` instance.
     * @param {VectraDataSourceOptions} options Options for creating the data source.
     */
    constructor(options: VectraDataSourceOptions);
    /**
     * Renders the data source as a string of text.
     * @param {TurnContext} context Turn context for the current turn of conversation with the user.
     * @param {Memory} memory An interface for accessing state values.
     * @param {Tokenizer} tokenizer Tokenizer to use when rendering the data source.
     * @param {number} maxTokens Maximum number of tokens allowed to be rendered.
     * @returns {Promise<RenderedPromptSection<string>>} A promise that resolves to the rendered data source.
     */
    renderData(context: TurnContext, memory: Memory, tokenizer: Tokenizer, maxTokens: number): Promise<RenderedPromptSection<string>>;
}
