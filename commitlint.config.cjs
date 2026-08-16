/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // 项目使用中文提交描述，不限制 subject 大小写
        'subject-case': [0],
    },
};
