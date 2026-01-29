import { browser } from "$app/environment";
import { error } from "@sveltejs/kit";
import { goto } from "$app/navigation";


export const load = () => {
  if (browser) {
    const user = localStorage.getItem("user");
    if (!user) {
      console.log("Not logged in, redirecting to login");
      goto("/auth/login");
      throw error(401, "Unauthorized");
    }

    const roles = JSON.parse(user).roles || [];
    console.log("User data:", user);
    console.log("User roles:", roles);
    if (!roles.includes("ADMIN")) {
      // console.log("Not an admin, redirecting to home");
      // goto("/auth/login");
      throw error(403, "Access denied");
    }
  }
};