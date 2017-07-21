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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var service_1 = require("./core/service");
var window_directive_1 = require("./core/window.directive");
var element_directive_1 = require("./core/element.directive");
var index_service_1 = require("./plugin/index.service");
__export(require("./core/service"));
__export(require("./core/window.directive"));
__export(require("./core/element.directive"));
__export(require("./plugin/index.service"));
exports.NG2SCROLLSPY_FORROOT_GUARD = new core_1.OpaqueToken('NG2SCROLLSPY_FORROOT_GUARD');
function provideForRootGuard(scrollSpyService) {
    if (scrollSpyService) {
        throw new Error("ScrollSpyModule.forRoot() called twice. Lazy loaded modules should declare directives directly.");
    }
    return 'guarded';
}
exports.provideForRootGuard = provideForRootGuard;
var ScrollSpyModule = ScrollSpyModule_1 = (function () {
    function ScrollSpyModule(guard) {
    }
    ScrollSpyModule.forRoot = function () {
        return {
            ngModule: ScrollSpyModule_1,
            providers: [
                {
                    provide: exports.NG2SCROLLSPY_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[service_1.ScrollSpyService, new core_1.Optional(), new core_1.SkipSelf()]]
                },
                service_1.ScrollSpyService,
                index_service_1.ScrollSpyIndexService
            ]
        };
    };
    return ScrollSpyModule;
}());
ScrollSpyModule = ScrollSpyModule_1 = __decorate([
    core_1.NgModule({
        declarations: [window_directive_1.ScrollSpyDirective, element_directive_1.ScrollSpyElementDirective],
        exports: [window_directive_1.ScrollSpyDirective, element_directive_1.ScrollSpyElementDirective]
    }),
    __param(0, core_1.Optional()), __param(0, core_1.Inject(exports.NG2SCROLLSPY_FORROOT_GUARD)),
    __metadata("design:paramtypes", [Object])
], ScrollSpyModule);
exports.ScrollSpyModule = ScrollSpyModule;
var ScrollSpyModule_1;
