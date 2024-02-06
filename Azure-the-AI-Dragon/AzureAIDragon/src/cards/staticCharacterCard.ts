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
            url: "https://raw.githubusercontent.com/Carter425/Azure-the-AI-Dragon/4ce6ed419d64b18d66a7e6e2ac3a4c5118379031/Dragon.png",
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