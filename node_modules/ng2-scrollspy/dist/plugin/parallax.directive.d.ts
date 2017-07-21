import { ElementRef, Renderer, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ScrollSpyService } from '../index';
export interface ScrollSpyParallaxOptions {
    spyId?: string;
    horizontal?: boolean;
    cssKey?: string;
    property?: string;
    ratio?: number;
    initValue?: number;
    max?: number;
    min?: number;
    unit?: string;
    axis?: string;
}
export declare class ScrollSpyParallaxDirective implements OnInit, AfterViewInit, OnDestroy {
    private renderer;
    private elRef;
    private scrollSpy;
    options: ScrollSpyParallaxOptions;
    scrollSpyParallaxDisabled: boolean;
    cssValue: string;
    isSpecialVal: boolean;
    defaultOptions: ScrollSpyParallaxOptions;
    scrollStream$: any;
    el: HTMLElement;
    constructor(renderer: Renderer, elRef: ElementRef, scrollSpy: ScrollSpyService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    evaluateScroll(target: any): void;
    ngOnDestroy(): void;
}
