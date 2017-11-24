class StepsJsTools {

    /**
     * Get the scrollTop value
     *
     * Fixed scrollTop not handled properly by chrome or FF
     * @link: https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
     *
     * @return long
     */
    static getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    }

}