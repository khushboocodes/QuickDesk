
import React, { useState, useEffect } from 'react';
import { Category } from '@/entities/Category';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit } from 'lucide-react';
import EditCategoryDialog from './EditCategoryDialog';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#10b981', icon: 'Tag' });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await Category.list();
    setCategories(data);
  };

  const handleCreate = async () => {
    if (!newCategory.name) return;
    await Category.create(newCategory);
    setNewCategory({ name: '', description: '', color: '#10b981', icon: 'Tag' });
    loadCategories();
  };
  
  const handleUpdate = async (updatedData) => {
    if (!editingCategory) return; // Ensure an category is actually being edited
    const { id, ...data } = updatedData;
    await Category.update(id, data);
    setEditingCategory(null); // Close the dialog after update
    loadCategories();
  };
  
  const handleDelete = async (id) => {
    await Category.delete(id);
    loadCategories();
  };

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader><CardTitle>Add New Category</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Input placeholder="Name" value={newCategory.name} onChange={e => setNewCategory(p => ({...p, name: e.target.value}))} />
          <Input placeholder="Description" value={newCategory.description} onChange={e => setNewCategory(p => ({...p, description: e.target.value}))} />
          <Input placeholder="Icon Name (lucide-react)" value={newCategory.icon} onChange={e => setNewCategory(p => ({...p, icon: e.target.value}))} />
          <div className="flex items-center gap-2">
            <Input placeholder="Color Hex (e.g. #10b981)" value={newCategory.color} onChange={e => setNewCategory(p => ({...p, color: e.target.value}))} />
            <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: newCategory.color }} />
          </div>
          <div className="md:col-span-2">
            <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/>Add Category</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Categories</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-4 p-2 border rounded-lg">
              <div style={{width: 20, height: 20, backgroundColor: cat.color, borderRadius: '9999px'}} />
              <span className="font-semibold flex-grow">{cat.name}</span>
              <Button size="icon" variant="outline" onClick={() => setEditingCategory(cat)}><Edit className="w-4 h-4"/></Button>
              <Button size="icon" variant="destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="w-4 h-4"/></Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {editingCategory && (
        <EditCategoryDialog 
          category={editingCategory}
          onSave={handleUpdate}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}
