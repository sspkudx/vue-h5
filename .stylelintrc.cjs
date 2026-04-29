// Stylelint configuration for Vue H5 project
// Compatible with Node >= 14.18

module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended-less', 'stylelint-config-recommended-vue'],
    plugins: ['stylelint-less'],
    rules: {
        // Disable rules that conflict with Vue
        'selector-pseudo-class-no-unknown': null,
        'selector-type-no-unknown': null,

        // Disable rules that conflict with CSS modules
        'selector-class-pattern': null,

        // Disable rules that are too strict
        'no-descending-specificity': null,
        'declaration-block-single-line-max-declarations': null,

        // Allow both single and double quotes for flexibility
        'string-quotes': null,

        // Fix invalid option error
        'declaration-block-no-duplicate-properties': [
            true,
            {
                ignore: ['consecutive-duplicates'],
            },
        ],

        // Fix unknown rule errors - these rules might not exist in stylelint v14
        // Using false instead of null to completely disable them
        'media-query-no-invalid': false,
        'selector-anb-no-unmatchable': false,

        // Allow mpx unit for postcss-px-to-viewport conversion
        'unit-no-unknown': [
            true,
            {
                ignoreUnits: ['mpx'],
            },
        ],

        // Set indentation to 4 spaces to match prettier config
        indentation: 4,
        'media-query-no-invalid': null,
        'selector-anb-no-unmatchable': null,
    },
};
