export function serialize(form: HTMLFormElement): Record<string, string> {
    const data = new FormData(form);

    const pairs: Record<string, string> = {};

    for (const [name, value] of data) {
        if (typeof value === 'string') pairs[name] = value;
    }

    return pairs;
}
