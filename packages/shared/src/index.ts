function safeNum(inputValue: unknown): number {
    let res = Number(inputValue);
    if (Number.isNaN(res)) {
        res = 0;
    }
    return res;
}

function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
}

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isObject(value: unknown): value is Record<string, unknown> {
    return (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === '[object Object]'
    );
}

function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (isObject(value)) {
        return Object.keys(value).length === 0;
    }

    return false;
}

function formatNumber(num: number, decimals = 2): string {
    if (!isNumber(num)) {
        return '0';
    }

    // 确保 decimals 是非负整数
    const validDecimals = Math.max(0, Math.floor(decimals));
    const factor = Math.pow(10, validDecimals);
    const rounded = Math.round(num * factor) / factor;
    return rounded.toFixed(validDecimals);
}

export { safeNum, isNumber, isString, isObject, isEmpty, formatNumber };
