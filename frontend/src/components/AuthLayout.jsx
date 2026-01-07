
const AuthLayout = ({ children }) => {
  return (
     <div
      
      className="w-full h-screen flex items-center justify-center"
    >
      {/* Dark overlay */}
       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
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
