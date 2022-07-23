export default class PrintElements {
    static print() {
        let hideFromPrintClass = 'pe-no-print';
        let preservePrintClass = 'pe-preserve-print';
        let preserveAncestorClass = 'pe-preserve-ancestor';
        let bodyElementName = 'BODY';

        let _hide = function(element: any) {
            if (!element.classList.contains(preservePrintClass)) {
                element.classList.add(hideFromPrintClass);
            }
        };

        let _preserve = function(element: any, isStartingElement: any) {
            element.classList.remove(hideFromPrintClass);
            element.classList.add(preservePrintClass);
            if (!isStartingElement) {
                element.classList.add(preserveAncestorClass);
            }
        };

        let _clean = function(element: any) {
            element.classList.remove(hideFromPrintClass);
            element.classList.remove(preservePrintClass);
            element.classList.remove(preserveAncestorClass);
        };

        let _walkSiblings = function(element: any, callback: any) {
            var sibling = element.previousElementSibling;
            while (sibling) {
                callback(sibling);
                sibling = sibling.previousElementSibling;
            }
            sibling = element.nextElementSibling;
            while (sibling) {
                callback(sibling);
                sibling = sibling.nextElementSibling;
            }
        };

        let _attachPrintClasses = function(element: any, isStartingElement: any) {
            _preserve(element, isStartingElement);
            _walkSiblings(element, _hide);
        };

        let _cleanup = function(element: any, isStartingElement: any) {
            _clean(element);
            _walkSiblings(element, _clean);
        };

        let _walkTree = function(element: any, callback: any) {
            var currentElement = element;
            callback(currentElement, true);
            currentElement = currentElement.parentElement;
            while (currentElement && currentElement.nodeName !== bodyElementName) {
                callback(currentElement, false);
                currentElement = currentElement.parentElement;
            }
        };

        let _print = function(elements: any) {
            for (var i = 0; i < elements.length; i++) {
                _walkTree(elements[i], _attachPrintClasses);
            }
            window.print();
            for (i = 0; i < elements.length; i++) {
                _walkTree(elements[i], _cleanup);
            }
        };

        return {
            print: _print,
        };
    }
}
