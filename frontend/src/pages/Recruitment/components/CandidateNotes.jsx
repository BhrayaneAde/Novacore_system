import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import { Save, FileText } from "lucide-react";

const CandidateNotes = ({ candidateId, initialNotes = "" }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState([
    {
      id: 1,
      author: "Marie Dubois",
      date: "2025-10-20",
      content: "Excellent profil technique. Très motivé et passionné par le développement.",
    },
    {
      id: 2,
      author: "Sophie Martin",
      date: "2025-10-18",
      content: "Bonnes compétences en communication. À revoir pour l'entretien technique.",
    },
  ]);

  const handleSave = () => {
    if (notes.trim()) {
      setSavedNotes([
        {
          id: Date.now(),
          author: "Vous",
          date: new Date().toISOString().split("T")[0],
          content: notes,
        },
        ...savedNotes,
      ]);
      setNotes("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ajouter une note
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          placeholder="Vos observations sur ce candidat..."
        />
        <Button icon={Save} onClick={handleSave} className="mt-3">
          Enregistrer la note
        </Button>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Notes précédentes
        </h4>
        <div className="space-y-3">
          {savedNotes.map((note) => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{note.author}</span>
                <span className="text-xs text-gray-500">
                  {new Date(note.date).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="text-sm text-gray-700">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateNotes;
