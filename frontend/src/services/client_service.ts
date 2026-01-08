import { backendClient } from "@/utils/backend_client";

// Types for the service
interface OrderData {
  title: string;
  service: string;
  description: string;
  location: string;
  deadline: string;
  deadlineType: "flight" | "completion";
}

interface Order {
  id: number;
  title: string;
  service: string;
  description: string;
  location: string;
  deadline: string;
  deadlineType: "flight" | "completion";
  applicants: number;
  status?: "pending" | "in-progress" | "completed" | "cancelled";
  selectedOperator?: string;
  rating?: number;
  completedDate?: string;
}

interface Applicant {
  id: number;
  name: string;
  rating: number;
  completedJobs: number;
  description: string;
  equipment: string[];
  price?: number;
  estimatedDuration?: string;
}

interface RatingData {
  orderId: number;
  rating: number;
  comment?: string;
}

const API_DELAY = 1000;
const API_URL = "http://localhost:8080";

const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function create_order(
  orderData: OrderData,
): Promise<{ success: boolean; orderId?: number; message?: string }> {
  const mapped_request = {
    name: orderData.title,
    deadline: orderData.deadline,
    location: orderData.location,
    description: orderData.description,
    completion_date: orderData.deadlineType == "completion",
    raid_date: orderData.deadlineType == "flight",
    services: [
      {
        service_name: orderData.service,
        parameters: {},
      },
    ],
  };

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    credentials: "include",
    body: JSON.stringify(mapped_request),
  });

  if (!response.ok) {
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

async function fetch_current_orders(): Promise<Order[]> {
  await mockDelay(API_DELAY);

  const pendingOrders: Order[] = [
    {
      id: 1,
      title: "Ortofotomapa działki budowlanej",
      service: "Ortofotomapa",
      description:
        "Ortofotomapa działki budowlanej o powierzchni 2 ha z dokładnością 2cm/px.",
      location: "Warszawa, ul. Przykładowa 123",
      deadline: "2026-02-15",
      deadlineType: "flight",
      applicants: 3,
      status: "pending",
    },
    {
      id: 2,
      title: "Model 3D budynku",
      service: "Modele 3D",
      description:
        "Model 3D budynku mieszkalnego o wysokiej dokładności z teksturami.",
      location: "Kraków, ul. Testowa 45",
      deadline: "2026-02-20",
      deadlineType: "completion",
      applicants: 1,
      status: "pending",
    },
    {
      id: 3,
      title: "Chmura punktów terenu przemysłowego",
      service: "Chmura punktów",
      description:
        "Skanowanie laserowe terenu przemysłowego z gęstością 100 pkt/m².",
      location: "Gdańsk, ul. Portowa 67",
      deadlineType: "flight",
      deadline: "2026-02-25",
      applicants: 5,
      status: "pending",
    },
  ];

  return pendingOrders;
}

async function fetch_order_applicants(orderId?: number): Promise<Applicant[]> {
  await mockDelay(API_DELAY);

  const applicants: Applicant[] = [
    {
      id: 1,
      name: "SkyTech Drones",
      rating: 4.8,
      completedJobs: 156,
      description:
        "Specjalizujemy się w ortofotomapach wysokiej jakości. Posiadamy najnowszy sprzęt i doświadczenie w projektach budowlanych.",
      equipment: ["DJI Phantom 4 RTK", "Odbiornik RTK", "Pix4D"],
      price: 2500,
      estimatedDuration: "2 dni",
    },
    {
      id: 2,
      name: "AerialPro",
      rating: 4.9,
      completedJobs: 203,
      description:
        "Oferujemy kompleksowe usługi fotogrametryczne z gwarancją jakości i terminowości.",
      equipment: ["DJI Matrice 300", "Zenmuse P1", "Agisoft Metashape"],
      price: 3200,
      estimatedDuration: "3 dni",
    },
    {
      id: 3,
      name: "DroneMapping",
      rating: 4.7,
      completedJobs: 89,
      description:
        "Młody zespół z pasją do nowoczesnych technologii mapowania.",
      equipment: ["DJI Mini 3 Pro", "Ground Station Pro"],
      price: 1800,
      estimatedDuration: "2 dni",
    },
  ];

  return applicants;
}

async function fetch_completed_orders(): Promise<Order[]> {
  await mockDelay(API_DELAY);

  const completedOrders: Order[] = [
    {
      id: 101,
      title: "Ortofotomapa parceli mieszkaniowej",
      service: "Ortofotomapa",
      description: "Ortofotomapa działki mieszkaniowej o powierzchni 0.5 ha.",
      location: "Wrocław, ul. Ogrodowa 89",
      deadline: "2025-12-10",
      deadlineType: "completion",
      applicants: 2,
      status: "completed",
      selectedOperator: "SkyTech Drones",
      rating: 5,
      completedDate: "2025-12-08",
    },
    {
      id: 102,
      title: "Inspekcja dachu budynku",
      service: "Inspekcja",
      description:
        "Szczegółowa inspekcja stanu dachu z dokumentacją fotograficzną.",
      location: "Poznań, ul. Główna 12",
      deadline: "2025-11-25",
      deadlineType: "flight",
      applicants: 4,
      status: "completed",
      selectedOperator: "AerialPro",
      rating: 4,
      completedDate: "2025-11-23",
    },
  ];

  return completedOrders;
}

async function rate_order(
  ratingData: RatingData,
): Promise<{ success: boolean; message?: string }> {
  await mockDelay(API_DELAY);

  if (
    !ratingData.orderId ||
    !ratingData.rating ||
    ratingData.rating < 1 ||
    ratingData.rating > 5
  ) {
    return {
      success: false,
      message: "Invalid rating data",
    };
  }

  return {
    success: true,
    message: "Rating submitted successfully",
  };
}

async function select_operator(
  orderId: number,
  operatorId: number,
): Promise<{ success: boolean; message?: string }> {
  await mockDelay(API_DELAY);

  if (!orderId || !operatorId) {
    return {
      success: false,
      message: "Order ID and Operator ID are required",
    };
  }

  return {
    success: true,
    message: "Operator selected successfully",
  };
}

export {
  create_order,
  fetch_current_orders,
  fetch_order_applicants,
  fetch_completed_orders,
  rate_order,
  select_operator,
  type OrderData,
  type Order,
  type Applicant,
  type RatingData,
};
