"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Imported from your ui/select folder (shadcn UI style):
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// The 3 roles from your enum
const PROJECT_ROLES = ["OWNER", "ADMINISTRATOR", "MEMBER"];

export default function InviteMemberModal({
  open,
  onOpenChange,
  onInvite, // callback function
  loading = false,
  error = "",
  defaultRole = "MEMBER",
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(defaultRole);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the email + role up to the parent
    onInvite(inviteEmail.trim(), inviteRole);
  };

  const closeModal = () => {
    // Clear states if you like
    setInviteEmail("");
    setInviteRole(defaultRole);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Email Field */}
          <div>
            <Label htmlFor="inviteEmail">Email</Label>
            <Input
              id="inviteEmail"
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <Label>Role</Label>
            <Select
              value={inviteRole}
              onValueChange={(val) => setInviteRole(val)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
