import imag from './mylog.jpg'
const AuthLayout = ({ children }) => {
  return (
     <div
      style={{ 
        backgroundImage:`url(${imag})`,
        backgroundSize:'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      className="w-full h-screen flex items-center justify-center"
    >
      {/* Dark overlay */}
       <div className=" bg-black/80 backdrop-blur-sm z-0"></div>
      <div
        className="
          relative z-10 w-full max-w-md
          p-10 md:p-16
          rounded-xl
          border-2 border-red-500
          bg-black/70
          shadow-[0_0_20px_red]
          flex flex-col justify-center
        "
      >
        <h1 className="text-2xl font-bold text-red-700 drop-shadow-[0_0_10px_red] mb-2">
          Ace sideDown
        </h1>

        <h3 className="text-xl font-semibold mb-4 text-white">
          Welcome !!!
        </h3>

        <div className="w-full h-px bg-red-500 mb-4"></div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
