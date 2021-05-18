import { Application, Device } from "@nativescript/core";
var ButtonHandlerImpl = /** @class */ (function (_super) {
    __extends(ButtonHandlerImpl, _super);
    function ButtonHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonHandlerImpl.initWithOwner = function (owner) {
        var handler = ButtonHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    ButtonHandlerImpl.prototype.close = function (nativeButton) {
        if (this._owner) {
            var owner = this._owner.get();
            if (owner) {
                owner.close();
            }
        }
    };
    ButtonHandlerImpl.prototype.chooseDate = function (nativeButton) {
        if (this._owner) {
            var owner = this._owner.get();
            if (owner) {
                owner.chooseDate();
            }
        }
    };
    ButtonHandlerImpl.prototype.chooseTime = function (nativeButton) {
        if (this._owner) {
            var owner = this._owner.get();
            if (owner) {
                owner.chooseTime();
            }
        }
    };
    ButtonHandlerImpl.ObjCExposedMethods = {
        close: {
            returns: interop.types.void,
            params: [interop.types.id],
        },
        chooseDate: {
            returns: interop.types.void,
            params: [interop.types.id],
        },
        chooseTime: {
            returns: interop.types.void,
            params: [interop.types.id],
        },
    };
    return ButtonHandlerImpl;
}(NSObject));
const SUPPORT_DATE_PICKER_STYLE = parseFloat(Device.osVersion) >= 14.0;
const SUPPORT_TEXT_COLOR = parseFloat(Device.osVersion) < 14.0;
const DEFAULT_DATE_PICKER_STYLE = 1;
export class ModalDatetimepicker {
    constructor() { }
    pickDate(options = {}) {
        if (!options)
            options = {};
        options.type = "date";
        return this.show(options);
    }
    pickTime(options = {}) {
        if (!options)
            options = {};
        options.type = "time";
        return this.show(options);
    }
    show(options = {}) {
        const buttonHandler = ButtonHandlerImpl.initWithOwner(new WeakRef(this));
        this._buttonHandler = buttonHandler;
        return new Promise((resolve, reject) => {
            this.myResolve = resolve;
            if (!options.type)
                options.type = "date";
            if (!options.theme)
                options.theme = "dark";
            if (!options.overlayAlpha)
                options.overlayAlpha = 0.7;
            let startingDate = new Date();
            if (options.type === "date") {
                if (options.startingDate &&
                    typeof options.startingDate.getMonth !== "function") {
                    reject("startingDate must be a Date.");
                }
                else if (options.startingDate) {
                    startingDate = options.startingDate;
                }
            }
            else {
                if (options.startingHour !== undefined && options.startingHour >= 0) {
                    startingDate.setHours(options.startingHour);
                }
                if (options.startingMinute !== undefined &&
                    options.startingMinute >= 0) {
                    startingDate.setMinutes(options.startingMinute);
                }
            }
            if (options.minDate && typeof options.minDate.getMonth !== "function") {
                reject("minDate must be a Date.");
            }
            if (options.maxDate && typeof options.maxDate.getMonth !== "function") {
                reject("maxDate must be a Date.");
            }
            this.window = UIApplication.sharedApplication.keyWindow;
            const containerBounds = this.window.bounds;
            if (options.theme === "overlay") {
                this.overlayView = UIView.alloc().init();
                this.overlayView.frame = CGRectMake(containerBounds.origin.x, containerBounds.origin.y, containerBounds.size.width, containerBounds.size.height + 20);
                this.overlayView.autoresizingMask =
                    2 | 16;
                this.window.addSubview(this.overlayView);
                this.window.bringSubviewToFront(this.overlayView);
                UIView.animateWithDurationAnimations(0.4, () => {
                    this.overlayView.backgroundColor = UIColor.blackColor.colorWithAlphaComponent(options.overlayAlpha);
                });
            }
            else {
                this.effectView = UIVisualEffectView.alloc().init();
                this.effectView.frame = CGRectMake(containerBounds.origin.x, containerBounds.origin.y, containerBounds.size.width, containerBounds.size.height + 20);
                this.effectView.autoresizingMask =
                    2 | 16;
                this.window.addSubview(this.effectView);
                this.window.bringSubviewToFront(this.effectView);
                UIView.animateWithDurationAnimations(0.4, () => {
                    let theme = 1;
                    switch (options.theme) {
                        case "extralight":
                            theme = 0;
                            break;
                        case "light":
                            theme = 1;
                            break;
                        case "regular":
                            theme = 4;
                            break;
                        case "dark":
                            theme = 2;
                            break;
                        case "extradark":
                            theme = 3;
                            break;
                        case "prominent":
                            theme = 5;
                            break;
                        default:
                            break;
                    }
                    if (options.theme !== "none") {
                        this.effectView.effect = UIBlurEffect.effectWithStyle(theme);
                    }
                    else {
                        this.effectView.effect = null;
                    }
                });
            }
            this.bottomContentContainer = UIView.alloc().init();
            this.bottomContentContainer.frame = CGRectMake(10, containerBounds.size.height - 320, containerBounds.size.width - 20, 310);
            this.bottomContentContainer.autoresizingMask =
                8 | 2;
            this.bottomContentContainer.autoresizesSubviews = true;
            this.bottomContentContainer.transform = CGAffineTransformMakeTranslation(0, 320);
            const pickerHolderView = UIView.alloc().init();
            const appearance = Application.systemAppearance();
            if (appearance) {
                pickerHolderView.backgroundColor =
                    appearance === "dark" ? UIColor.blackColor : UIColor.whiteColor;
            }
            else {
                pickerHolderView.backgroundColor = UIColor.whiteColor;
            }
            pickerHolderView.frame = CGRectMake(0, 0, containerBounds.size.width - 20, 270);
            pickerHolderView.layer.cornerRadius = 10;
            pickerHolderView.layer.masksToBounds = true;
            pickerHolderView.autoresizingMask =
                2 | 16;
            pickerHolderView.layer.masksToBounds = false;
            pickerHolderView.layer.shadowColor = UIColor.blackColor.CGColor;
            pickerHolderView.layer.shadowOffset = CGSizeMake(2.0, 2.0);
            pickerHolderView.layer.shadowOpacity = 0.5;
            pickerHolderView.layer.shadowRadius = 8;
            pickerHolderView.layer.shadowPath = UIBezierPath.bezierPathWithRect(pickerHolderView.bounds).CGPath;
            const buttonContainer = UIView.alloc().initWithFrame(CGRectMake(0, 270, containerBounds.size.width - 20, 40));
            buttonContainer.autoresizingMask = 2;
            buttonContainer.autoresizesSubviews = true;
            const cancelButton = UIButton.buttonWithType(1);
            cancelButton.setTitleForState(options.cancelLabel || "Cancel", 0);
            cancelButton.addTargetActionForControlEvents(buttonHandler, "close", 64);
            cancelButton.frame = CGRectMake(0, 0, buttonContainer.bounds.size.width / 2, 40);
            cancelButton.setTitleColorForState((options.cancelLabelColor && options.cancelLabelColor.ios) ||
                UIColor.whiteColor, 0);
            cancelButton.titleLabel.font = UIFont.systemFontOfSize(18);
            cancelButton.autoresizingMask = 2;
            buttonContainer.addSubview(cancelButton);
            buttonContainer.bringSubviewToFront(cancelButton);
            const doneButton = UIButton.buttonWithType(1);
            doneButton.setTitleForState(options.doneLabel || "Done", 0);
            if (options.type === "date") {
                doneButton.addTargetActionForControlEvents(buttonHandler, "chooseDate", 64);
            }
            else {
                doneButton.addTargetActionForControlEvents(buttonHandler, "chooseTime", 64);
            }
            doneButton.frame = CGRectMake(buttonContainer.bounds.size.width / 2, 0, buttonContainer.bounds.size.width / 2, 40);
            doneButton.setTitleColorForState((options.doneLabelColor && options.doneLabelColor.ios) ||
                UIColor.colorWithRedGreenBlueAlpha(0, 0.6, 1, 1), 0);
            doneButton.titleLabel.font = UIFont.boldSystemFontOfSize(18);
            doneButton.autoresizingMask = 2;
            buttonContainer.addSubview(doneButton);
            buttonContainer.bringSubviewToFront(doneButton);
            this.bottomContentContainer.addSubview(buttonContainer);
            this.bottomContentContainer.bringSubviewToFront(buttonContainer);
            this.datePickerView = UIDatePicker.alloc().initWithFrame(CGRectMake(0, 0, containerBounds.size.width - 20, 250));
            this.datePickerView.datePickerMode =
                options.type === "date" ? 1 : 0;
            if (SUPPORT_DATE_PICKER_STYLE) {
                this.datePickerView.preferredDatePickerStyle = DEFAULT_DATE_PICKER_STYLE;
            }
            this.datePickerView.autoresizingMask = 2;
            this.datePickerView.date = startingDate;
            if (options.minDate)
                this.datePickerView.minimumDate = options.minDate;
            if (options.maxDate)
                this.datePickerView.maximumDate = options.maxDate;
            pickerHolderView.addSubview(this.datePickerView);
            this.datePickerView.center = pickerHolderView.center;
            pickerHolderView.bringSubviewToFront(this.datePickerView);
            this.bottomContentContainer.addSubview(pickerHolderView);
            this.bottomContentContainer.bringSubviewToFront(pickerHolderView);
            if (options.title) {
                this.titleLabel = this.labelFactory(options.title, UIColor.whiteColor, true, 25);
                this.titleLabel.textAlignment = 1;
                this.titleLabel.frame = CGRectMake(0, 20, containerBounds.size.width, containerBounds.size.height - 360);
                this.titleLabel.transform = CGAffineTransformMakeScale(0.8, 0.8);
                this.titleLabel.respondsToSelector("adjustsFontForContentSizeCategory")
                    ? (this.titleLabel.adjustsFontForContentSizeCategory = true)
                    : null;
                this.titleLabel.adjustsFontSizeToFitWidth = true;
                this.titleLabel.layer.masksToBounds = false;
                this.titleLabel.alpha = 0;
                this.titleLabel.autoresizingMask =
                    16 |
                        8 |
                        2;
                this.window.addSubview(this.titleLabel);
                this.window.bringSubviewToFront(this.titleLabel);
            }
            this.window.addSubview(this.bottomContentContainer);
            this.window.bringSubviewToFront(this.bottomContentContainer);
            UIView.animateWithDurationDelayOptionsAnimationsCompletion(0.4, 0, 131072, () => {
                this.bottomContentContainer.transform = CGAffineTransformMakeTranslation(0, 0);
                if (options.title) {
                    this.titleLabel.transform = CGAffineTransformMakeScale(1, 1);
                    this.titleLabel.alpha = 1;
                }
            }, () => { });
        });
    }
    labelFactory(text, color, shadow, size) {
        this.window = UIApplication.sharedApplication.keyWindow;
        const label = UILabel.alloc().init();
        label.text = text;
        label.font = UIFont.boldSystemFontOfSize(size);
        label.textColor = color;
        if (shadow) {
            label.shadowColor = UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, 0.4);
            label.shadowOffset = CGSizeMake(2.0, 2.0);
            label.layer.shadowRadius = 8.0;
            label.layer.shadowOpacity = 0.5;
            label.layer.masksToBounds = false;
            label.layer.shouldRasterize = true;
        }
        return label;
    }
    chooseDate() {
        const pickedDate = new Date(this.datePickerView.date);
        const response = {
            day: pickedDate.getDate(),
            month: pickedDate.getMonth() + 1,
            year: pickedDate.getFullYear(),
        };
        this.close(response);
    }
    chooseTime() {
        const pickedDate = new Date(this.datePickerView.date);
        const response = {
            hour: pickedDate.getHours(),
            minute: pickedDate.getMinutes(),
        };
        this.close(response);
    }
    close(response) {
        if (!response)
            response = false;
        UIView.animateWithDurationAnimationsCompletion(0.3, () => {
            if (this.effectView) {
                this.effectView.effect = null;
            }
            if (this.overlayView) {
                this.overlayView.backgroundColor = UIColor.clearColor;
            }
            this.bottomContentContainer.transform = CGAffineTransformMakeTranslation(0, 320);
            if (this.titleLabel) {
                this.titleLabel.transform = CGAffineTransformMakeScale(0.8, 0.8);
                this.titleLabel.alpha = 0;
            }
        }, () => {
            if (this.effectView) {
                this.effectView.removeFromSuperview();
            }
            if (this.overlayView) {
                this.overlayView.removeFromSuperview();
            }
            this.bottomContentContainer.removeFromSuperview();
            if (this.titleLabel) {
                this.titleLabel.removeFromSuperview();
            }
            this.myResolve(response);
            this._buttonHandler = null;
            this.titleLabel = null;
            this.overlayView = null;
            this.effectView = null;
            this.bottomContentContainer = null;
            this.window = null;
            this.datePickerView = null;
        });
    }
}
