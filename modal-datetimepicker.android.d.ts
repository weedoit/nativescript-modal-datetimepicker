export declare class ModalDatetimepicker {
    datePicker: android.app.DatePickerDialog;
    timePicker: any;
    constructor();
    pickDate(options?: PickerOptions): Promise<DateResponse>;
    close(): void;
    pickTime(options?: PickerOptions): Promise<TimeResponse>;
}
export interface PickerOptions {
    type?: string;
    title?: string;
    theme?: string;
    maxDate?: Date;
    minDate?: Date;
    startingDate?: Date;
    startingHour?: number;
    startingMinute?: number;
    is24HourView?: boolean;
    maxTime?: {
        hour: number;
        minute: number;
    };
    minTime?: {
        hour: number;
        minute: number;
    };
    cancelLabel?: string;
    doneLabel?: string;
    datePickerMode?: string;
}
export interface TimeResponse {
    hour: number;
    minute: number;
}
export interface DateResponse {
    day: number;
    month: number;
    year: number;
}
