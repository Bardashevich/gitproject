"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ScrollSpyIndexService = (function () {
    function ScrollSpyIndexService() {
        this.changes$ = new core_1.EventEmitter();
        this.indexes = {};
    }
    ScrollSpyIndexService.prototype.getIndex = function (key) {
        return this.indexes[key];
    };
    ScrollSpyIndexService.prototype.setIndex = function (key, index) {
        this.indexes[key] = index;
        this.indexes = this.indexes = Object.assign({}, this.indexes);
        this.changes$.emit({ index: key, change: 'set' });
    };
    ScrollSpyIndexService.prototype.deleteIndex = function (key) {
        delete this.indexes[key];
        this.indexes = Object.assign({}, this.indexes);
        this.changes$.emit({ index: key, change: 'delete' });
    };
    return ScrollSpyIndexService;
}());
ScrollSpyIndexService = __decorate([
    core_1.Injectable()
], ScrollSpyIndexService);
exports.ScrollSpyIndexService = ScrollSpyIndexService;
