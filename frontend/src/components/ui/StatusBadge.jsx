const statusStyles = {
  requested: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  ongoing: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }) => {
  const formatted =
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${statusStyles[status] || "bg-slate-100 text-slate-600"
        }`}
    >
      {formatted}
    </span>
  );
};

export default StatusBadge;