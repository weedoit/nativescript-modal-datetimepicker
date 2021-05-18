import { Color } from "@nativescript/core";
export declare class ModalDatetimepicker {
    private myResolve;
    private window;
    private effectView;
    private overlayView;
    private bottomContentContainer;
    private titleLabel;
    private datePickerView;
    private _buttonHandler;
    constructor();
    pickDate(options?: PickerOptions): Promise<DateResponse>;
    pickTime(options?: PickerOptions): Promise<TimeResponse>;
    private show;
    private labelFactory;
    chooseDate(): void;
    chooseTime(): void;
    close(response?: any): void;
}
export interface PickerOptions {
    type?: string;
    title?: string;
    theme?: string;
    overlayAlpha?: number;
    maxDate?: Date;
    minDate?: Date;
    startingDate?: Date;
    startingHour?: number;
    startingMinute?: number;
    cancelLabel?: string;
    doneLabel?: string;
    cancelLabelColor?: Color;
    doneLabelColor?: Color;
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
