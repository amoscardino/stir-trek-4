import { Pipe, PipeTransform } from '@angular/core';
import { TimeSlotModel } from './data/data.models';

@Pipe({
    name: 'timeSlotFilter'
})
export class TimeSlotFilterPipe implements PipeTransform {
    transform(values: TimeSlotModel[], filterText: string): any {
        return values;
    }
}
