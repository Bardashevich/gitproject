import {Injectable} from "@angular/core";
import {ContactDeleteEntity} from "../../../../shared/services/contacts.service";

@Injectable()
export class PropertiesService {
    properties;
    indexCard;
    navigationScroll;

    constructor() {
        this.navigationScroll = [
            {
                field: 'general-info',
                name: 'General Info',
                pointOfOccurrence: 15
            },
            {
                field: 'contact-info',
                name: 'Contact Info',
                pointOfOccurrence: 495,
                showCards: true,
                hiddenCardsMessage: 'Cards are hidden',
                // cards: [
                //     3,
                //     4,
                //     5,
                //     6
                // ]
            },
            {
                field: 'work-experience',
                name: 'Work Experience',
                pointOfOccurrence: 985,
                showCards: true,
                hiddenCardsMessage: 'Cards are hidden',
                // cards: [
                //     7
                // ]
            },
            {
                field: 'education',
                name: 'Education',
                pointOfOccurrence: 1345,
                showCards: true,
                hiddenCardsMessage: 'Cards are hidden',
                // cards: [
                //     9
                // ]
            },
            {
                field: 'attachment',
                name: 'Attachment',
                pointOfOccurrence: 1745,
                showCards: false,
                hiddenCardsMessage: 'Cards are hidden',
                cards: [
                   10
                ]
            },
            {
                field: 'comment',
                name: 'Comment',
                pointOfOccurrence: 2145,
                showCards: true,
                hiddenCardsMessage: 'Cards are hidden',
                // cards: [
                //     11
                // ]
            },
            {
                field: 'skill',
                name: 'Skill',
                pointOfOccurrence: 2245
            },
            {
                field: 'access',
                name: 'Access',
                pointOfOccurrence: 2345
            }
        ]
        this.indexCard = [
            [
                0
            ],
            [
                1,
                2
            ],
            [

            ],
            [
                7,
                8
            ]
        ];
        this.properties = [
            {
                card: 'Profile',
                data: '',
                showSave: false,
                showCard: true,
                materialIcons: '',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'firstName',
                        name: 'First name*',
                        class: '',
                        type: 'text',
                        selectOptions : []
                    },
                    {
                        field: 'lastName',
                        name: 'Last name*',
                        class: '',
                        type: 'text',
                        selectOptions : []
                    },
                    {
                        field: 'firstNameEn',
                        name: 'First name en',
                        class: '',
                        type: 'text',
                        selectOptions : []
                    },
                    {
                        field: 'lastNameEn',
                        name: 'Last name en',
                        class: '',
                        type: 'text',
                        selectOptions : []
                    },
                    {
                        field: 'patronymic',
                        name: 'Patronymic',
                        class: '',
                        type: 'text',
                        selectOptions : []
                    },
                    {
                        field: 'nationality',
                        name: 'Nationality',
                        class: '',
                        type: 'text',
                        selectOptions : []
                    }
                ],
                classCol: 'col s5',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Languages',
                data: 'languages',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.Language,
                materialIcons: 'language',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'name',
                        name: 'Name',
                        class: 'width-40p crm-padding',
                        type: 'select',
                        selectOptions : 'languages'
                    },
                    {
                        field: 'level',
                        name: 'Level',
                        class: 'width-50p crm-padding',
                        type: 'select',
                        selectOptions : 'language_level'
                    }
                ],
                classCol: 'col s6',
                classCardContentHeight: 'card-content height-10px'
            },
            {
                card: 'Social Networks',
                data: 'socialNetworks',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.SocialNetwork,
                materialIcons: 'assignment_ind',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'url',
                        name: 'Url',
                        class: 'width-70p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'socialNetwork',
                        name: 'Social network',
                        class: 'width-20p crm-padding',
                        type: 'select',
                        selectOptions : 'socialNetworks'
                    }
                ],
                classCol: 'col s6',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Emails',
                data: 'emails',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.Email,
                materialIcons: 'email',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'name',
                        name: 'Name',
                        class: 'width-60p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'type',
                        name: 'Type',
                        class: 'width-30p crm-padding',
                        type: 'select',
                        selectOptions : 'emailTypes'
                    }
                ],
                classCol: 'col s6',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Telephones',
                data: 'telephones',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.Telephone,
                materialIcons: 'settings_phone',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'number',
                        name: 'Number',
                        class: 'width-60p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'type',
                        name: 'Type',
                        class: 'width-30p crm-padding',
                        type: 'select',
                        selectOptions : 'telephoneTypes'
                    }
                ],
                classCol: 'col s6',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Messengers',
                data: 'messengers',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.MessengerAccount,
                materialIcons: 'question_answer',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'username',
                        name: 'Username',
                        class: 'width-40p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'messenger',
                        name: 'Messenger',
                        class: 'width-30p crm-padding',
                        type: 'select',
                        selectOptions : 'messengers'
                    }
                ],
                classCol: 'col s6',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Addresses',
                data: 'addresses',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.Address,
                materialIcons: 'room',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'country',
                        name: 'Country',
                        class: 'width-60p crm-padding',
                        type: 'select',
                        selectOptions : 'countries'
                    },
                    {
                        field: 'region',
                        name: 'Region',
                        class: 'width-60p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'city',
                        name: 'City',
                        class: 'width-60p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'addressLine',
                        name: 'Address line',
                        class: 'width-60p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'zipcode',
                        name: 'Zipcode',
                        class: 'width-30p crm-padding',
                        type: 'text'
                    }
                ],
                classCol: 'col s12',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Projects',
                data: 'workplaces',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.Workplace,
                materialIcons: 'work',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'name',
                        name: 'Name',
                        class: 'width-10p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'position',
                        name: 'Position',
                        class: 'width-10p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'startDate',
                        name: 'From',
                        class: 'width-10p crm-padding',
                        type: 'date'
                    },
                    {
                        field: 'endDate',
                        name: 'To',
                        class: 'width-10p crm-padding',
                        type: 'date'
                    },
                    {
                        field: 'comment',
                        name: 'Comment',
                        class: 'width-50p crm-padding',
                        type: 'textarea'
                    }
                ],
                classCol: 'col s12',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Skills',
                data: 'skills',
                showSave: false,
                showCard: false,
                materialIcons: 'dashboard',
                pointOfOccurrence: '',
                fields:
                    [
                        {
                            field: '',
                            name: '',
                            class: '',
                            type: ''
                        },
                        {
                            field: '',
                            name: '',
                            class: '',
                            type: ''
                        }
                    ],
                classCol: 'col s12',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Education',
                data: 'educations',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.EducationInfo,
                materialIcons: 'business',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'name',
                        name: 'University',
                        class: 'width-20p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'faculty',
                        name: 'Faculty',
                        class: 'width-10p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'speciality',
                        name: 'Speciality',
                        class: 'width-10p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'startDate',
                        name: 'Start Date',
                        class: 'width-10p crm-padding',
                        type: 'date'
                    },
                    {
                        field: 'endDate',
                        name: 'Graduation Year',
                        class: 'width-10p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'type',
                        name: 'Type',
                        class: 'width-10p crm-padding',
                        type: 'select',
                        selectOptions : 'certificateTypes'
                    }
                ],
                classCol: 'col s12',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Attachment',
                data: 'attachments',
                showSave: false,
                showCard: false,
                contactDeleteEntity: ContactDeleteEntity.Attachment,
                materialIcons: 'library_add',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'name',
                        name: 'File',
                        class: 'width-40p crm-padding',
                        type: 'text'
                    },
                    {
                        field: 'comment',
                        name: 'Comment',
                        class: 'width-50p crm-padding',
                        type: 'text'
                    }
                ],
                classCol: 'col s12',
                classCardContentHeight: 'card-content height-300px'
            },
            {
                card: 'Comment',
                data: 'comments',
                showSave: false,
                showCard: false,
                materialIcons: 'view_headline',
                pointOfOccurrence: '',
                fields: [
                    {
                        field: 'text',
                        name: 'Text',
                        class: 'width-70p crm-padding',
                        type: 'text'
                    }
                ],
                classCol: 'col s12',
                classCardContentHeight: 'card-content height-300px'
            }
        ];

    }

    getNavigation() {
        return this.navigationScroll;
    }
    getProperties() {
        return this.properties;
    }
    getIndexCard() {
        return this.indexCard;
    }
}