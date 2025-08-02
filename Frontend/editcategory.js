import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditCategoryDialog({ category, onSave, onClose }) {
  const [editedCategory, setEditedCategory] = useState(category);

  const handleSave = () => {
    onSave(editedCategory);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category: {category.name}</DialogTitle>
          <DialogDescription>
            Update the details for this category.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={editedCategory.name} onChange={e => setEditedCategory(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={editedCategory.description} onChange={e => setEditedCategory(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon Name (lucide-react)</Label>
            <Input id="icon" value={editedCategory.icon} onChange={e => setEditedCategory(p => ({ ...p, icon: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color (Hex)</Label>
            <div className="flex items-center gap-2">
              <Input id="color" value={editedCategory.color} onChange={e => setEditedCategory(p => ({ ...p, color: e.target.value }))} />
              <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: editedCategory.color }} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}