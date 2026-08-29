// 类型守卫
export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
}

export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === '[object Object]'
    );
}

// 安全转换数字（非法输入兜底为 0）
export function safeNum(inputValue: unknown): number {
    let res = Number(inputValue);
    if (Number.isNaN(res)) {
        res = 0;
    }
    return res;
}

// 检查值是否为空
export function isEmpty(value: unknown): boolean {
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

// 格式化数字
export function formatNumber(num: number, decimals = 2): string {
    if (!isNumber(num)) {
        return '0';
    }
    const validDecimals = Math.max(0, Math.floor(decimals));
    const factor = Math.pow(10, validDecimals);
    const rounded = Math.round(num * factor) / factor;
    return rounded.toFixed(validDecimals);
}
