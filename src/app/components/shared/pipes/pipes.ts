import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true 
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(item => 
      Object.keys(item).some(key => 
        String(item[key]).toLowerCase().includes(searchText)
      )
    );
  }
}
