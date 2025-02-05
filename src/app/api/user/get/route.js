import prisma from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET(req) {
  const session = await getSession(req);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userEmail = session.user.email;
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({
      username: user.name || "Unknown User",
      profile_picture: user.profile_picture || "",
    }),
    { status: 200 }
  );
}
