const StatCard = ({ label, value }) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="text-2xl font-semibold text-slate-800 mt-1">
        {value}
      </h3>
    </div>
  );
};

export default StatCard;
