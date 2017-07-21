import {Component, ViewChild, AfterViewInit, ComponentFactoryResolver} from "@angular/core";
import {IGridsterOptions} from "../../lib/gridster/IGridsterOptions";
import {IGridsterDraggableOptions} from "../../lib/gridster/IGridsterDraggableOptions";
import {GridsterComponent} from "../../lib/gridster/gridster.component";
import {MenuItem} from "./dropdown-settings/menuItem";


@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.html',
    styleUrls: ['dashboard.scss']
})
export class DashboardComponent implements AfterViewInit{

    @ViewChild('gridster') gridster: GridsterComponent;

    dropdownMenuItems: Array<MenuItem> = [
        {title: 'Select a period ', functionName: 'selectPeriod', context: this},
        {title: 'Close', functionName: 'closeWindow', context: this}
    ];

    gridsterOptions:IGridsterOptions = {
        lanes: 2,
        direction: 'vertical',
        widthHeightRatio: 2,
        dragAndDrop: true
    };

    gridsterDraggableOptions: IGridsterDraggableOptions = {
        handlerClass: 'window-header'
    };

    widgets:Array<any> = [
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

    constructor(private resolver: ComponentFactoryResolver) {
    }

    ngAfterViewInit(): void {
        window.addEventListener('resize', ()=>{
            this.gridster.reload()
        });
    }

    private closeWindow(id: number) {
        this.widgets[id].hidden = true;
        this.swapCurrentWidgetWithLastInColumn(id);
        this.moveEmptyColumn(id);
        this.updateWidgets();
    }

    private updateWidgets() {
        setTimeout(() => {
            this.gridster.reload();
        }, 100);
    }

    private swapCurrentWidgetWithLastInColumn(id: number) {
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

    private moveEmptyColumn(id: number) {
        let isEmptyColumn = true;
        this.widgets.forEach((widget) => {
            if (widget.x === this.widgets[id].x && widget.hidden === false) {
                isEmptyColumn = false;
            }
        });
        if (isEmptyColumn){
            this.widgets.forEach((widget) => {
                if (widget.x > this.widgets[id].x) {
                    widget.x--;
                }
            });
        }
    }

    private selectPeriod(id: number) {

    }

    private printInfo(container: any){
        console.log(container);
        for( let key in container){
            console.log(key + ": " + container);
        }
    }
}