import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { TodoPage } from "./components/Todopage.js";
import { createTodo, listTodos, init, updateTodo, getTodo, deleteFinishedTodos, deleteTodo} from "./lib/db.js";
import { AboutPage } from "./components/AboutPage.js";
import { TodoItemSchema } from "./lib/validation.js";
import z from "zod";
import { ErrorPage } from "./components/ErrorPage.js";
// búum til og exportum Hono app
export const app = new Hono();
//cloudinary leiðbeiningar: 
// - cloudinary --> image --> getting started
// - https://www.youtube.com/watch?v=2Z1oKtxleb4
import { v2 as cloudinary } from 'cloudinary';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dsfjdk2rt', 
        api_key: '817145963542165', 
        //api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
        api_secret: 'PNBEN5KM9biVRG-xZaSmBV_diMc'
      });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();

//TODO: 
/*vantar fyrir cloudinary:
1. hlaða upp myndir. app.post('/upload')
2. ná myndir app.get('/images/:id')
*/
app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  // Access files or fields: body['file']
  console.log(body['file']) 
  return c.json({ message: 'File uploaded' })
})


// sendir út allt sem er í static möppunni
app.use('/*', serveStatic({ root: './static' }));

app.get('/', async (c) => {
  const db = await init();

  if(!db){
    console.error("Villa kom að gera database");
    return c.text("Villa!");

  }
  const todos = await listTodos();

  if(!todos){
    console.error("Villa kom að sækja todos", todos);
    return c.text("Villa!");
  }

  return c.html(<TodoPage todos={todos}></TodoPage>);
});

app.get('/about', async (c) => {
  return c.html(<AboutPage/>);
});

app.post("/add",async (c) => {
  const body = await c.req.parseBody();

  const result = TodoItemSchema.safeParse(body);

  if(!result.success){
    console.error(z.flattenError(result.error));
    return c.html(
      <ErrorPage>
        <p>Titill ekki rétt formataður!</p>
      </ErrorPage>,
      400,
    );
  }

  const dbResult = await createTodo(result.data);

    if(!dbResult){
    return c.html(
      <ErrorPage>
        <p>Get ekki vistað í gagnagrunn!</p>
      </ErrorPage>,
      500,
    );
  }
  return c.redirect('/');
});

//Uppfæra verkefni sem klárað
app.post("/update/:id",async (c) => {
  const id = Number(c.req.param("id"));

  if(id===null){
      console.error("Ekkert id fyrir verkefni");
    return c.html(
      <ErrorPage>
        <p>Ekkert id fyrir verkefni!</p>
      </ErrorPage>,
      400,
    );
  }

  const todoItem = await getTodo(id)

  if(!todoItem){
    return c.html(
      <ErrorPage>
        <p>Verkefni fannst ekki í database!</p>
      </ErrorPage>,
      400,
    );
  }

  const body = await c.req.parseBody();

   const update={
    id: id,
    title:String(todoItem.title),
    finished:todoItem.finished===true

  }

  if(body.title!==undefined && typeof body.title==="string"){
    update.title=body.title
    
  }

  if(body.finished!==undefined){
    update.finished=body.finished==='true'
  }

  const result = TodoItemSchema.safeParse({
      title: update.title,
      finished: update.finished});

  if(!result.success){
    console.error(z.flattenError(result.error));
    return c.html(
      <ErrorPage>
        <p>Titill ekki rétt formataður!</p>
      </ErrorPage>,
      400,
    );
  }

  const dbResult = await updateTodo(update.id,update.title,update.finished);

  if(!dbResult){
    return c.html(
      <ErrorPage>
        <p>Ekki hægt að uppfæra!</p>
      </ErrorPage>,
      500,
    );
  }

  return c.redirect('/');
});

//Eyða öllum kláruðum verkefnum
app.post("/delete/finished",async (c) => {

   const dbResult = await deleteFinishedTodos();

     if(dbResult===0 ){
    return c.html(
      <ErrorPage>
        <p>Ekki hægt að eyða!</p>
      </ErrorPage>,
      500,
    );
  }
  return c.redirect('/');

});

//Eyða einu verkefni
app.post("/delete/:id",async (c) => {

    const id = Number(c.req.param("id"));

  if(id===null){
      console.error("Ekkert id fyrir verkefni");
    return c.html(
      <ErrorPage>
        <p>Ekkert id fyrir verkefni!</p>
      </ErrorPage>,
      400,
    );
  }

  const dbResult = await deleteTodo(id);

  if(!dbResult){
    return c.html(
      <ErrorPage>
        <p>Ekki hægt að eyða!</p>
      </ErrorPage>,
      500,
    );
  }
  return c.redirect('/');
});