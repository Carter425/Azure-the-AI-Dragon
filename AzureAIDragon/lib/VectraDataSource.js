"use strict";
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
exports.VectraDataSource = void 0;
const vectra_1 = require("vectra");
const path = __importStar(require("path"));
/**
 * A data source that uses a local Vectra index to inject text snippets into a prompt.
 */
class VectraDataSource {
    /**
     * Creates a new `VectraDataSource` instance.
     * @param {VectraDataSourceOptions} options Options for creating the data source.
     */
    constructor(options) {
        this._options = options;
        this.name = options.name;
        // Create embeddings model
        const embeddings = new vectra_1.OpenAIEmbeddings({
            model: 'text-embedding-ada-002',
            apiKey: options.apiKey,
            // Azure OpenAI Support
            azureApiKey: options.azureApiKey,
            azureDeployment: 'embedding',
            azureEndpoint: options.azureEndpoint
        });
        // Create local index
        this._index = new vectra_1.LocalDocumentIndex({
            embeddings,
            folderPath: path.join(options.indexFolder, options.name)
        });
    }
    /**
     * Renders the data source as a string of text.
     * @param {TurnContext} context Turn context for the current turn of conversation with the user.
     * @param {Memory} memory An interface for accessing state values.
     * @param {Tokenizer} tokenizer Tokenizer to use when rendering the data source.
     * @param {number} maxTokens Maximum number of tokens allowed to be rendered.
     * @returns {Promise<RenderedPromptSection<string>>} A promise that resolves to the rendered data source.
     */
    async renderData(context, memory, tokenizer, maxTokens) {
        var _a, _b, _c;
        // Query index
        const query = memory.getValue('temp.input');
        const results = await this._index.queryDocuments(query, {
            maxDocuments: (_a = this._options.maxDocuments) !== null && _a !== void 0 ? _a : 5,
            maxChunks: (_b = this._options.maxChunks) !== null && _b !== void 0 ? _b : 50
        });
        // Add documents until you run out of tokens
        let length = 0;
        let output = '';
        let connector = '';
        for (const result of results) {
            // Start a new doc
            let doc = `${connector}url: ${result.uri}\n`;
            let docLength = tokenizer.encode(doc).length;
            const remainingTokens = maxTokens - (length + docLength);
            if (remainingTokens <= 0) {
                break;
            }
            // Render document section
            const sections = await result.renderSections(Math.min(remainingTokens, (_c = this._options.maxTokensPerDocument) !== null && _c !== void 0 ? _c : 600), 1);
            docLength += sections[0].tokenCount;
            doc += sections[0].text;
            // Append do to output
            output += doc;
            length += docLength;
            connector = '\n\n';
        }
        return { output, length, tooLong: length > maxTokens };
    }
}
exports.VectraDataSource = VectraDataSource;
//# sourceMappingURL=VectraDataSource.js.map