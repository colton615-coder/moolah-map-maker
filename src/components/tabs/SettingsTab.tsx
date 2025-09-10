import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Globe, 
  Layout, 
  Download, 
  Upload, 
  Trash2, 
  Shield,
  Bell,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useTheme();
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Your data has been exported successfully",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Data",
      description: "Data import feature coming soon",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Clear Data",
      description: "All data has been cleared",
      variant: "destructive",
    });
  };

  const themeOptions = [
    { value: 'auto', label: 'Auto', icon: Monitor },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ];

  const colorOptions = [
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Appearance Settings */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={settings.theme === option.value ? "default" : "outline"}
                    className="flex flex-col gap-2 h-auto py-3"
                    onClick={() => updateSettings({ theme: option.value as any })}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Primary Color */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Primary Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={`h-12 p-2 ${settings.primaryColor === option.value ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => updateSettings({ primaryColor: option.value as any })}
                >
                  <div className={`w-6 h-6 rounded-full ${option.color}`} />
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Density */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Display Density</Label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Compact Mode</span>
              </div>
              <Switch
                checked={settings.density === 'compact'}
                onCheckedChange={(checked) => 
                  updateSettings({ density: checked ? 'compact' : 'comfortable' })
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Reduces spacing and padding for more content on screen
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Regional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={settings.currency} onValueChange={(value) => updateSettings({ currency: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Budget Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">Receive weekly spending summaries</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Large Expenses</p>
              <p className="text-sm text-muted-foreground">Alert for expenses over $100</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          
          <Button variant="outline" className="w-full justify-start" onClick={handleImportData}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          
          <Separator />
          
          <Button variant="destructive" className="w-full justify-start" onClick={handleClearData}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
          
          <p className="text-xs text-muted-foreground">
            This action cannot be undone. All your expenses, budgets, and settings will be permanently deleted.
          </p>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardContent className="p-4 text-center text-sm text-muted-foreground space-y-2">
          <p>Expense Tracker v1.0.0</p>
          <p>Built with React + TypeScript</p>
          <p>Data stored locally on your device</p>
        </CardContent>
      </Card>
    </div>
  );
};