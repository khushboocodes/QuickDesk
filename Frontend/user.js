import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { UpgradeRequest } from '@/entities/UpgradeRequest';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, ShieldQuestion } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, requestsData] = await Promise.all([
        User.list(),
        UpgradeRequest.filter({ status: 'pending' })
      ]);
      setUsers(usersData);
      setUpgradeRequests(requestsData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    }
    setIsLoading(false);
  };
  
  const handleRoleChange = async (userId, newRole) => {
    try {
      await User.update(userId, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };
  
  const handleRequest = async (request, newStatus) => {
    try {
      if (newStatus === 'approved') {
        await User.update(request.user_id, { role: request.requested_role });
        setUsers(users.map(u => u.email === request.user_email ? { ...u, role: request.requested_role } : u));
      }
      await UpgradeRequest.update(request.id, { status: newStatus });
      setUpgradeRequests(upgradeRequests.filter(r => r.id !== request.id));
    } catch (error) {
      console.error("Failed to handle request:", error);
    }
  };
  
  if(isLoading) {
    return (
      <Card><CardContent className="p-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader><CardTitle>Upgrade Requests</CardTitle></CardHeader>
        <CardContent>
          {upgradeRequests.length > 0 ? (
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Requested Role</TableHead><TableHead>Reason</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {upgradeRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>{req.user_name} ({req.user_email})</TableCell>
                    <TableCell>{req.requested_role.replace('_', ' ')}</TableCell>
                    <TableCell>{req.reason}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="icon" variant="outline" className="text-green-600" onClick={() => handleRequest(req, 'approved')}><Check className="w-4 h-4"/></Button>
                      <Button size="icon" variant="outline" className="text-red-600" onClick={() => handleRequest(req, 'rejected')}><X className="w-4 h-4"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <ShieldQuestion className="w-12 h-12 mx-auto mb-2"/>
              <p>No pending upgrade requests.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                      <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="end_user">End User</SelectItem>
                        <SelectItem value="support_agent">Support Agent</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}