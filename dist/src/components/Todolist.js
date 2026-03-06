import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { TodoItem } from "./Todoitem.js";
export const TodoList = ({ title, todos }) => {
    return (_jsxs("section", { children: [_jsx("h2", { children: title }), _jsx("ul", { children: todos?.map(i => (_jsx(TodoItem, { todo: i }))) })] }));
};
