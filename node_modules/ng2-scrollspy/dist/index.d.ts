import { ModuleWithProviders, OpaqueToken } from '@angular/core';
import { ScrollSpyService } from './core/service';
export * from './core/service';
export * from './core/window.directive';
export * from './core/element.directive';
export * from './plugin/index.service';
export declare const NG2SCROLLSPY_FORROOT_GUARD: OpaqueToken;
export declare function provideForRootGuard(scrollSpyService: ScrollSpyService): any;
export declare class ScrollSpyModule {
    constructor(guard: any);
    static forRoot(): ModuleWithProviders;
}
