import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export const useAuth = () => {
  const router = useRouter();
  const { data: session } = useSession();

  console.log(`muly:useAuth`, { router, session });

  if (session?.user) {
    let url = String(router.query.redirectedFrom || "/");
    if (url.includes("/auth/")) {
      url = "/";
    }
    // console.log(`muly:useAuth NOT REDIRECT TO HELP DEBUG`, { url });
    void router.replace(url);
    return true;
  }

  return false;
};
