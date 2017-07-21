"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
__export(require("./parallax.directive"));
var parallax_directive_1 = require("./parallax.directive");
var ScrollSpyParallaxModule = (function () {
    function ScrollSpyParallaxModule() {
    }
    return ScrollSpyParallaxModule;
}());
ScrollSpyParallaxModule = __decorate([
    core_1.NgModule({
        declarations: [parallax_directive_1.ScrollSpyParallaxDirective],
        exports: [parallax_directive_1.ScrollSpyParallaxDirective]
    })
], ScrollSpyParallaxModule);
exports.ScrollSpyParallaxModule = ScrollSpyParallaxModule;
