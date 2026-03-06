import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { TodoList } from './Todolist.js';
import { Layout } from './Layout.js';
export const TodoPage = ({ todos = [] }) => {
    const finished = todos.filter(i => i.finished);
    const unfinished = todos.filter(i => !i.finished);
    return (_jsx(Layout, { title: "TodoListinn", children: _jsxs("section", { class: "todo-list", children: [_jsxs("form", { method: 'post', action: "/add", children: [_jsx("input", { type: "text", name: "title" }), _jsx("button", { children: "B\u00E6ta vi\u00F0" })] }), _jsx(TodoList, { title: "Allur listinn", todos: todos }), _jsx(TodoList, { title: "Kl\u00E1ru\u00F0 verkefni", todos: finished }), _jsx("form", { method: 'post', action: "/delete/finished", children: _jsx("button", { children: "Hreinsa verkefni" }) }), _jsx(TodoList, { title: "\u00F3kl\u00E1ru\u00F0 verkefni", todos: unfinished }), _jsxs("p", { children: ["\u00C9g er me\u00F0 ", todos.length, " verkefni"] })] }) }));
};
