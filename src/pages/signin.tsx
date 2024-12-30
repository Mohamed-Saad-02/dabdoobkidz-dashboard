import LoginForm from "../components/auth/LoginForm";
export default function signin() {
  return (
    <div className="flex ">
      <div className=" max-h-full flex-[1] h-screen bg-gray opacity-30"></div>
      <LoginForm />
    </div>
  );
}
