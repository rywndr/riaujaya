const QuickActions = ({ icon, label, bgColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center ${bgColor} p-4 rounded-lg transition-transform hover:scale-105`}
  >
    {icon}
    <span className="mt-2 text-sm">{label}</span>
  </button>
);

export default QuickActions;
