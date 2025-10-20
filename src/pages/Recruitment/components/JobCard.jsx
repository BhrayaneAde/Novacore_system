import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/ui/Badge";
import { Briefcase, MapPin, Users } from "lucide-react";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/app/recruitment/jobs/${job.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.department}</p>
          </div>
        </div>
        <Badge variant={job.status === "open" ? "success" : "default"}>
          {job.status === "open" ? "Ouvert" : "Fermé"}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{job.applicants} candidatures</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="purple">{job.type}</Badge>
          <span className="text-xs text-gray-500">
            Publié le {new Date(job.postedDate).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
