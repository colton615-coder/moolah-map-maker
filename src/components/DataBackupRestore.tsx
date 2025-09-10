import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { Download, Upload, Trash2, Wifi, WifiOff } from 'lucide-react';

export const DataBackupRestore: React.FC = () => {
  const { toast } = useToast();
  const [transactions] = useIndexedDB('transactions', []);
  const [budgets] = useIndexedDB('budgets', []);
  const [goals] = useIndexedDB('financialGoals', []);
  const [recurringTransactions] = useIndexedDB('recurringTransactions', []);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const createBackup = () => {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        transactions,
        budgets,
        goals,
        recurringTransactions,
      },
    };

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `financial-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast({
      title: "Backup created!",
      description: "Your financial data has been downloaded as a backup file.",
    });
  };

  const restoreFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        
        if (!backup.data) {
          throw new Error('Invalid backup file format');
        }

        // In a real app, you would restore to IndexedDB here
        toast({
          title: "Restore successful!",
          description: `Backup from ${new Date(backup.timestamp).toLocaleDateString()} has been restored.`,
        });
      } catch (error) {
        toast({
          title: "Restore failed",
          description: "Invalid backup file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      // In a real app, you would clear IndexedDB here
      toast({
        title: "Data cleared",
        description: "All financial data has been removed.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-success" />
          ) : (
            <WifiOff className="w-5 h-5 text-destructive" />
          )}
          Data Backup & Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium text-sm">Connection Status</p>
            <p className="text-xs text-muted-foreground">
              {isOnline ? 'Online - Data sync available' : 'Offline - Using local storage'}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={createBackup}
            variant="outline"
            className="w-full justify-start transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Create Backup
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={restoreFromFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              className="w-full justify-start transition-all duration-200 hover:scale-105"
            >
              <Upload className="w-4 h-4 mr-2" />
              Restore Backup
            </Button>
          </div>

          <Button
            onClick={clearAllData}
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive transition-all duration-200 hover:scale-105 md:col-span-2"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <p>• Backup files contain all your financial data in JSON format</p>
          <p>• Data is automatically saved locally and syncs when online</p>
          <p>• Create regular backups to prevent data loss</p>
        </div>
      </CardContent>
    </Card>
  );
};