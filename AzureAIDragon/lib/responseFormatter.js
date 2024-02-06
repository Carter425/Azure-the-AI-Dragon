"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addResponseFormatter = void 0;
const teams_ai_1 = require("@microsoft/teams-ai");
/**
 *
 * @param {Application} app Application to add the response formatter to.
 */
function addResponseFormatter(app) {
    app.ai.action(teams_ai_1.AI.SayCommandActionName, async (context, state, data) => {
        // Replace markdown code blocks with <pre> tags
        let addTag = false;
        let inCodeBlock = false;
        const output = [];
        const response = data.response.split('\n');
        for (const line of response) {
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    // Add tag to start of next line
                    addTag = true;
                    inCodeBlock = true;
                }
                else {
                    // Add tag to end of previous line
                    output[output.length - 1] += '</pre>';
                    addTag = false;
                    inCodeBlock = false;
                }
            }
            else if (addTag) {
                output.push(`<pre>${line}`);
                addTag = false;
            }
            else {
                output.push(line);
            }
        }
        // Send response
        const formattedResponse = output.join('\n');
        await context.sendActivity(formattedResponse);
        return '';
    });
}
exports.addResponseFormatter = addResponseFormatter;
//# sourceMappingURL=responseFormatter.js.map