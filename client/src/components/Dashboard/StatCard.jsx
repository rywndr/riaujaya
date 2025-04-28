const StatCard = ({ icon, iconBg, title, value, colors }) => (
  <div className={`${colors.cardBg} rounded-lg shadow p-6`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className={`${colors.textMuted} text-sm`}>{title}</p>
        <h3 className={`${colors.textColor} text-xl font-bold`}>{value}</h3>
      </div>
    </div>
  </div>
);

export default StatCard;
