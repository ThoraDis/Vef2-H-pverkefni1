import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { TodoPage } from "./components/Todopage.js";
import { createTodo, listTodos, init, updateTodo, getTodo, deleteFinishedTodos, deleteTodo } from "./lib/db.js";
import { AboutPage } from "./components/AboutPage.js";
import { TodoItemSchema } from "./lib/validation.js";
import z from "zod";
import { ErrorPage } from "./components/ErrorPage.js";
// búum til og exportum Hono app
export const app = new Hono();
// sendir út allt sem er í static möppunni
app.use('/*', serveStatic({ root: './static' }));
app.get('/', async (c) => {
    const db = await init();
    if (!db) {
        console.error("Villa kom að gera database");
        return c.text("Villa!");
    }
    const todos = await listTodos();
    if (!todos) {
        console.error("Villa kom að sækja todos", todos);
        return c.text("Villa!");
    }
    return c.html(_jsx(TodoPage, { todos: todos }));
});
app.get('/about', async (c) => {
    return c.html(_jsx(AboutPage, {}));
});
app.post("/add", async (c) => {
    const body = await c.req.parseBody();
    const result = TodoItemSchema.safeParse(body);
    if (!result.success) {
        console.error(z.flattenError(result.error));
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Titill ekki r\u00E9tt formata\u00F0ur!" }) }), 400);
    }
    const dbResult = await createTodo(result.data);
    if (!dbResult) {
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Get ekki vista\u00F0 \u00ED gagnagrunn!" }) }), 500);
    }
    return c.redirect('/');
});
//Uppfæra verkefni sem klárað
app.post("/update/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (id === null) {
        console.error("Ekkert id fyrir verkefni");
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Ekkert id fyrir verkefni!" }) }), 400);
    }
    const todoItem = await getTodo(id);
    if (!todoItem) {
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Verkefni fannst ekki \u00ED database!" }) }), 400);
    }
    const body = await c.req.parseBody();
    const update = {
        id: id,
        title: String(todoItem.title),
        finished: false
    };
    if (body.title !== undefined && typeof body.title === "string") {
        update.title = body.title;
    }
    if (body.finished !== undefined) {
        update.finished = body.finished === 'true';
    }
    else {
        update.finished = todoItem.finished === true;
    }
    TodoItemSchema.safeParse({
        title: update.title,
        finished: update.finished
    });
    const dbResult = await updateTodo(update.id, update.title, update.finished);
    if (!dbResult) {
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Ekki h\u00E6gt a\u00F0 uppf\u00E6ra!" }) }), 500);
    }
    return c.redirect('/');
});
//Eyða öllum kláruðum verkefnum
app.post("/delete/finished", async (c) => {
    const dbResult = await deleteFinishedTodos();
    if (dbResult === 0) {
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Ekki h\u00E6gt a\u00F0 ey\u00F0a!" }) }), 500);
    }
    return c.redirect('/');
});
//Eyða einu verkefni
app.post("/delete/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (id === null) {
        console.error("Ekkert id fyrir verkefni");
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Ekkert id fyrir verkefni!" }) }), 400);
    }
    const dbResult = await deleteTodo(id);
    if (!dbResult) {
        return c.html(_jsx(ErrorPage, { children: _jsx("p", { children: "Ekki h\u00E6gt a\u00F0 ey\u00F0a!" }) }), 500);
    }
    return c.redirect('/');
});
