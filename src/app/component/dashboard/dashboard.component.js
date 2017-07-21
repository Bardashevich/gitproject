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
const core_1 = require("@angular/core");
const gridster_component_1 = require("../../lib/gridster/gridster.component");
let DashboardComponent = class DashboardComponent {
    constructor(resolver) {
        this.resolver = resolver;
        this.dropdownMenuItems = [
            { title: 'Select a period ', functionName: 'selectPeriod', context: this },
            { title: 'Close', functionName: 'closeWindow', context: this }
        ];
        this.gridsterOptions = {
            lanes: 2,
            direction: 'vertical',
            widthHeightRatio: 2,
            dragAndDrop: true
        };
        this.gridsterDraggableOptions = {
            handlerClass: 'window-header'
        };
        this.widgets = [
            {
                x: 0, y: 0, w: 1, h: 1,
                title: 'Login',
                hidden: false,
                dropdownMenuItems: [...this.dropdownMenuItems]
            },
            {
                x: 1, y: 0, w: 1, h: 1,
                title: 'Login',
                hidden: false,
                dropdownMenuItems: [...this.dropdownMenuItems]
            },
            {
                x: 0, y: 1, w: 1, h: 1,
                title: 'Login',
                hidden: false,
                dropdownMenuItems: [...this.dropdownMenuItems]
            },
            {
                x: 1, y: 1, w: 1, h: 1,
                title: 'Login',
                hidden: false,
                dropdownMenuItems: [...this.dropdownMenuItems]
            }
        ];
    }
    ngAfterViewInit() {
        window.addEventListener('resize', () => {
            this.gridster.reload();
        });
    }
    closeWindow(id) {
        this.widgets[id].hidden = true;
        this.swapCurrentWidgetWithLastInColumn(id);
        this.moveEmptyColumn(id);
        this.updateWidgets();
    }
    updateWidgets() {
        setTimeout(() => {
            this.gridster.reload();
        }, 100);
    }
    swapCurrentWidgetWithLastInColumn(id) {
        let currentWidget = this.widgets[id];
        console.log(this.widgets);
        this.widgets.forEach((widget) => {
            if (!widget.hidden && widget.x === currentWidget.x && widget.y > currentWidget.y) {
                currentWidget = widget;
            }
        });
        if (currentWidget !== this.widgets[id]) {
            let tmp = currentWidget.y;
            currentWidget.y = this.widgets[id].y;
            this.widgets[id].y = tmp;
        }
    }
    moveEmptyColumn(id) {
        let isEmptyColumn = true;
        this.widgets.forEach((widget) => {
            if (widget.x === this.widgets[id].x && widget.hidden === false) {
                isEmptyColumn = false;
            }
        });
        if (isEmptyColumn) {
            this.widgets.forEach((widget) => {
                if (widget.x > this.widgets[id].x) {
                    widget.x--;
                }
            });
        }
    }
    selectPeriod(id) {
    }
    printInfo(container) {
        console.log(container);
        for (let key in container) {
            console.log(key + ": " + container);
        }
    }
};
__decorate([
    core_1.ViewChild('gridster'), 
    __metadata('design:type', gridster_component_1.GridsterComponent)
], DashboardComponent.prototype, "gridster", void 0);
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'dashboard',
        templateUrl: 'dashboard.html',
        styleUrls: ['dashboard.scss']
    }), 
    __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ComponentFactoryResolver !== 'undefined' && core_1.ComponentFactoryResolver) === 'function' && _a) || Object])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
var _a;
//# sourceMappingURL=dashboard.component.js.map