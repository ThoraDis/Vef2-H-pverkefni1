import type { FC } from "hono/jsx";
import type { Todo } from "../types.js";
import { TodoItem } from "./Todoitem.js";

type Props={
    title:string;
    todos?:Todo[];
};

export const TodoList: FC<Props> =({title, todos}) =>{
    return(
        <section>
            <h2>{title}</h2>
            <ul>
                {todos?.map( i=>(
                    <TodoItem todo={i}/>
                ))}
            </ul>
        </section>
    );
};