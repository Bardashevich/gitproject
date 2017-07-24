import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'select'})
export class SelectPipe implements PipeTransform {
    transform(value: any, options: any[]): any {
        let answer;
        for (let option of options) {
            if (option.value) {
                if (option.name === value) {
                    answer = option.value;
                }
            } else if (option.id) {
                if (option.id === value) {
                    answer = option.name;
                }
            }
        }
        return answer;

    }
}
