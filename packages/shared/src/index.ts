function safeNum(inputValue: unknown) {
    let res = Number(inputValue);
    if (Number.isNaN(res)) {
        res = 0;
    }
    return res;
}

export { safeNum };
