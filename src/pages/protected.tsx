import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Protected: NextPage=():JSX.Element=> {
    return <div>this page is protected</div>
}

export default Protected;