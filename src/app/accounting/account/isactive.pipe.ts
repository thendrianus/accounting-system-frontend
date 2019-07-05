import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isactivefilter',
    pure: false
})
export class IsactiveFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        
        return items.filter(item => item.is_active === 1);
    }
}