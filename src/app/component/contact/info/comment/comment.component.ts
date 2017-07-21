import {
    Component, trigger, style, transition, animate, Input, state, Output, EventEmitter
} from "@angular/core";
import * as _ from "lodash";
import {ContactsService} from "../../../../shared/services/contacts.service";
import {ContactCommentDto} from "../../../../shared/models/contacts/ContactCommentDto";
import {AuthService} from "../../../../shared/services/auth.service";
import {User} from "../../../../shared/models/login/user";

@Component({
    selector: 'comment',
    animations: [
        trigger('toggle', [
            state('void', style({
                'opacity': '0',
                'padding': '0 0 0 20px',
                'height': '0px'
            })),
            transition('* <=> *', animate('.3s 0 ease-in-out'))
        ])
    ],
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
    @Input('contact') contact;
    @Input('show') showCard;
    @Output() removeCard = new EventEmitter();

    editMode: boolean = false;
    currentUser: User;

    constructor(private contactsService: ContactsService, private authService: AuthService) {
        this.currentUser = this.authService.getUser();
    }

    save() {
        if (!this.contact.id) {
            return;
        }

        if (this.contact.photoUrl) {
            this.contact.photoUrl = this.contact.photoUrl.replace(/file:/, "");
        }

        this.contactsService.update(this.contact).subscribe(() => {
            this.contactsService.get(this.contact.id).subscribe((response) => {
                this.contact = response;
            });
        });
    }

    add() {
        let comment = new ContactCommentDto();
        comment.authorId = this.currentUser.userId.toString();
        comment.author = this.currentUser.username;
        comment.date = (+(new Date())).toString();

        this.contact.comments.push(comment);
    }

    remove() {
        this.contact.comments
            .filter(_ => _.selected)
            .forEach(c => c.dateDeleted = new Date().getTime());

        _.remove(this.contact.comments, (c: ContactCommentDto) => !c.id && c.dateDeleted);
    }

    get notDeletedComments() {
        return this.contact ? this.contact.comments.filter(_ => !_.dateDeleted) : [];
    }

    isData() {
        return this.contact && this.contact.comments.length;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    isAnyChecked() {
        return this.contact.comments.some(_ => _.selected && !_.dateDeleted);
    }

    isAnyDeleted() {
        return this.contact.comments.some(_ => _.dateDeleted);
    }

    get countSelectedItems() {
        return this.contact.comments.filter(_ => _.selected).length;
    }

    isAnyDirty(form) {
        for (let controlName in  form.controls) {
            if (!controlName.includes("contactCommentSelect") && form.controls[controlName].dirty) {
                return true;
            }
        }
        return false;
    }
}
