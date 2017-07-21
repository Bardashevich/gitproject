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
var ScrollSpyAffixDirective = (function () {
    function ScrollSpyAffixDirective(ref, elRef, scrollSpy) {
        this.ref = ref;
        this.elRef = elRef;
        this.scrollSpy = scrollSpy;
        this.affix = false;
        this.affixTop = false;
        this.affixBottom = false;
        this.defaultOptions = {
            topMargin: 0,
            bottomMargin: 0
        };
        this.el = elRef.nativeElement;
    }
    ScrollSpyAffixDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!this.options) {
            this.options = {};
        }
        this.options = Object.assign(this.defaultOptions, this.options);
        this.parentEl = this.el.parentElement;
        this.elementTop = this.parentEl.scrollTop;
        this.elementBottom = this.elementTop + this.parentEl.getBoundingClientRect().height;
        if (!!this.scrollSpy.getObservable('window')) {
            this.scrollStream$ = this.scrollSpy.getObservable('window').subscribe(function (e) {
                if (typeof e.target.scrollingElement !== 'undefined') {
                    setTimeout(function () { return _this.update(e.target.scrollingElement.scrollTop); });
                }
                else if (typeof e.target.scrollY !== 'undefined') {
                    setTimeout(function () { return _this.update(e.target.scrollY); });
                }
                else if (typeof e.target.pageYOffset !== 'undefined') {
                    setTimeout(function () { return _this.update(e.target.pageYOffset); });
                }
                else if (e.target.parentWindow && e.target.parentWindow.pageYOffset) {
                    setTimeout(function () { return _this.update(e.target.parentWindow.pageYOffset); });
                }
            });
        }
    };
    ScrollSpyAffixDirective.prototype.update = function (currentTop) {
        if (currentTop >= this.elementTop + this.options.topMargin) {
            if (currentTop > this.elementBottom - this.options.bottomMargin - this.el.getBoundingClientRect().height) {
                if (this.affixTop || !this.affixBottom) {
                    this.ref.markForCheck();
                }
                this.affixTop = false;
                this.affixBottom = true;
                this.affix = true;
            }
            else {
                if (!this.affixTop || this.affixBottom) {
                    this.ref.markForCheck();
                }
                this.affixTop = true;
                this.affixBottom = false;
                this.affix = true;
            }
        }
        else {
            if (this.affixTop) {
                this.ref.markForCheck();
            }
            this.affixTop = false;
            this.affixBottom = false;
            this.affix = false;
        }
    };
    ScrollSpyAffixDirective.prototype.ngOnDestroy = function () {
        this.scrollStream$.unsubscribe();
    };
    return ScrollSpyAffixDirective;
}());
__decorate([
    core_1.Input('scrollSpyAffix'),
    __metadata("design:type", Object)
], ScrollSpyAffixDirective.prototype, "options", void 0);
ScrollSpyAffixDirective = __decorate([
    core_1.Injectable(),
    core_1.Directive({
        selector: '[scrollSpyAffix]',
        host: {
            '[class.affix]': 'affix',
            '[class.affix-top]': 'affixTop',
            '[class.affix-bottom]': 'affixBottom'
        }
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef,
        core_1.ElementRef,
        index_1.ScrollSpyService])
], ScrollSpyAffixDirective);
exports.ScrollSpyAffixDirective = ScrollSpyAffixDirective;
