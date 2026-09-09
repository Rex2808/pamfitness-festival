import { Users } from "lucide-react";

function StatCard({ title, value, description, icon: Icon = Users }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card-header">
        <span>{title}</span>

        <div className="admin-stat-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <strong className="admin-stat-card-value">
        {value}
      </strong>

      <span className="admin-stat-card-description">
        {description}
      </span>
    </div>
  );
}

export default StatCard;