import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function RatingModal({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [completed, setCompleted] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (completed === null) {
      alert("Proszę wybrać czy zlecenie zostało wykonane");
      return;
    }
    alert("Ocena została zapisana!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Oceń wykonaną pracę
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status zlecenia
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  checked={completed === true}
                  onChange={() => setCompleted(true)}
                  className="mr-2"
                />
                <span className="text-sm">Zostało wykonane</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  checked={completed === false}
                  onChange={() => setCompleted(false)}
                  className="mr-2"
                />
                <span className="text-sm">Nie zostało wykonane</span>
              </label>
            </div>
          </div>

          {completed && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ocena (1-5 gwiazdek)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <i className="ri-star-fill"></i>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Komentarz (opcjonalnie)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Podziel się swoją opinią o wykonanej pracy..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/500 znaków
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={completed === null || (completed && rating === 0)}
            >
              Zapisz ocenę
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
