/*
 * ls-plugin-ace-code (https://www.wpvs.de)
 * © 2024 Dennis Schulmeister-Zimolong <dennis@pingu-mail.de>
 * License of this file: BSD 2-clause
 */

import { removeSurroundingWhitespace } from "@dschulmeis/ls-utils/string_utils.js";
import { copyAttributes } from "../ls-utils/dom_utils.js";
import ace from "ace-code";

/**
 * This is a simple wrapper around Ace Code, that allows placing small code editors
 * into learning materials. For this a new custom element named `<ace-code>` is defined,
 * that can be used like this:
 * 
 * ```html
 * <ace-code
 *     mode    = "js"
 *     theme   = "ace/theme/cloud_editor"
 *     options = "{readOnly: true}"
 * >
 *     // Content of the code editor
 * </ace-code>
 * ```
 */
export default class LS_Plugin_AceCode {
    /**
     * Constructor to configure the plugin.
     * @param {Object} config Configuration values
     */
    constructor(config) {
        this._theme = config.theme || "";
        this._modes = config.modes || {};
    }

    /**
     * Replace all custom HTML tags with standard ones.
     * @param {Element} html DOM node with the slide definitions
     */
    preprocessHtml(html) {
        let aceCodeElements = html.querySelectorAll("ace-code");

        for (let aceCodeElement of aceCodeElements) {
            try {
                let divElement = document.createElement("div");
                divElement.textContent = removeSurroundingWhitespace(aceCodeElement.textContent);
                copyAttributes(aceCodeElement, divElement);
                
                let mode    = aceCodeElement.getAttribute("mode") || "";
                let theme   = aceCodeElement.getAttribute("theme") || this._theme || "";
                let options = JSON.parse(aceCodeElement.getAttribute("options") || "{}");

                aceCodeElement.removeAttribute("mode");
                aceCodeElement.removeAttribute("theme");
                aceCodeElement.removeAttribute("options");
                aceCodeElement.replaceWith(divElement);

                aceCodeElement.editor = ace.edit(divElement, options);
                divElement.editor = editor;

                if (mode || this._modes[mode]) {
                    aceCodeElement.editor.session.setMode(this._modes[mode]);
                } 

                if (theme) {
                    aceCodeElement.editor.setTheme(theme);
                }
            } catch (error) {
                console.warn("@dschulmeis/ls-plugin-ace-code:", error);
            }
        }
    }
}