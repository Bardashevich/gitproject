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
var index_service_1 = require("./index.service");
var ScrollSpyIndexRenderComponent = (function () {
    function ScrollSpyIndexRenderComponent(ref, elRef, scrollSpy, scrollSpyIndex) {
        this.ref = ref;
        this.elRef = elRef;
        this.scrollSpy = scrollSpy;
        this.scrollSpyIndex = scrollSpyIndex;
        this.items = [];
        this.itemsHash = {};
        this.itemsToHighlight = [];
        this.defaultOptions = {
            spyId: 'window',
            topMargin: 0
        };
        this.el = elRef.nativeElement;
    }
    ScrollSpyIndexRenderComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.scrollSpyIndexRenderOptions) {
            this.scrollSpyIndexRenderOptions = {};
        }
        if (!this.scrollSpyIndexRenderOptions.id) {
            return console.warn('ScrollSpyIndex: Missing id.');
        }
        this.scrollSpyIndexRenderOptions = Object.assign(this.defaultOptions, this.scrollSpyIndexRenderOptions);
        this.changeStream$ = this.scrollSpyIndex.changes$.subscribe(function (e) {
            if (e.index === _this.scrollSpyIndexRenderOptions.id) {
                if (e.change === 'delete') {
                    _this.update();
                }
                else if (e.change === 'set') {
                    _this.update();
                }
            }
        });
    };
    ScrollSpyIndexRenderComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!!this.scrollSpy.getObservable(this.scrollSpyIndexRenderOptions.spyId)) {
            this.scrollStream$ = this.scrollSpy.getObservable(this.scrollSpyIndexRenderOptions.spyId).subscribe(function (e) {
                if (typeof e.target.scrollingElement !== 'undefined') {
                    _this.currentScrollPosition = e.target.scrollingElement.scrollTop;
                }
                else if (typeof e.target.scrollY !== 'undefined') {
                    _this.currentScrollPosition = e.target.scrollY;
                }
                else if (typeof e.target.pageYOffset !== 'undefined') {
                    _this.currentScrollPosition = e.target.pageYOffset;
                }
                _this.calculateHighlight();
            });
        }
        else {
            return console.warn('ScrollSpyIndexComponent: No ScrollSpy observable for id "' + this.scrollSpyIndexRenderOptions.spyId + '"');
        }
    };
    ScrollSpyIndexRenderComponent.prototype.update = function () {
        var _this = this;
        var data = this.scrollSpyIndex.getIndex(this.scrollSpyIndexRenderOptions.id) || [];
        var stack = [];
        var parentStack = [];
        var lastItem;
        this.items = [];
        this.itemsHash = {};
        for (var i = 0; i < data.length; ++i) {
            var item = {
                link: data[i].id,
                text: data[i].textContent || data[i].innerText,
                parents: [],
                children: []
            };
            var level = data[i].tagName;
            for (var n = 0; n < data[i].classList.length; n++) {
                level += ',' + data[i].classList[n];
            }
            var stacksize = stack.length;
            if (stacksize === 0) {
                stack.push(level);
            }
            else if (level !== stack[stacksize - 1]) {
                for (var j = stacksize - 1; j >= 0; j--) {
                    if (level === stack[j]) {
                        break;
                    }
                }
                if (j < 0) {
                    stack.push(level);
                    parentStack.push(lastItem);
                }
                else {
                    while (stack.length > j + 1) {
                        stack.pop();
                        parentStack.pop();
                    }
                }
            }
            lastItem = item.link;
            if (parentStack.length > 0) {
                item.parents = parentStack.slice();
                var temp = this.items;
                for (var t = 0; t < parentStack.length; ++t) {
                    if (t < parentStack.length - 1) {
                        temp = temp.filter(function (e) { return e.link === parentStack[t]; })[0].children;
                    }
                    else {
                        temp.filter(function (e) { return e.link === parentStack[t]; })[0].children.push(item);
                    }
                }
            }
            else {
                this.items.push(item);
            }
            this.itemsHash[item.link] = item;
        }
        setTimeout(function () {
            _this.calculateHighlight();
        });
    };
    ScrollSpyIndexRenderComponent.prototype.calculateHighlight = function () {
        var items = this.scrollSpyIndex.getIndex(this.scrollSpyIndexRenderOptions.id);
        this.itemsToHighlight = [];
        if (!items || !items.length) {
            return;
        }
        var highlightItem;
        for (var i = items.length - 1; i >= 0; i--) {
            if (this.currentScrollPosition - (items[i].offsetTop + this.scrollSpyIndexRenderOptions.topMargin) >= 0) {
                highlightItem = items[i].id;
                break;
            }
        }
        if (!highlightItem) {
            highlightItem = items[0].id;
        }
        this.itemsToHighlight = [highlightItem].concat(this.itemsHash[highlightItem].parents);
        this.ref.markForCheck();
    };
    ScrollSpyIndexRenderComponent.prototype.highlight = function (id) {
        return this.itemsToHighlight.indexOf(id) !== -1;
    };
    ScrollSpyIndexRenderComponent.prototype.goTo = function (anchor) {
        setTimeout(function () {
            document.querySelector('#' + anchor).scrollIntoView();
        });
    };
    ScrollSpyIndexRenderComponent.prototype.ngOnDestroy = function () {
        this.changeStream$.unsubscribe();
        this.scrollStream$.unsubscribe();
    };
    return ScrollSpyIndexRenderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ScrollSpyIndexRenderComponent.prototype, "scrollSpyIndexRenderOptions", void 0);
ScrollSpyIndexRenderComponent = __decorate([
    core_1.Injectable(),
    core_1.Component({
        selector: 'scrollSpy-index-render',
        template: "\n  <div #container>\n    <ul class=\"nav flex-column menu\">\n      <li *ngFor=\"let item of items\" [class.active]=\"highlight(item.link)\">\n        <a [routerLink]=\"\" fragment=\"{{item.link}}\" (click)=\"goTo(item.link)\">{{item.text}}</a>\n        <ul *ngIf=\"item.children.length\" class=\"nav menu\">\n          <li *ngFor=\"let itemChild of item.children\" [class.active]=\"highlight(itemChild.link)\">\n            <a [routerLink]=\"\" fragment=\"{{itemChild.link}}\" (click)=\"goTo(itemChild.link)\">{{itemChild.text}}</a>\n            <ul *ngIf=\"itemChild.children.length\" class=\"nav menu\">\n              <li *ngFor=\"let itemChild1 of itemChild.children\" [class.active]=\"highlight(itemChild1.link)\">\n                <a [routerLink]=\"\" fragment=\"{{itemChild1.link}}\" (click)=\"goTo(itemChild1.link)\">{{itemChild1.text}}</a>\n                 <ul *ngIf=\"itemChild1.children.length\" class=\"nav menu\">\n                  <li *ngFor=\"let itemChild2 of itemChild1.children\" [class.active]=\"highlight(itemChild2.link)\">\n                    <a [routerLink]=\"\" fragment=\"{{itemChild2.link}}\" (click)=\"goTo(itemChild2.link)\">{{itemChild2.text}}</a>\n                  </li>\n                </ul>\n              </li>\n            </ul>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  </div>\n  ",
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef,
        core_1.ElementRef,
        index_1.ScrollSpyService,
        index_service_1.ScrollSpyIndexService])
], ScrollSpyIndexRenderComponent);
exports.ScrollSpyIndexRenderComponent = ScrollSpyIndexRenderComponent;
