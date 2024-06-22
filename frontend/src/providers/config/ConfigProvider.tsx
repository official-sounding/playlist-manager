import { useReducer, createContext, PropsWithChildren, Reducer, Dispatch } from "react";


export type Config = {
    showThumbnails: boolean
};

type Actions = { type: 'updateShowThumbnail', value: boolean };

type ConfigContextValue = {
    config: Config,
    dispatch: Dispatch<Actions>
}

const initial: Config = { showThumbnails: true };

const reducer: Reducer<Config, Actions> = (prev = initial, action) => {
    switch(action.type) {
        case 'updateShowThumbnail': {
            return { ... prev, showThumbnails: action.value };
        }
    }
}

export const ConfigContext = createContext<ConfigContextValue>({ config: initial, dispatch: () => {}});


export function ConfigProvider({ children }: PropsWithChildren) {

    const [config, dispatch] = useReducer(reducer, initial);

    return <ConfigContext.Provider value={{ config, dispatch }} >{children}</ConfigContext.Provider>
}