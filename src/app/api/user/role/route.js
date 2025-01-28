// File: /pages/api/user/role.js (Pages Router) OR /app/api/user/role/route.js (App Router)
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma"; // or wherever your Prisma client is imported

export default withApiAuthRequired(async function roleHandler(req, res) {
  try {
    const session = await getSession(req, res);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const userEmail = session.user.email;

    const userInDb = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!userInDb) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ role: userInDb.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});
