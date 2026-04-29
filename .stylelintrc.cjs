// Stylelint configuration for Vue H5 project
// Compatible with Node >= 14.18

module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
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
    },
};
