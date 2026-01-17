import CreateOrderTab from "@/components/feature/client_dashboard/tabs/CreateOrderTab";
import SelectOperatorTab from "@/components/feature/client_dashboard/tabs/SelectedOperatorTab";
import CompletedOrdersTab from "@/components/feature/client_dashboard/tabs/CompletedOrdersTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Plus, UserCheck, History } from "lucide-react";

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel Zleceniodawcy
            </h1>
            <p className="text-gray-500 mt-1">
              Zarządzaj swoimi zleceniami i znajdź najlepszych operatorów
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <Card className="border-none shadow-none bg-transparent">
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="w-full justify-start bg-transparent p-0 gap-4 h-auto flex-wrap">
                  <TabsTrigger
                    value="create"
                    className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    Utwórz Zlecenie
                  </TabsTrigger>
                  <TabsTrigger
                    value="select"
                    className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
                  >
                    <UserCheck className="h-4 w-4" />
                    Wybierz Operatora
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
                  >
                    <History className="h-4 w-4" />
                    Pozostałe Zlecenia
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="mt-0">
                  <CreateOrderTab />
                </TabsContent>
                <TabsContent value="select" className="mt-0">
                  <SelectOperatorTab />
                </TabsContent>
                <TabsContent value="completed" className="mt-0">
                  <CompletedOrdersTab />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
