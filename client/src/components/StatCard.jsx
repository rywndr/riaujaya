export const StatCard = ({ icon, iconBg, title, value, colors }) => (
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

export const ActionButton = ({ icon, label, bgColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center ${bgColor} p-4 rounded-lg transition-transform hover:scale-105`}
  >
    {icon}
    <span className="mt-2 text-sm">{label}</span>
  </button>
);

