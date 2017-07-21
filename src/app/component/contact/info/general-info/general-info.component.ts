import {
    Component, trigger, state, style, transition, animate, keyframes, Input, Output, EventEmitter, ElementRef,
    ViewChild
} from "@angular/core";
import {FileUploader} from 'ng2-file-upload';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ContactsService} from "../../../../shared/services/contacts.service";
import {ImageService} from "../../../../shared/services/images.service";

const URL = `rest/files`;

@Component({
    selector: 'general-info',
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
    templateUrl: 'general-info.component.html',
    styleUrls: ['../../list/contacts.component.html', 'general-info.component.scss']
})


export class GeneralInfoComponent {
    @ViewChild('imageID') el: ElementRef;
    @Input() contact;
    @Input() properties;
    @Output() contactChange = new EventEmitter<any>();

    public uploader: FileUploader = new FileUploader({url: URL});

    constructor(private fb: FormBuilder, private contactsService: ContactsService, private imageService: ImageService) {
        this.contactGeneralInfoForm = this.fb.group({
            firstName: ['', Validators.required],
            firstNameEn: [''],
            lastName: ['', Validators.required],
            lastNameEn: [''],
            patronymic: [''],
            nationality: [''],
            dateOfBirth: [''],
            g: ['']
        });
    }

    private contactGeneralInfoForm: FormGroup;

    genders = [{name: "Male", value: true}, {name: "Female", value: false}];

    isImage(item) {
        var type = item._file.type;
        var mime = type.split('/');
        return mime.length !== 0 && mime[0] === 'image';
    }

    uploadFile() {
        this.uploader.queue[0].upload();
        this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
            if (!this.isImage(item)) {
                console.log('You can upload only images');
            } else {
                var reader = new FileReader();
                reader.onload = (e) => {
                    let target: any = e.target;
                    this.el.nativeElement.src = target.result;
                }
                reader.readAsDataURL(item._file);
                this.contact.photoUrl = JSON.parse(response);
            }
        };
        this.isShowSave();
        this.uploader = new FileUploader({url: URL});
    }

    isTextType(type) {
        return type == "text";
    }

    isShowSave() {
        this.properties[0].showSave = true;
    }

    saveGeneralInfo() {
        this.onContactChange();
        this.properties[0].showSave = false;
        if (this.contact.id != 0) {
            this.contactsService.update(this.contact).subscribe((response) => {
                this.contactsService.get(this.contact.id).subscribe((data) => {
                        this.contact = data;
                    },
                    error => {

                    });
            });
        } else {
            this.contactsService.create(this.contact).subscribe((response) => {
                this.contactsService.get(this.contact.id).subscribe((data) => {
                        this.contact = data;
                    },
                    error => {

                    });
            });
        }
    }

    showPhoto = true;

    getContactPhotoUrl() {
        if (this.contact.id > 0 && this.showPhoto) {
            this.showPhoto = false;
            this.imageService.getContactPhoto(this.contact.id).subscribe(response => {
                this.el.nativeElement.src = response;
            });
        } else {
            return null;
        }
        return null;
    }

    onDateOfBirthChange(date) {
        if (date) {
            this.contact.dateOfBirth = new Date(date);
        }
    }

    onContactChange() {
        this.contactChange.emit(this.contact);
    }

    getCurrentTime() {
        return (new Date()).getTime();
    }
}
