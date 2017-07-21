import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'optionPipe'})
export class OptionPipe implements PipeTransform {
    transform(value: any, option: any): any {
        if (option === 'value') {
            if (value.value) {
                return value.value;
            } else if (value.id) {
                return value.name;
            }
        } else if (option === 'id') {
            if (value.id) {
                return value.id;
            } else if (value.value) {
                return value.name;
            }
        }
    }
}
