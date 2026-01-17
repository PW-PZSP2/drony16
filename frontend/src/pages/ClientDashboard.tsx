import CreateOrderTab from "@/components/feature/client_dashboard/tabs/CreateOrderTab";
import SelectOperatorTab from "@/components/feature/client_dashboard/tabs/SelectedOperatorTab";
import CompletedOrdersTab from "@/components/feature/client_dashboard/tabs/CompletedOrdersTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel Zleceniodawcy
          </h1>
          <p className="text-gray-600">
            Zarządzaj swoimi zleceniami i znajdź najlepszych operatorów
          </p>
        </div>

        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">Utwórz Zlecenie</TabsTrigger>
            <TabsTrigger value="select">Wybierz Operatora</TabsTrigger>
            <TabsTrigger value="completed">Pozostałe Zlecenia</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <CreateOrderTab />
          </TabsContent>
          <TabsContent value="select">
            <SelectOperatorTab />
          </TabsContent>
          <TabsContent value="completed">
            <CompletedOrdersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
