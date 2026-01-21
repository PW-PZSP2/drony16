import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  Clock,
  Loader2,
  HandHelping,
  ArrowLeft,
  Route,
  Bell,
  Check,
  History,
  Mail,
  Phone,
} from "lucide-react";
import { OperatorService, type Order } from "@/services/operator_service";

export default function OperatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel Operatora
            </h1>
            <p className="text-gray-500 mt-1">Zarządzaj zleceniami</p>
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "applied" | "not_applied">(
    "all",
  );

  const fetchOrders = async () => {
    try {
      const data = await OperatorService.getMatchedOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch matched orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApply = async (orderId: number) => {
    try {
      await OperatorService.applyForOrder(orderId);
      // Refresh logic or update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, has_applied: true } : o,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "applied") return order.has_applied;
    if (filter === "not_applied") return !order.has_applied;
    return true;
  });

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
    const order = orders.find((o) => o.order_id === selectedOrder);
    if (!order) return <div>Nie znaleziono zlecenia</div>;

    const deadlineLabel = order.raid_date
      ? "Termin nalotu"
      : "Termin zakończenia";

    return (
      <Card className="overflow-hidden rounded-3xl border-gray-100 shadow-lg">
        <CardHeader className="pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit mb-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full px-4"
            onClick={() => setSelectedOrder(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Wróć do listy
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{order.name}</CardTitle>
              <p className="text-gray-600 font-medium mt-1 text-lg">
                {order.services.map((s) => s.service_name).join(", ")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Szczegóły zlecenia
              </h4>
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
                  <span>
                    {deadlineLabel}:{" "}
                    {new Date(order.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-gray-400" />
                  <span>
                    Utworzono:{" "}
                    {new Date(order.creation_date).toLocaleDateString()}
                  </span>
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
          <Button
            className={`font-medium rounded-full px-6 ${order.has_applied ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
            onClick={() => handleApply(order.order_id)}
            disabled={order.has_applied}
          >
            <HandHelping className="h-4 w-4 mr-2" />
            {order.has_applied ? "Zgłoszono" : "Zgłoś się"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start pb-2">
        <div className="relative inline-block w-64">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 shadow-sm"
          >
            <option value="all">Wszystkie zlecenia</option>
            <option value="applied">Zgłoszone</option>
            <option value="not_applied">Nie zgłoszone</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="rounded-3xl border-dashed">
          <CardContent className="p-8 text-center text-gray-500">
            Brak zleceń spełniających kryteria filtrowania.
          </CardContent>
        </Card>
      ) : (
        filteredOrders.map((order) => {
          const deadlineLabel = order.raid_date
            ? "Termin nalotu"
            : "Termin zakończenia";
          return (
            <Card
              key={order.order_id}
              className="overflow-hidden rounded-3xl border-gray-100 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Title and Distance Row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {order.name}
                      </h3>
                      <p className="text-gray-600 font-medium mt-1">
                        {order.services.map((s) => s.service_name).join(", ")}
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
                      {deadlineLabel}:{" "}
                      {new Date(order.deadline).toLocaleDateString()}
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
                      className={`font-medium rounded-full px-6 ${order.has_applied ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
                      onClick={() => handleApply(order.order_id)}
                      disabled={order.has_applied}
                    >
                      <HandHelping className="h-4 w-4 mr-2" />
                      {order.has_applied ? "Zgłoszono" : "Zgłoś się"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

function ConfirmedOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await OperatorService.getAssignedOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch assigned orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
          Obecnie nie realizujesz żadnych zleceń.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <ConfirmedOrderCard key={order.order_id} order={order} />
      ))}
    </div>
  );
}

function ConfirmedOrderCard({ order }: { order: Order }) {
  const [showContact, setShowContact] = useState(false);
  const deadlineLabel = order.raid_date
    ? "Termin nalotu"
    : "Termin zakończenia";

  return (
    <Card
      className="overflow-hidden rounded-3xl border-gray-100 shadow-md hover:shadow-lg transition-shadow"
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {order.name}
              </h3>
              <p className="text-gray-600 font-medium mt-1">
                {order.services.map((s) => s.service_name).join(", ")}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              W trakcie
            </span>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-600 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              {order.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              {deadlineLabel}:{" "}
              {new Date(order.deadline).toLocaleDateString()}
            </div>
          </div>

          <p className="text-gray-700 text-sm line-clamp-2">
            {order.description}
          </p>

          <div className="pt-2 border-t border-gray-100 mt-2">
            {!showContact ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowContact(true)}
                className="gap-2 rounded-full border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Mail className="h-4 w-4" />
                Skontaktuj się z klientem
              </Button>
            ) : (
              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-300 items-center">
                {order.client_phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a
                      href={`tel:${order.client_phone}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {order.client_phone}
                    </a>
                  </div>
                )}
                {order.client_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <a
                      href={`mailto:${order.client_email}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {order.client_email}
                    </a>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContact(false)}
                  className="ml-auto text-xs text-gray-400 hover:text-gray-600"
                >
                  Ukryj
                </Button>
              </div>
            )}
            <div className="flex justify-end pt-4">
               <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
                onClick={async () => {
                  try {
                    await OperatorService.completeOrder(order.order_id);
                    window.location.reload(); // Simple reload to refresh state
                  } catch (error) {
                    console.error("Failed to complete order", error);
                    alert("Nie udało się zakończyć zlecenia");
                  }
                }}
              >
                <Check className="h-4 w-4 mr-2" />
                Zakończ zlecenie
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await OperatorService.getOrderHistory();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch order history", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
          Historia zleceń jest pusta.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card
          key={order.order_id}
          className="overflow-hidden rounded-3xl border-gray-100 shadow-md hover:shadow-lg transition-shadow bg-gray-50 opacity-90"
        >
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {order.name}
                  </h3>
                  <p className="text-gray-500 font-medium mt-1">
                    {order.services.map((s) => s.service_name).join(", ")}
                  </p>
                </div>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  Zakończone
                </span>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-600 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {order.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Zrealizowano: {new Date(order.deadline).toLocaleDateString()}
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {order.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
