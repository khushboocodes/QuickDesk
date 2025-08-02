
import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { UpgradeRequest } from '@/entities/UpgradeRequest';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadFile } from "@/integrations/Core";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"; // Added this import
import { Shield, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', department: '', phone: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [upgradeRequest, setUpgradeRequest] = useState({ role: 'support_agent', reason: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        department: userData.department || '',
        phone: userData.phone || '',
      });
    } catch (error) {
      console.error("Failed to load user", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ avatar_url: file_url });
      setUser(prev => ({ ...prev, avatar_url: file_url }));
      setFeedback({ type: 'success', message: 'Avatar updated successfully!' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to upload avatar.' });
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to update profile.' });
    }
    setIsSaving(false);
  };
  
  const handleRequestUpgrade = async () => {
    if (!upgradeRequest.reason) {
      setFeedback({ type: 'error', message: 'Please provide a reason for the upgrade.' });
      return;
    }
    
    try {
      await UpgradeRequest.create({
        user_email: user.email,
        user_name: user.full_name || user.email.split('@')[0],
        current_role: user.role,
        requested_role: upgradeRequest.role,
        reason: upgradeRequest.reason
      });
      setFeedback({ type: 'success', message: 'Upgrade request submitted successfully! An admin will review it shortly.' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to submit upgrade request.' });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2"><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-24" /></div>
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) return <div>User not found.</div>;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">My Profile</h1>
        
        {feedback.message && (
          <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'} className="mb-6 bg-white">
            <AlertTitle>{feedback.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-600">
                      {user.full_name ? user.full_name[0] : user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer">
                    {isUploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div> : <Sparkles className="h-4 w-4 text-emerald-500" />}
                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.full_name || 'New User'}</p>
                  <p className="text-slate-500">{user.email}</p>
                  <Badge className="mt-2">{user.role.replace('_', ' ').toUpperCase()}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={formData.full_name} onChange={handleInputChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={formData.department} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
