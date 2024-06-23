type ErrorType = 'conflict' | 'notFound';

export type SafeError = { err: ErrorType, msg?: string };

export function isSafeError(obj: unknown): obj is SafeError {
    return 'err' in (obj as SafeError);
}

export function errorMsg(err: SafeError) {
    if(err.msg) {
        return err.msg;
    }

    switch (err.err) {
        case 'conflict':
            return 'Already Downloaded';
        case 'notFound':
            return 'Not Found';
        default:
            return 'Something Went Wrong';
    }
}