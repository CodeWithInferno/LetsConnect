// TeamTable.jsx
"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const ACCEPT_MEMBERSHIP_MUTATION = `
  mutation AcceptMembership($projectMemberId: String!) {
    acceptMembership(projectMemberId: $projectMemberId) {
      id
      status
      role
      user {
        id
        name
        email
      }
    }
  }
`;

const REJECT_MEMBERSHIP_MUTATION = `
  mutation RejectMembership($projectMemberId: String!) {
    rejectMembership(projectMemberId: $projectMemberId) {
      success
    }
  }
`;

export default function TeamTable({ members = [], onRefresh }) {
  const [loadingActionId, setLoadingActionId] = useState(null);

  async function handleApprove(memberId) {
    try {
      setLoadingActionId(memberId);
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: ACCEPT_MEMBERSHIP_MUTATION,
          variables: { projectMemberId: memberId },
        }),
      });
      const json = await res.json();
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      // ✅ Refresh data in the parent
      onRefresh?.();
    } catch (err) {
      console.error("Error approving membership:", err);
      alert(err.message);
    } finally {
      setLoadingActionId(null);
    }
  }

  async function handleReject(memberId) {
    try {
      setLoadingActionId(memberId);
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: REJECT_MEMBERSHIP_MUTATION,
          variables: { projectMemberId: memberId },
        }),
      });
      const json = await res.json();
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      // ✅ Refresh data in the parent
      onRefresh?.();
    } catch (err) {
      console.error("Error rejecting membership:", err);
      alert(err.message);
    } finally {
      setLoadingActionId(null);
    }
  }

  // If no members at all:
  if (members.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No team members found
      </div>
    );
  }

  return (
    <div className="rounded-lg border dark:border-gray-800">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status / Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isPending = member.status === "PENDING";
            const isRowLoading = loadingActionId === member.id;

            return (
              <TableRow
                key={member.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <img
                    src={member.user.profile_picture}
                    alt={member.user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                    </div>
                    {member.user.name || "(No Name)"}
                  </div>
                </TableCell>

                <TableCell>{member.user.email}</TableCell>

                <TableCell>
                  {isPending ? (
                    <span className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs">
                      PENDING
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs">
                      {member.role}
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isPending ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleApprove(member.id)}
                            className="text-green-600"
                          >
                            {isRowLoading ? "Approving..." : "Approve"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReject(member.id)}
                            className="text-red-600"
                          >
                            {isRowLoading ? "Rejecting..." : "Reject"}
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Remove
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
