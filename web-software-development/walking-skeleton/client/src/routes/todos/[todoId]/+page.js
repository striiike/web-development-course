import { redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";

export const load = ({ params }) => {
  if (browser) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect(307, "/auth/login");
    }
  }

  const todoId = parseInt(params.todoId);
  return { todoId };
}
