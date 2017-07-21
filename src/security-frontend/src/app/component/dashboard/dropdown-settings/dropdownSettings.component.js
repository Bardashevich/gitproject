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
const core_1 = require('@angular/core');
const menuItem_1 = require("./menuItem");
let DropdownSettingsComponent = class DropdownSettingsComponent {
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', menuItem_1.MenuItem)
], DropdownSettingsComponent.prototype, "items", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], DropdownSettingsComponent.prototype, "itemId", void 0);
DropdownSettingsComponent = __decorate([
    core_1.Component({
        selector: 'dropdown-settings',
        templateUrl: 'dropdownSettings.html'
    }), 
    __metadata('design:paramtypes', [])
], DropdownSettingsComponent);
exports.DropdownSettingsComponent = DropdownSettingsComponent;
//# sourceMappingURL=dropdownSettings.component.js.map