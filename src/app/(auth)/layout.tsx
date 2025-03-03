const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full  flex items-center justify-center ">
      <div className="h-full w-full md:h-auto md:w-[420px]">{children}</div>
    </div>
  );
};

export default AuthLayout;
