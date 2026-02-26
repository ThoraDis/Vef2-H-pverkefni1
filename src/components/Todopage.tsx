import type { FC } from 'hono/jsx';

import type { Todo } from '../types.js';
import { TodoList } from './Todolist.js';
import { Layout } from './Layout.js';

type TodoPageProps = {
  todos?: Todo[];
};

export const TodoPage: FC<TodoPageProps> = ({ todos = [] }) => {
  const finished=todos.filter(i=>i.finished)
  const unfinished=todos.filter(i=>!i.finished)

  return (
    <Layout title="TodoListinn">
      <section class="todo-list">
        <form method='post' action="/add">
        <input type="text" name="title" />
        <button>Bæta við</button>
        </form>

        <TodoList title="Allur listinn" todos={todos}/>
        <TodoList title="Kláruð verkefni" todos={finished}/>
        <form method='post' action="/delete/finished">
          <button>Hreinsa verkefni</button>
        </form>
        <TodoList title="ókláruð verkefni" todos={unfinished}/>

        <p>Ég er með {todos.length} verkefni</p>
      </section>
    </Layout>
  );
};
