import {Component, Injectable, AfterViewInit} from "@angular/core";
import {ContactsService} from "../../../shared/services/contacts.service";
import {ScrollSpyService} from "ng2-scrollspy";
import {PropertiesService} from "../info/properties/properties.service";
import * as _ from "lodash";
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ContactModel} from "../../../shared/models/contacts/ContactDto";

declare var Materialize: any;

@Injectable()
@Component({
    selector: 'settings-wall',
    templateUrl: './settings-wall.component.html',
    styleUrls: ['./settings-wall.component.scss']
})
export class SettingsWallComponent implements AfterViewInit {
    contact;
    currentNav;
    navigation = [];
    defaultContact = new ContactModel;
    properties;
    indexCard;
    showSave = false;
    private subscription: Subscription;
    private id: number;
    private acls;
    dictionary = {};

    constructor(private router: Router,
                private route: ActivatedRoute,
                private contactsService: ContactsService,
                private propertiesData: PropertiesService,
                private scrollSpyService: ScrollSpyService) {
        this.scrollSpyService = scrollSpyService;
        this.properties = this.propertiesData.getProperties();
        this.indexCard = this.propertiesData.getIndexCard();
        this.navigation = this.propertiesData.getNavigation();
        this.currentNav = this.navigation[0].field;
        this.contact = this.defaultContact;
        this.contactsService.getDictionary().subscribe((response) => {
                this.dictionary = response;
                let selectOptions = {
                    language_level: [
                        {
                            name: 'BEGINNER',
                            value: 'Beginner'
                        },
                        {
                            name: 'ELEMENTARY',
                            value: 'Elementary'
                        },
                        {
                            name: 'PRE_INTERMEDIATE',
                            value: 'Pre intermediate'
                        },
                        {
                            name: 'INTERMEDIATE',
                            value: 'Intermediate'
                        },
                        {
                            name: 'UPPER_INTERMEDIATE',
                            value: 'Upper intermediate'
                        },
                        {
                            name: 'ADVANCED',
                            value: 'Advanced'
                        },
                        {
                            name: 'PROFICIENCY',
                            value: 'Proficiency'
                        }
                    ],
                    languages: [
                        {
                            name: 'ENGLISH',
                            value: 'English'
                        },
                        {
                            name: 'RUSSIAN',
                            value: 'Russian'
                        },
                        {
                            name: 'DEUTSCH',
                            value: 'Deutsch'
                        },
                        {
                            name: 'FRENCH',
                            value: 'French'
                        },
                        {
                            name: 'SPANISH',
                            value: 'Spanish'
                        }
                    ]
                };
                Object.assign(this.dictionary, selectOptions, response);
            },
            error => {
            });
    }

    ngAfterViewInit() {
        this.subscription = this.route.params.subscribe(params => this.id = params['id']);
        if (this.id && this.id != 0) {
            this.contactsService.get(this.id).subscribe((response) => {
                    this.id = null;
                    this.contact = response;
                    this.contactsService.getAcls(response.id).subscribe((data) => {
                        this.acls = data;
                    });
                    this.properties.map(card => {
                        if (card.data != '' && this.contact[card.data].length > 0) {
                            card.showCard = true;
                        } else {
                            card.showCard = false;
                        }
                    });
                    this.navigation.map(nav => {
                        if (nav.cards) {
                            nav.cards.map(card => {
                                if (this.properties[card].showCard) {
                                    nav.showCards = true;
                                }
                            });
                        }
                    });
                },
                error => {
                });
        } else if (this.id && this.id == 0) {
            this.properties.map(card => card.showCard = false);
        }
    }

    goToContacts() {
        this.router.navigate(['/contacts.list']);
    }

    save() {
        if (this.contact.id != 0) {
            this.contact.photoUrl ? this.contact.photoUrl = this.contact.photoUrl.replace(/file:/, "") : true;
            this.contactsService.update(this.contact).subscribe(response => {
                this.router.navigate(['/contacts.list']);
            }, error => {
            });

            for (let prop of this.properties) {
                prop.showSave = false;
            }
            this.showSave = false;
        } else {
            if (this.contact.firstName && this.contact.lastName && this.contact.firstName != "" && this.contact.lastName != "") {
                this.contactsService.create(this.contact).subscribe(response => {
                    this.router.navigate(['/contacts.list']);
                }, error => {
                });

                for (let prop of this.properties) {
                    prop.showSave = false;
                }
                this.showSave = false;
            }
        }
    }

    materialize() {
        if (Materialize && Materialize.updateTextFields) {
            Materialize.updateTextFields();
        }
        return true;
    }

    goToNav(nav) {
        this.currentNav = nav;
        for (let object of this.navigation) {
            if (nav == object.field) {
                window.scrollTo(0, object.pointOfOccurrence);
            }
        }
    }

    toggleCard(index) {
        this.properties[index].showCard = !this.properties[index].showCard;
        this.navigation.map(nav => {
            if (nav.cards) {
                let isShow = false;

                nav.cards.map(card => {
                    if (this.properties[card].showCard) {
                        isShow = true;
                    }
                });
                nav.showCards = isShow;
            }
        });
    }
}
