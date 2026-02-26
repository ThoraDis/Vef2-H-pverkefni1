import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
export function Layout({ title, children }) {
    return (_jsxs("html", { children: [_jsxs("head", { children: [_jsx("title", { children: title }), _jsx("link", { rel: "stylesheet", href: "./styles.css" })] }), _jsx("body", { children: _jsxs("main", { children: [_jsx("nav", { children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/", children: "Fors\u00ED\u00F0a" }) }), _jsx("li", { children: _jsx("a", { href: "/about", children: "Um verkefni\u00F0" }) })] }) }), children] }) })] }));
}
;
