"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ScrollSpyService = (function () {
    function ScrollSpyService() {
        this.changes$ = new core_1.EventEmitter();
        this.observables = {};
    }
    ScrollSpyService.prototype.getObservable = function (key) {
        return this.observables[key];
    };
    ScrollSpyService.prototype.setObservable = function (key, observable) {
        this.observables[key] = observable;
        this.observables = this.observables = Object.assign({}, this.observables);
        this.changes$.emit({ index: key, change: 'set' });
    };
    ScrollSpyService.prototype.deleteObservable = function (key) {
        delete this.observables[key];
        this.observables = Object.assign({}, this.observables);
        this.changes$.emit({ index: key, change: 'delete' });
    };
    return ScrollSpyService;
}());
ScrollSpyService = __decorate([
    core_1.Injectable()
], ScrollSpyService);
exports.ScrollSpyService = ScrollSpyService;
