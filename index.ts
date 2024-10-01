/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import { definePluginSettings, Settings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings(
    {
        blockedWords: {
            type: OptionType.STRING,
            description: "Strings not to capitilise (seperate with a comma)",
            default: "http, https, ok"
        },
    }
);

export default definePlugin({
    name: "WriteUpperCase",
    description: "Changes the first Letter of each Sentence in Message Inputs to Uppercase",
    authors: [
        { name: "Samwich", id: 976176454511509554n },
        { name: "krystalskullofficial", id: 929208515883569182n },
    ],
    patches: [],

    start() {
        this.preSend = addPreSendListener(async (_, message) => {
            message.content = textProcessing(message.content);
        });
    },
    stop() {
        this.preSend = removePreSendListener(async (_, message) => {
            message.content = textProcessing(message.content);
        });
    },
    settings
});


// this is probably really badly coded im so fucking sorry :skull:
function textProcessing(textInput: string): string {
    const sentences = textInput.split(/(?<=\w\.)\s/);
    const blockedWordsArray: string[] = Settings.plugins.WriteUpperCase.blockedWords.split(", ");

    return sentences.map(element => {
        if (!blockedWordsArray.some(word => element.toLowerCase().startsWith(word.toLocaleLowerCase()))) {
            return element.charAt(0).toUpperCase() + element.slice(1);
        } else {
            return element;
        }
    }).join(" ");
}
