import type { FC } from "hono/jsx";
import type { Todo } from "../types.js";


type Props={
    todo:Todo;
};

export const TodoItem: FC<Props> =({todo}) =>{
    return(
        <li>
            <form method='post' action={`/update/${todo.id}`}>
            <input type="text" name="title" value={`${todo.title}`}></input>
            </form>

            {!todo.finished && (
                <form method='post' action={`/update/${todo.id}`}>
                <button type="submit" name="finished" value="true">Klárað</button>
                </form>
            )}

            {todo.finished && (
                <form method='post' action={`/update/${todo.id}`}>
                <button type="submit" name="finished" value="false">Ókláruð</button>
                </form>
            )}

            <form method='post' action={`/delete/${todo.id}`}>
                <button>Eyða</button>
            </form>
        </li>

    );
};