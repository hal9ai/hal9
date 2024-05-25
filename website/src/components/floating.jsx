export const Floating = ({children, title}) => (
  <div
    style={{
      borderRadius: '2px',
      padding: '0.2rem',
      width: '20%',
      margin: '2%',
      minWidth: '180px',
      display: 'inline-block',
      verticalAlign: 'top'
    }}>
    <h1>{title}</h1>
    {children}
  </div>
);
