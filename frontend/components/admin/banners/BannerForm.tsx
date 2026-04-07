"use client";

import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Image as ImageIcon, Link as LinkIcon, Calendar, CheckCircle2 } from 'lucide-react';

interface BannerFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BannerForm: React.FC<BannerFormProps> = ({ initialData, onSubmit, onCancel }) => {
  return (
    <form className="space-y-6 bg-white p-2 rounded-2xl animate-in zoom-in-95 duration-500" onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
      <div className="space-y-4">
        <Input 
          label="Banner Title" 
          placeholder="e.g. Summer Mega Sale 2025" 
          defaultValue={initialData?.title} 
          required 
        />
        
        <Input 
          label="Promotion Image URL" 
          placeholder="https://example.com/promotion.jpg" 
          icon={ImageIcon} 
          defaultValue={initialData?.imageUrl} 
          required 
        />
        
        <Input 
          label="Destination URL" 
          placeholder="/categories/ac-vent-clean" 
          icon={LinkIcon} 
          defaultValue={initialData?.targetUrl} 
          required 
        />
        
        <div className="grid grid-cols-2 gap-5">
          <Input 
            label="Starts From" 
            type="date" 
            icon={Calendar} 
            defaultValue={initialData?.startDate} 
          />
          <Input 
            label="Valid Until" 
            type="date" 
            icon={Calendar} 
            defaultValue={initialData?.expiresOn} 
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-gray-100 flex-col sm:flex-row">
        <Button variant="outline" type="button" className="flex-1" fullWidth onClick={onCancel}>Discard Changes</Button>
        <Button variant="primary" type="submit" className="flex-1 shadow-lg" fullWidth icon={CheckCircle2}>Publish Campaign</Button>
      </div>
    </form>
  );
};

export default BannerForm;
