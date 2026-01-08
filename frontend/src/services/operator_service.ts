const API_URL = "http://localhost:8080";

export interface Service {
  service_id: number;
  name: string;
}

export interface Attachment {
  attachment_id: number;
  name: string;
  description: string | null;
  file_path: string;
}

export interface OperatorAverage {
  operator_id: number;
  average_score: number | null;
}

async function getOperatorAverage(operatorId: number): Promise<OperatorAverage> {
  const response = await fetch(`${API_URL}/operators/average/${operatorId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch average score");
  return response.json();
}

async function updateLocation(localisation: string): Promise<void> {
  const response = await fetch(`${API_URL}/operators/me/location`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ localisation }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update location");
}

async function updateArea(area: number): Promise<void> {
  const response = await fetch(`${API_URL}/operators/me/area`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update area");
}

async function getAllServices(): Promise<Service[]> {
  const response = await fetch(`${API_URL}/operators/services`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch services");
  return response.json();
}

async function getMyServices(): Promise<{ services: Service[] }> {
  const response = await fetch(`${API_URL}/operators/me/services`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch my services");
  return response.json();
}

async function updateMyServices(services: number[]): Promise<void> {
  // Backend expects a list of IDs or names. We'll send IDs.
  // Body: { services: [...] }
  const response = await fetch(`${API_URL}/operators/me/services`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ services }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update services");
}

async function getMyAttachments(): Promise<{ attachments: Attachment[] }> {
  const response = await fetch(`${API_URL}/operators/me/attachments`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch attachments");
  return response.json();
}

async function addAttachment(name: string, description: string, fileUrl: string): Promise<Attachment> {
  const formData = new FormData();
  formData.append("name", name);
  if (description) formData.append("description", description);
  formData.append("file_url", fileUrl);

  const response = await fetch(`${API_URL}/operators/me/add_attachments`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to add attachment");
  return response.json();
}

async function removeAttachment(attachmentId: number): Promise<void> {
  const response = await fetch(`${API_URL}/operators/me/remove_attachments/${attachmentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to remove attachment");
}

export const OperatorService = {
  getOperatorAverage,
  updateLocation,
  updateArea,
  getAllServices,
  getMyServices,
  updateMyServices,
  getMyAttachments,
  addAttachment,
  removeAttachment,
};
