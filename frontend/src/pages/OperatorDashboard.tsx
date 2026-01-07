import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";

export default function OperatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel Operatora</h1>
            <p className="text-gray-500 mt-1">
              Zarządzaj zleceniami
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Content - Orders */}
          <div className="space-y-6">
            <OrdersSection />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersSection() {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <Tabs defaultValue="new" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white border">
            <TabsTrigger value="new">Nowe zlecenia</TabsTrigger>
            <TabsTrigger value="confirmed">Potwierdzone</TabsTrigger>
            <TabsTrigger value="history">Historia</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="new" className="mt-0">
          <NewOrdersTab />
        </TabsContent>
        <TabsContent value="confirmed" className="mt-0">
          <ConfirmedOrdersTab />
        </TabsContent>
        <TabsContent value="history" className="mt-0">
          <HistoryOrdersTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function NewOrdersTab() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const newOrders = [
    {
      id: 1,
      title: "Ortofotomapa działki budowlanej",
      service: "Ortofotomapa",
      location: "Warszawa, ul. Przykładowa 123",
      distance: "15 km",
      deadline: "2024-02-15",
      client: "Jan Kowalski",
      description:
        "Potrzebuję ortofotomapy działki o powierzchni 2 ha z dokładnością 2 cm/px...",
    },
    // ... more items
  ];

  if (selectedOrder) {
     return <div>Order Details Placeholder (Refactor in progress) <Button onClick={() => setSelectedOrder(null)}>Back</Button></div>
  }

  return (
     <div className="space-y-4">
      {newOrders.map(order => (
          <Card key={order.id}>
              <CardHeader>
                  <div className="flex justify-between">
                      <div>
                          <CardTitle>{order.title}</CardTitle>
                          <CardDescription>{order.service}</CardDescription>
                      </div>
                       <span className="text-sm text-gray-500">{order.distance}</span>
                  </div>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{order.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                       <span className="flex items-center"><MapPin className="h-4 w-4 mr-1"/> {order.location}</span>
                  </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                   <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order.id)}>Szczegóły</Button>
                   <Button size="sm">Zgłoś się</Button>
              </CardFooter>
          </Card>
      ))}
     </div>
  )
}

function ConfirmedOrdersTab() {
    return (
        <Card>
            <CardContent className="p-8 text-center text-gray-500">
                Brak potwierdzonych zleceń
            </CardContent>
        </Card>
    )
}

function HistoryOrdersTab() {
     return (
        <Card>
            <CardContent className="p-8 text-center text-gray-500">
                Historia zleceń jest pusta
            </CardContent>
        </Card>
    )
}
