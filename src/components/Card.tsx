
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-200
        ${hoverable ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex gap-2 justify-end ${className}`}>
    {children}
  </div>
);




















































// );  </div>    {children}  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex gap-2 justify-end ${className}`}>}) => (  className = '',  children,export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;  className = '',  children,export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({);  </div>    {children}  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>}) => (  className = '',  children,export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({};  );    </div>      {children}    >      onClick={onClick}      `}        ${className}        ${hoverable ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer transition-all duration-200' : ''}        bg-white rounded-lg shadow-md border border-gray-200      className={`    <div  return (}) => {  hoverable = false,  onClick,  className = '',  children,export const Card: React.FC<CardProps> = ({}  hoverable?: boolean;  onClick?: () => void;  className?: string;  children: React.ReactNode;interface CardProps {
// interface CardProps {
//   children: React.ReactNode;
//   className?: string;
//   onClick?: () => void;
//   hoverable?: boolean;
// }

// export const Card: React.FC<CardProps> = ({
//   children,
//   className = '',
//   onClick,
//   hoverable = false,
// }) => {
//   return (
//     <div
//       className={`
//         bg-white rounded-lg shadow-md border border-gray-200
//         ${hoverable ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer transition-all duration-200' : ''}
//         ${className}
//       `}
//       onClick={onClick}
//     >
//       {children}
//     </div>
//   );
// };

// export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
//   children,
//   className = '',
// }) => (
//   <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
//     {children}
//   </div>
// );

// export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
//   children,
//   className = '',
// }) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

// export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
//   children,
//   className = '',
// }) => (
//   <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex gap-2 justify-end ${className}`}>
//     {children}
//   </div>
// );
