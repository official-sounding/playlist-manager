export function assertNever(x: never) {
    throw new Error(`unexpected value ${x}`);
}

export function assertNeverNoThrow(x: never) {
    console.error(`unexpected value ${x}`);
}
