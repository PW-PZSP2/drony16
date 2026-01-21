import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, LayoutDashboard, FileText } from "lucide-react";
import { OverviewTab } from "@/components/feature/admin_dashboard/tabs/OverviewTab";
import { UsersTab } from "@/components/feature/admin_dashboard/tabs/UsersTab";
import { ContentTab } from "@/components/feature/admin_dashboard/tabs/ContentTab";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel Administratora
            </h1>
            <p className="text-gray-500 mt-1">
              Zarządzaj platformą i użytkownikami
            </p>
          </div>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-transparent p-0 gap-4 h-auto flex-wrap">
              <TabsTrigger
                value="overview"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Przegląd
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                Użytkownicy
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                Treści
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="users" className="mt-4">
              <UsersTab />
            </TabsContent>
            <TabsContent value="content" className="mt-4">
              <ContentTab />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
