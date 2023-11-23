import { RouterOutputs } from "@/utils/api";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FormEventHandler, useState } from "react";
import { getSession,useSession } from 'next-auth/react';

interface Props {}

const SignUp: NextPage = (props): JSX.Element => {
  const [userInfo, setUserInfo] = useState({ userName: "",email: "", password: "" });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      ...userInfo,
      redirect: false,
    });

    const session = await getSession();
    const session1 = await getSession();
    console.log('Session after login attempt:', session);
    console.log('Session after login attempt:', session1?.user.name);
  };

  return (
    <div className="sign-in-form">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          value={userInfo.userName}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, userName: target.value })
          }
          type="text"
          placeholder="user name"
        />
        <input
          value={userInfo.email}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, email: target.value })
          }
          type="email"
          placeholder="email"
        />
        <input
          value={userInfo.password}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
          type="password"
          placeholder="password"
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default SignUp;
