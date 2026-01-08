import { Input } from '@/shared/Input';
import Image from 'next/image';

const loginInputs = [
  {
    name: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter email',
  },
  {
    name: 'Password',
    type: 'password',
    required: true,
    placeholder: 'Enter password',
  },
];

export default function Login() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="h-fill box-border flex w-[462px] flex-col items-center gap-8 rounded-[var(--main-radius)] bg-[#100F22] p-10 pt-4">
        <div className="flex w-full flex-col items-center justify-center">
          <Image src="../logo/logo.svg" alt="logo" width={96} height={96} />
          <h1>Blaze casino</h1>
          <h2>Welcome!</h2>
          <form className="mt-10 flex w-full flex-col gap-2">
            {loginInputs.map(input => (
              <div
                key={input.name}
                className="flex w-full flex-col justify-center gap-2"
              >
                <label htmlFor={input.name}>{input.name}</label>
                <Input
                  id={input.name}
                  name={input.name}
                  placeholder={input.placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              className="relative mt-8 flex h-12 w-full items-center justify-center rounded-3xl bg-gradient-to-t from-[#FF0047] to-[#FF417B] font-bold text-white transition-shadow duration-300 hover:shadow-[0_0_18px_0_#FF5A8C]"
            >
              Login
              <Image
                src="../logo/login.svg"
                alt="login logo"
                width={32}
                height={32}
                className="absolute right-2"
              />
            </button>
          </form>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <p className="text-[#51A2FF] transition-colors duration-200 hover:text-[#AAD2FF]">
            <a href="/registration">Don`t have an account? Register</a>
          </p>
          <p className="w-full border-t pt-4 text-center text-xs">
            Your account data is stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
