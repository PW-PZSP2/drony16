import { useState, useEffect } from "react";
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
import { MapPin, Calendar, Clock, Loader2, HandHelping, ArrowLeft, Route, Bell, Check, History } from "lucide-react";
import { OrdersService, type OrderResponse } from "@/services/orders_service";

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
          <TabsList className="w-full justify-start bg-transparent p-0 gap-4 h-auto flex-wrap">
            <TabsTrigger
                value="new"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
            >
              <Bell className="h-4 w-4" />
              Nowe zlecenia
            </TabsTrigger>
            <TabsTrigger
                value="confirmed"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
            >
              <Check className="h-4 w-4" />
              Potwierdzone
            </TabsTrigger>
            <TabsTrigger
                value="history"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-600 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm gap-2 font-medium transition-all hover:bg-gray-50"
            >
              <History className="h-4 w-4" />
              Historia
            </TabsTrigger>
          </TabsList>

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
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrdersService.getMatchedOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch matched orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="p-8 text-center text-gray-500">
          Brak nowych pasujących zleceń w Twojej okolicy.
        </CardContent>
      </Card>
    );
  }

  if (selectedOrder) {
     const order = orders.find(o => o.order_id === selectedOrder);
     if (!order) return <div>Nie znaleziono zlecenia</div>;

     return (
        <Card className="overflow-hidden rounded-3xl border-gray-100 shadow-lg">
            <CardHeader className="pb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit mb-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full px-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <ArrowLeft className="h-4 w-4 mr-1"/> Wróć do listy
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl">{order.name}</CardTitle>
                        <p className="text-gray-600 font-medium mt-1 text-lg">
                           {order.services.map(s => s.service_name).join(", ")}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Details */}
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Szczegóły zlecenia</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start text-gray-600">
                                <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                <span>{order.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Route className="h-5 w-5 mr-3 text-gray-400" />
                                <span>W twoim zasięgu</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                <span>Nalot do: {new Date(order.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="h-5 w-5 mr-3 text-gray-400" />
                                <span>Utworzono: {new Date(order.creation_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Description */}
                <div>
                     <h4 className="font-semibold text-gray-900 mb-4">Opis zlecenia</h4>
                     <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {order.description}
                     </p>
                </div>
            </CardContent>
            <CardFooter className="justify-end border-t bg-gray-50/50 p-6">
                 <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 rounded-full">
                    <HandHelping className="h-4 w-4 mr-2" />
                    Zgłoś się do zlecenia
                 </Button>
            </CardFooter>
        </Card>
     )
  }

  return (
     <div className="space-y-4">
      {orders.map(order => (
          <Card key={order.order_id} className="overflow-hidden rounded-3xl border-gray-100 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                      {/* Title and Distance Row */}
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="text-xl font-bold text-gray-900">{order.name}</h3>
                              <p className="text-gray-600 font-medium mt-1">
                                {order.services.map(s => s.service_name).join(", ")}
                              </p>
                          </div>
                      </div>

                      {/* Details Row */}
                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-600 text-sm">
                          <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              {order.location}
                          </div>
                          <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              Termin: {new Date(order.deadline).toLocaleDateString()}
                          </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {order.description}
                      </p>

                      {/* Actions */}
                      <div className="flex justify-between items-center mt-2">
                           <Button
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-full px-6"
                              onClick={() => setSelectedOrder(order.order_id)}
                           >
                              Zobacz szczegóły
                           </Button>
                           <Button
                              className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6"
                           >
                              <HandHelping className="h-4 w-4 mr-2" />
                              Zgłoś się
                           </Button>
                      </div>
                  </div>
              </CardContent>
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
