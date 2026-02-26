import type { PropsWithChildren } from "hono/jsx";

type Props ={
    title: string;
};

export function Layout({title, children}: PropsWithChildren<Props>){
    return(
        <html>
            <head>
                <title>{title}</title>
                <link rel="stylesheet" href="/styles.css"></link>
            </head>
            <body>
                <main>
                    <nav>
                        <ul>
                            <li>
                                <a href="/">Forsíða</a>
                            </li>
                            <li> 
                                <a href="/about">Um verkefnið</a>
                            </li>
                        </ul>
                    </nav>
                    {children}
                </main>
            </body>
        </html>
    );
};