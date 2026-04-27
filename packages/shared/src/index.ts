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
    return value !== null && typeof value === 'object' && !Array.isArray(value);
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

    const factor = Math.pow(10, decimals);
    const rounded = Math.round(num * factor) / factor;
    return rounded.toFixed(decimals);
}

export { safeNum, isNumber, isString, isObject, isEmpty, formatNumber };
