import loginImage from "../assets/images/Image.svg";
import LoginForm from "../components/auth/LoginForm";
export default function signin() {
  return (
    <div className="flex ">
      <div className=" max-h-full flex-[1] h-screen">
        <img
          className="h-full w-full object-cover "
          src={loginImage}
          alt="login-image"
        />
      </div>
      <LoginForm />
    </div>
  );
}
