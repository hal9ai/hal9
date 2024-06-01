export const Floating = ({children, title, href}) => (
  <div
    class="floating">
    {href ? <a href={href}><h1>{title}</h1></a> : (<h1>{title}</h1>)}
    {children}
  </div>
);
