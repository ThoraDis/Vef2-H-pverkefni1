import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Layout } from "./Layout.js";
export function ErrorPage({ children }) {
    return _jsx(Layout, { title: "Villa kom upp", children: children });
}
