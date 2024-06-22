import { useContext } from "react";
import { ConfigContext } from "./ConfigProvider";

export function useConfigValues() {
    const { config } = useContext(ConfigContext);
    return config;
}

export function useConfigWithEdit() {
    const { config, dispatch } = useContext(ConfigContext);
    return [config, dispatch];
}