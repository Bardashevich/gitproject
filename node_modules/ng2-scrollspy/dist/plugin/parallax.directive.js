"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var index_1 = require("../index");
var ScrollSpyParallaxDirective = (function () {
    function ScrollSpyParallaxDirective(renderer, elRef, scrollSpy) {
        this.renderer = renderer;
        this.elRef = elRef;
        this.scrollSpy = scrollSpy;
        this.isSpecialVal = false;
        this.defaultOptions = {
            spyId: 'window',
            horizontal: false,
            cssKey: 'backgroundPosition',
            property: 'backgroundPositionY',
            ratio: -.7,
            initValue: 0,
            unit: 'px',
            axis: 'Y'
        };
        this.el = elRef.nativeElement;
    }
    ScrollSpyParallaxDirective.prototype.ngOnInit = function () {
        if (!this.options) {
            this.options = {};
        }
        this.options = Object.assign(this.defaultOptions, this.options);
        if (this.scrollSpyParallaxDisabled === undefined) {
            this.scrollSpyParallaxDisabled = false;
        }
        if (this.options.property.match(/backgroundPosition/i)) {
            if (this.options.property.split('backgroundPosition')[1].toUpperCase() === 'X') {
                this.options.axis = 'X';
            }
            this.options.property = 'backgroundPosition';
        }
        var cssValArray;
        cssValArray = this.options.property.split(':');
        this.options.cssKey = cssValArray[0];
        this.cssValue = cssValArray[1];
        this.isSpecialVal = this.cssValue ? true : false;
        if (!this.cssValue) {
            this.cssValue = this.options.cssKey;
        }
        this.options.ratio = +this.options.ratio;
        this.options.initValue = +this.options.initValue;
    };
    ScrollSpyParallaxDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!!this.scrollSpy.getObservable(this.options.spyId)) {
            this.scrollStream$ = this.scrollSpy.getObservable(this.options.spyId).subscribe(function (e) {
                if (!_this.scrollSpyParallaxDisabled) {
                    _this.evaluateScroll(e.target);
                }
            });
        }
        else {
            return console.warn('ScrollSpyParallax: No ScrollSpy observable for id "' + this.options.spyId + '"');
        }
    };
    ScrollSpyParallaxDirective.prototype.evaluateScroll = function (target) {
        var currentScrollPosition;
        if (typeof target.scrollTop !== 'undefined') {
            currentScrollPosition = target.scrollTop;
        }
        else if (typeof target.scrollingElement !== 'undefined') {
            currentScrollPosition = target.scrollingElement.scrollTop;
        }
        else if (typeof target.scrollY !== 'undefined') {
            currentScrollPosition = target.scrollY;
        }
        else if (typeof target.pageYOffset !== 'undefined') {
            currentScrollPosition = target.pageYOffset;
        }
        else if (target.parentWindow && target.parentWindow.pageYOffset) {
            currentScrollPosition = target.parentWindow.pageYOffset;
        }
        var result;
        var value;
        value = currentScrollPosition * this.options.ratio + this.options.initValue;
        if (this.options.max !== undefined && currentScrollPosition >= this.options.max) {
            currentScrollPosition = this.options.max;
        }
        else if (this.options.min !== undefined && currentScrollPosition <= this.options.min) {
            currentScrollPosition = this.options.min;
        }
        if (this.options.cssKey === 'backgroundPosition') {
            if (this.options.axis === 'X') {
                result = value + this.options.unit + ' 0';
            }
            else {
                result = '0 ' + value + this.options.unit;
            }
        }
        else if (this.isSpecialVal) {
            result = this.cssValue + '(' + value + this.options.unit + ')';
        }
        else {
            result = value + this.options.unit;
        }
        this.renderer.setElementStyle(this.el, this.options.cssKey, result);
    };
    ScrollSpyParallaxDirective.prototype.ngOnDestroy = function () {
        this.scrollStream$.unsubscribe();
    };
    return ScrollSpyParallaxDirective;
}());
__decorate([
    core_1.Input('scrollSpyParallax'),
    __metadata("design:type", Object)
], ScrollSpyParallaxDirective.prototype, "options", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ScrollSpyParallaxDirective.prototype, "scrollSpyParallaxDisabled", void 0);
ScrollSpyParallaxDirective = __decorate([
    core_1.Injectable(),
    core_1.Directive({
        selector: '[scrollSpyParallax]'
    }),
    __metadata("design:paramtypes", [core_1.Renderer,
        core_1.ElementRef,
        index_1.ScrollSpyService])
], ScrollSpyParallaxDirective);
exports.ScrollSpyParallaxDirective = ScrollSpyParallaxDirective;
