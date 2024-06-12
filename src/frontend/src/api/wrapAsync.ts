type SuspenderStatus = 'pending' | 'success' | 'error';

export type Suspendable<Args extends Array<unknown> ,Return> = {
  read: (...args: Args) => Return
}

export function wrapAsync<Args extends Array<unknown>, Return>(wrapped: (...args: Args) => Promise<Return>): Suspendable<Args, Return> {
    let status: SuspenderStatus = 'pending'
    let response: Return
    let err: unknown
  
    async function suspender(...args: Args) {
        try {
            response = await wrapped(...args);
            status = 'success';
        } catch(reject) {
            err = reject;
            status = 'error';
        }
        

    }

    const read = (...args: Args) => {
        switch (status) {
          case 'pending':
            throw suspender(...args);
          case 'error':
            throw err;
          default:
            return response;
        }
      }
    
      return { read }
    }