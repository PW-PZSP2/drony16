import { useState } from "react";

import Button from "@/components/base/Button/Button";

export default function OrderDetails({
  orderId,
  onBack,
}: {
  orderId: number;
  onBack: () => void;
}) {
  const order = {
    id: orderId,
    title: "Ortofotomapa działki budowlanej",
    service: "Ortofotomapa",
    description:
      "Potrzebuję wykonania ortofotomapy działki budowlanej o powierzchni około 2 hektarów. Zlecenie obejmuje nalot dronem oraz opracowanie ortofotomapy w rozdzielczości 2 cm/px.",
    location: "Warszawa, ul. Przykładowa 123",
    deadline: "2024-02-15",
    deadlineType: "flight",
    createdDate: "2024-01-20",
    applicants: [
      {
        id: 1,
        name: "SkyTech Drones",
        rating: 4.8,
        completedJobs: 156,
        description:
          "Specjalizujemy się w ortofotomapach wysokiej jakości. Posiadamy najnowszy sprzęt i doświadczenie w projektach budowlanych.",
        equipment: ["DJI Phantom 4 RTK", "Odbiornik RTK", "Pix4D"],
      },
      {
        id: 2,
        name: "AerialPro",
        rating: 4.9,
        completedJobs: 203,
        description:
          "Oferujemy kompleksowe usługi fotogrametryczne z gwarancją jakości i terminowości.",
        equipment: ["DJI Matrice 300", "Zenmuse P1", "Agisoft Metashape"],
      },
      {
        id: 3,
        name: "DroneMapping",
        rating: 4.7,
        completedJobs: 89,
        description:
          "Młody zespół z pasją do nowoczesnych technologii mapowania.",
        equipment: ["DJI Mini 3 Pro", "Ground Station Pro"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Powrót do listy
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{order.title}</h2>
            <p className="text-gray-600">{order.service}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Oczekuje wyboru
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Szczegóły zlecenia
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <i className="ri-map-pin-line mr-2"></i>
                {order.location}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-line mr-2"></i>
                {order.deadlineType === "flight"
                  ? "Nalot do: "
                  : "Zakończenie do: "}
                {order.deadline}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-check-line mr-2"></i>
                Utworzono: {order.createdDate}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Opis</h4>
            <p className="text-sm text-gray-600">{order.description}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-4">
            Zgłoszenia operatorów ({order.applicants.length})
          </h4>
          <div className="space-y-4">
            {order.applicants.map((applicant) => (
              <div
                key={applicant.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-medium text-gray-800">
                      {applicant.name}
                    </h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="ri-star-fill text-yellow-400 mr-1"></i>
                        {applicant.rating}
                      </div>
                      <span>{applicant.completedJobs} zleceń</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {applicant.description}
                </p>

                <div className="mb-4">
                  <h6 className="text-xs font-medium text-gray-700 mb-2">
                    Sprzęt:
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {applicant.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Zobacz profil
                  </Button>
                  <Button size="sm">Wybierz operatora</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}