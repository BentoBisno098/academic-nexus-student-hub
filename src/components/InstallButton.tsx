
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

const InstallButton = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleInstall = async () => {
    const success = await installApp();
    
    if (success) {
      toast({
        title: "App Instalado!",
        description: "O Sistema Acadêmico foi instalado com sucesso!"
      });
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Instalação cancelada",
        description: "A instalação do app foi cancelada.",
        variant: "destructive"
      });
    }
  };

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Instalar App</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Instalar Sistema Acadêmico</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Deseja instalar este sistema como aplicativo? 
            Você poderá acessá-lo diretamente da sua tela inicial.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Vantagens do app:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Acesso rápido pela tela inicial</li>
              <li>• Funciona offline (funcionalidades básicas)</li>
              <li>• Interface otimizada</li>
              <li>• Notificações (em breve)</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1"
              onClick={handleInstall}
            >
              Instalar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallButton;
