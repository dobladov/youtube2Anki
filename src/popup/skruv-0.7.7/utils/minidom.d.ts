export class Element {
    /** @param {string} nodeName */
    constructor(nodeName?: string);
    /** @type {Element[]} */
    childNodes: Element[];
    /** @type {{ [key: string]: string; }} */
    attributes: {
        [key: string]: string;
    };
    /** @type {Element?} */
    parentNode: Element | null;
    /** @type {{ [key: string]: function[]; }} */
    eventListeners: {
        [key: string]: Function[];
    };
    ownerDocument: {
        /** @type {HTMLElement?} */
        documentElement: HTMLElement | null;
        /**
         * @param {string} data
         * @returns {HTMLElement}
         */
        createComment: (data: string) => HTMLElement;
        /**
         * @param {string} data
         * @returns {Text}
         */
        createTextNode: (data: string) => Text;
        /**
         * @param {htmlNS|svgNS|mathmlNS} ns
         * @param {string} nodeName
         * @returns {Element}
         */
        createElementNS: (ns: "http://www.w3.org/1999/xhtml" | "http://www.w3.org/2000/svg" | "http://www.w3.org/1998/Math/MathML", nodeName: string) => Element;
        querySelector: () => null;
        querySelectorAll: () => never[];
    };
    nodeName: string;
    data: string;
    isSvg: boolean;
    /**
     * @param {Element} newNode
     * @param {Element} oldNode
     */
    replaceChild(newNode: Element, oldNode: Element): void;
    /** @param {Element} node */
    appendChild(node: Element): void;
    /** @param {Element} node */
    removeChild(node: Element): void;
    /**
     * @param {Element} newNode
     * @param {Element} oldNode
     */
    insertBefore(newNode: Element, oldNode: Element): void;
    replaceChildren(): void;
    /** @param {string | number} name */
    getAttribute(name: string | number): string;
    /** @param {string | number} name */
    removeAttribute(name: string | number): void;
    getAttributeNames(): string[];
    /**
     * @param {string | number} name
     * @param {any} value
     */
    setAttribute(name: string | number, value: any): void;
    /**
     * @param {string | number} name
     * @param {Function} value
     */
    removeEventListener(name: string | number, value: Function): void;
    /**
     * @param {string | number} name
     * @param {function} value
     */
    addEventListener(name: string | number, value: Function): void;
    /** @param {Event} event */
    dispatchEvent(event: Event): void;
    /** @param {Element} node */
    contains(node: Element): boolean;
    /** @returns {Element} */
    cloneNode(): Element;
    get children(): Element[];
    get innerHTML(): string;
    set textContent(arg: string);
    get textContent(): string;
}
export class HTMLElement extends Element {
}
export class SVGElement extends Element {
}
export class AtomElement extends Element {
}
export class SitemapElement extends Element {
}
export class MathMLElement extends Element {
}
export class HTMLOptionElement extends HTMLElement {
}
export class HTMLInputElement extends HTMLElement {
}
export class Text extends Element {
}
export class Comment extends Element {
}
export class Location extends URL {
    get ancestorOrigins(): {
        length: number;
        item: () => null;
        contains: () => boolean;
        [Symbol.iterator]: () => Generator<never, void, unknown>;
    };
    /** @param {string|URL} url */
    assign(url: string | URL): void;
    reload(): void;
    /** @param {string|URL} url */
    replace(url: string | URL): void;
}
export class EventSource {
    /**
     * @param {URL | string} _url
     * @param {EventSourceInit} [_init]
     */
    constructor(_url: URL | string, _init?: EventSourceInit | undefined);
    CONNECTING: number;
    OPEN: number;
    CLOSED: number;
    addEventListener(): void;
    close(): void;
}
export function reset(): void;
export function getContext(): {
    document: {
        /** @type {HTMLElement?} */
        documentElement: HTMLElement | null;
        /**
         * @param {string} data
         * @returns {HTMLElement}
         */
        createComment: (data: string) => HTMLElement;
        /**
         * @param {string} data
         * @returns {Text}
         */
        createTextNode: (data: string) => Text;
        /**
         * @param {htmlNS|svgNS|mathmlNS} ns
         * @param {string} nodeName
         * @returns {Element}
         */
        createElementNS: (ns: "http://www.w3.org/1999/xhtml" | "http://www.w3.org/2000/svg" | "http://www.w3.org/1998/Math/MathML", nodeName: string) => Element;
        querySelector: () => null;
        querySelectorAll: () => never[];
    };
    EventSource: typeof EventSource;
    Location: typeof Location;
    URL: {
        new (url: string | URL, base?: string | URL | undefined): URL;
        prototype: URL;
        createObjectURL(obj: Blob | MediaSource): string;
        revokeObjectURL(url: string): void;
    };
    Element: typeof Element;
    HTMLOptionElement: typeof HTMLOptionElement;
    HTMLInputElement: typeof HTMLInputElement;
    SVGElement: typeof SVGElement;
    HTMLElement: typeof HTMLElement;
    MathMLElement: typeof MathMLElement;
    Text: typeof Text;
    Comment: typeof Comment;
    CSSOM: {
        CSSStyleDeclaration: {
            new (): {
                length: number;
                parentRule: any;
                _importants: {};
                getPropertyValue(name: string): string;
                setProperty(name: string, value: string, priority?: string | undefined): void;
                removeProperty(name: string): string;
                getPropertyCSSValue(): void;
                getPropertyPriority(name: string): any;
                getPropertyShorthand(): void;
                isPropertyImplicit(): void;
                cssText: string;
            };
        };
        CSSRule: {
            new (): {
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSGroupingRule: {
            new (): {
                cssRules: any[];
                insertRule(rule: string, index?: number | undefined): number;
                deleteRule(index: number): void;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSConditionRule: {
            new (): {
                conditionText: string;
                cssRules: any[];
                cssText: any;
                insertRule(rule: string, index?: number | undefined): number;
                deleteRule(index: number): void;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSStyleRule: {
            new (): {
                selectorText: string;
                style: {
                    length: number;
                    parentRule: any;
                    _importants: {};
                    getPropertyValue(name: string): string;
                    setProperty(name: string, value: string, priority?: string | undefined): void;
                    removeProperty(name: string): string;
                    getPropertyCSSValue(): void;
                    getPropertyPriority(name: string): any;
                    getPropertyShorthand(): void;
                    isPropertyImplicit(): void;
                    cssText: string;
                };
                type: number;
                cssText: string;
                parse(ruleText: string): any;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        MediaList: {
            new (): {
                length: number;
                mediaText: string;
                appendMedium(medium: string): void;
                deleteMedium(medium: string): void;
            };
        };
        CSSMediaRule: {
            new (): {
                media: {
                    length: number;
                    mediaText: string;
                    appendMedium(medium: string): void;
                    deleteMedium(medium: string): void;
                };
                type: number;
                conditionText: string;
                readonly cssText: string;
                cssRules: any[];
                insertRule(rule: string, index?: number | undefined): number;
                deleteRule(index: number): void;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSSupportsRule: {
            new (): {
                type: number;
                readonly cssText: string;
                conditionText: string;
                cssRules: any[];
                insertRule(rule: string, index?: number | undefined): number;
                deleteRule(index: number): void;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSImportRule: {
            new (): {
                href: string;
                media: {
                    length: number;
                    mediaText: string;
                    appendMedium(medium: string): void;
                    deleteMedium(medium: string): void;
                };
                styleSheet: {
                    cssRules: any[];
                    insertRule(rule: string, index: number): number;
                    deleteRule(index: number): void;
                    toString(): string;
                    parentStyleSheet: any;
                };
                type: number;
                cssText: string;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSFontFaceRule: {
            new (): {
                style: {
                    length: number;
                    parentRule: any;
                    _importants: {};
                    getPropertyValue(name: string): string;
                    setProperty(name: string, value: string, priority?: string | undefined): void;
                    removeProperty(name: string): string;
                    getPropertyCSSValue(): void;
                    getPropertyPriority(name: string): any;
                    getPropertyShorthand(): void;
                    isPropertyImplicit(): void;
                    cssText: string;
                };
                type: number;
                readonly cssText: string;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSHostRule: {
            new (): {
                cssRules: any[];
                type: number;
                readonly cssText: string;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        StyleSheet: {
            new (): {
                parentStyleSheet: any;
            };
        };
        CSSStyleSheet: {
            new (): {
                cssRules: any[];
                insertRule(rule: string, index: number): number;
                deleteRule(index: number): void;
                toString(): string;
                parentStyleSheet: any;
            };
        };
        CSSKeyframesRule: {
            new (): {
                name: string;
                cssRules: any[];
                type: number;
                readonly cssText: string;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSKeyframeRule: {
            new (): {
                keyText: string;
                style: {
                    length: number;
                    parentRule: any;
                    _importants: {};
                    getPropertyValue(name: string): string;
                    setProperty(name: string, value: string, priority?: string | undefined): void;
                    removeProperty(name: string): string;
                    getPropertyCSSValue(): void;
                    getPropertyPriority(name: string): any;
                    getPropertyShorthand(): void;
                    isPropertyImplicit(): void;
                    cssText: string;
                };
                type: number;
                readonly cssText: string;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        MatcherList: {
            new (): {
                length: number;
                matcherText: string;
                appendMatcher(matcher: string): void;
                deleteMatcher(matcher: string): void;
            };
        };
        CSSDocumentRule: {
            new (): {
                matcher: {
                    length: number;
                    matcherText: string;
                    appendMatcher(matcher: string): void;
                    deleteMatcher(matcher: string): void;
                };
                cssRules: any[];
                type: number;
                readonly cssText: string;
                parentRule: any;
                parentStyleSheet: any;
                UNKNOWN_RULE: number;
                STYLE_RULE: number;
                CHARSET_RULE: number;
                IMPORT_RULE: number;
                MEDIA_RULE: number;
                FONT_FACE_RULE: number;
                PAGE_RULE: number;
                KEYFRAMES_RULE: number;
                KEYFRAME_RULE: number;
                MARGIN_RULE: number;
                NAMESPACE_RULE: number;
                COUNTER_STYLE_RULE: number;
                SUPPORTS_RULE: number;
                DOCUMENT_RULE: number;
                FONT_FEATURE_VALUES_RULE: number;
                VIEWPORT_RULE: number;
                REGION_STYLE_RULE: number;
            };
        };
        CSSValue: {
            new (): {
                cssText: void;
                _getConstructorName(): string;
            };
        };
        CSSValueExpression: {
            new (token: any, idx: any): {
                _token: any;
                _idx: any;
                parse(): Object;
                _parseJSComment(token: any, idx: any): false | Object;
                _parseJSString(token: any, idx: any, sep: any): false | Object;
                _parseJSRexExp(token: any, idx: any): false | Object;
                _findMatchedIdx(token: any, idx: any, sep: any): number;
                cssText: void;
                _getConstructorName(): string;
            };
        };
        parse: (token: string) => {
            cssRules: any[];
            insertRule(rule: string, index: number): number;
            deleteRule(index: number): void;
            toString(): string;
            parentStyleSheet: any;
        };
        clone: (stylesheet: {
            cssRules: any[];
            insertRule(rule: string, index: number): number;
            deleteRule(index: number): void;
            toString(): string;
            parentStyleSheet: any;
        }) => {
            cssRules: any[];
            insertRule(rule: string, index: number): number;
            deleteRule(index: number): void;
            toString(): string;
            parentStyleSheet: any;
        };
    };
    CSSMediaRule: {
        new (): {
            media: {
                length: number;
                mediaText: string;
                appendMedium(medium: string): void;
                deleteMedium(medium: string): void;
            };
            type: number;
            conditionText: string;
            readonly cssText: string;
            cssRules: any[];
            insertRule(rule: string, index?: number | undefined): number;
            deleteRule(index: number): void;
            parentRule: any;
            parentStyleSheet: any;
            UNKNOWN_RULE: number;
            STYLE_RULE: number;
            CHARSET_RULE: number;
            IMPORT_RULE: number;
            MEDIA_RULE: number;
            FONT_FACE_RULE: number;
            PAGE_RULE: number;
            KEYFRAMES_RULE: number;
            KEYFRAME_RULE: number;
            MARGIN_RULE: number;
            NAMESPACE_RULE: number;
            COUNTER_STYLE_RULE: number;
            SUPPORTS_RULE: number;
            DOCUMENT_RULE: number;
            FONT_FEATURE_VALUES_RULE: number;
            VIEWPORT_RULE: number;
            REGION_STYLE_RULE: number;
        };
    };
    CSSStyleRule: {
        new (): {
            selectorText: string;
            style: {
                length: number;
                parentRule: any;
                _importants: {};
                getPropertyValue(name: string): string;
                setProperty(name: string, value: string, priority?: string | undefined): void;
                removeProperty(name: string): string;
                getPropertyCSSValue(): void;
                getPropertyPriority(name: string): any;
                getPropertyShorthand(): void;
                isPropertyImplicit(): void;
                cssText: string;
            };
            type: number;
            cssText: string;
            parse(ruleText: string): any;
            parentRule: any;
            parentStyleSheet: any;
            UNKNOWN_RULE: number;
            STYLE_RULE: number;
            CHARSET_RULE: number;
            IMPORT_RULE: number;
            MEDIA_RULE: number;
            FONT_FACE_RULE: number;
            PAGE_RULE: number;
            KEYFRAMES_RULE: number;
            KEYFRAME_RULE: number;
            MARGIN_RULE: number;
            NAMESPACE_RULE: number;
            COUNTER_STYLE_RULE: number;
            SUPPORTS_RULE: number;
            DOCUMENT_RULE: number;
            FONT_FEATURE_VALUES_RULE: number;
            VIEWPORT_RULE: number;
            REGION_STYLE_RULE: number;
        };
    };
    isSkruvSSR: boolean;
    setTimeout: typeof setTimeout;
    addEventListener: () => void;
};
export function toHTML(vDom: HTMLElement, context: string, headers: {
    [key: string]: string;
}): string;
export function toText(vDom: HTMLElement): string;
