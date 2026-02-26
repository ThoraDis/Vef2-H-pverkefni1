import type { PropsWithChildren } from "hono/jsx";
import { Layout } from "./Layout.js";

export function ErrorPage({children}:PropsWithChildren){
    return <Layout title="Villa kom upp">{children}</Layout>;
}