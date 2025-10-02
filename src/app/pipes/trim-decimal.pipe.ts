import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimDecimal',
})
export class TrimDecimalPipe implements PipeTransform {
  transform(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (Number.isInteger(num)) {
      return num.toString(); // Remove .0
    }

    return num.toFixed(1); // Keep one decimal place
  }
}
