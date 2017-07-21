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
var ScrollSpyInfiniteDirective = (function () {
    function ScrollSpyInfiniteDirective(scrollSpy) {
        this.scrollSpy = scrollSpy;
        this.scrollSpyInfiniteEvent = new core_1.EventEmitter();
        this.defaultOptions = {
            spyId: 'window',
            distanceRatio: 1
        };
    }
    ScrollSpyInfiniteDirective.prototype.ngOnInit = function () {
        if (!this.options) {
            this.options = {};
        }
        this.options = Object.assign(this.defaultOptions, this.options);
        if (this.scrollSpyInfiniteDisabled === undefined) {
            this.scrollSpyInfiniteDisabled = false;
        }
    };
    ScrollSpyInfiniteDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!!this.scrollSpy.getObservable(this.options.spyId)) {
            this.scrollStream$ = this.scrollSpy.getObservable(this.options.spyId).throttleTime(200).subscribe(function (e) {
                if (!_this.scrollSpyInfiniteDisabled) {
                    _this.evaluateScroll(e.target);
                }
            });
        }
        else {
            return console.warn('ScrollSpyInfinite: No ScrollSpy observable for id "' + this.options.spyId + '"');
        }
    };
    ScrollSpyInfiniteDirective.prototype.evaluateScroll = function (target) {
        if (this.options.spyId === 'window') {
            var scrollHeight = target.document.documentElement.scrollHeight;
            var scrollTop = target.pageYOffset || target.parentWindow.pageYOffset;
            var offsetHeight = target.document.documentElement.clientHeight;
            if (scrollHeight - scrollTop - offsetHeight <= offsetHeight * this.options.distanceRatio) {
                this.scrollSpyInfiniteEvent.next({});
            }
        }
        else {
            var scrollHeight = target.scrollingElement ?
                target.scrollingElement.scrollHeight
                : target.scrollHeight;
            var scrollTop = target.scrollingElement ?
                target.scrollingElement.scrollTop
                : target.scrollTop;
            var offsetHeight = target.scrollingElement ?
                target.scrollingElement.offsetHeight
                : target.offsetHeight;
            if (scrollHeight - scrollTop - offsetHeight <= offsetHeight * this.options.distanceRatio) {
                this.scrollSpyInfiniteEvent.next({});
            }
        }
    };
    ScrollSpyInfiniteDirective.prototype.ngOnDestroy = function () {
        this.scrollStream$.unsubscribe();
    };
    return ScrollSpyInfiniteDirective;
}());
__decorate([
    core_1.Input('scrollSpyInfinite'),
    __metadata("design:type", Object)
], ScrollSpyInfiniteDirective.prototype, "options", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ScrollSpyInfiniteDirective.prototype, "scrollSpyInfiniteDisabled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ScrollSpyInfiniteDirective.prototype, "scrollSpyInfiniteEvent", void 0);
ScrollSpyInfiniteDirective = __decorate([
    core_1.Injectable(),
    core_1.Directive({
        selector: '[scrollSpyInfinite]'
    }),
    __metadata("design:paramtypes", [index_1.ScrollSpyService])
], ScrollSpyInfiniteDirective);
exports.ScrollSpyInfiniteDirective = ScrollSpyInfiniteDirective;
