"use client";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Dashboard/Layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // This map tracks which notifications are currently “in progress” 
  // (either accepting or rejecting).
  const [processing, setProcessing] = useState({});

  // 1. Check if user is logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  // 2. Once user is known, fetch notifications
  useEffect(() => {
    if (!userLoading && user) {
      fetchNotifications();
    }
  }, [user, userLoading]);

  /**
   * Fetches all notifications for the current user
   */
  async function fetchNotifications() {
    try {
      setLoading(true);
      const query = `
        query {
          myNotifications {
            id
            message
            createdAt
            read
            type
            projectMemberId
          }
        }
      `;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query }),
      });
      const { data, errors } = await res.json();
      if (errors?.length) {
        throw new Error(errors[0].message);
      }
      if (data?.myNotifications) {
        setNotifications(data.myNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Calls the "acceptMembership" mutation
   */
  async function acceptInvite(notifId, projectMemberId) {
    // Mark this notification as “processing”
    setProcessing((prev) => ({ ...prev, [notifId]: true }));

    try {
      const mutation = `
        mutation AcceptMembership($id: String!) {
          acceptMembership(projectMemberId: $id) {
            id
            status
          }
        }
      `;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: mutation,
          variables: { id: projectMemberId },
        }),
      });
      const { data, errors } = await res.json();
      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      // Once accepted, refetch to update the notifications
      await fetchNotifications();
    } catch (err) {
      console.error("Error accepting invite:", err);
    } finally {
      // Clear the processing state for this notification
      setProcessing((prev) => {
        const updated = { ...prev };
        delete updated[notifId];
        return updated;
      });
    }
  }

  /**
   * Calls the "rejectMembership" mutation
   */
  async function rejectInvite(notifId, projectMemberId) {
    // Mark this notification as “processing”
    setProcessing((prev) => ({ ...prev, [notifId]: true }));

    try {
      const mutation = `
        mutation RejectMembership($id: String!) {
          rejectMembership(projectMemberId: $id) {
            success
          }
        }
      `;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: mutation,
          variables: { id: projectMemberId },
        }),
      });
      const { data, errors } = await res.json();
      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      if (data.rejectMembership.success) {
        // Once rejected, refetch the notifications
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Error rejecting invite:", err);
    } finally {
      // Clear the processing state
      setProcessing((prev) => {
        const updated = { ...prev };
        delete updated[notifId];
        return updated;
      });
    }
  }

  // Show a spinner while loading
  if (userLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </Layout>
    );
  }

  // 3. Render
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You have no notifications.
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => {
              const isProcessing = !!processing[notif.id];

              return (
                <Card key={notif.id} className="dark:bg-gray-800">
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notif.message}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>

                    {/* If it's an INVITE and not read, show Accept/Reject */}
                    {!notif.read &&
                      notif.type === "INVITE" &&
                      notif.projectMemberId && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() =>
                              acceptInvite(notif.id, notif.projectMemberId)
                            }
                          >
                            {isProcessing ? "Processing..." : "Accept"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() =>
                              rejectInvite(notif.id, notif.projectMemberId)
                            }
                          >
                            {isProcessing ? "Processing..." : "Reject"}
                          </Button>
                        </div>
                      )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
