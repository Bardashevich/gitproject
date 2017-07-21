import { OnInit, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
export declare class DashboardComponent implements OnInit {
    private resolver;
    container: ViewContainerRef;
    private innerRef;
    constructor(resolver: ComponentFactoryResolver);
    ngOnInit(): void;
    private components;
    private insertComponent(componentData);
    private getComponentFactory(name);
}
