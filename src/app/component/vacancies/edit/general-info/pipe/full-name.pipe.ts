import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
    name: 'fullName'
})
export class FullNamePipe implements PipeTransform {
    transform(value:any) {
        if (value) {
            return value.firstName + ' ' + value.lastName;
        }
    }
}
