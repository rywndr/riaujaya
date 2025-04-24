// generate sales number 
export const generateSalesNumber = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const year = new Date().getFullYear();
  return `${randomNum}/RJC/${month}/${year}`;
};

// format date for printing
export const formatPrintedDate = () => {
  const now = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;
  
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  return `${time}, ${day}, ${date} ${month} ${year}`;
};

// format price as IDR currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// format discount percentage
export const formatDiscount = (percentage) => {
  return `${percentage.toFixed(2)}%`;
};

// format date string to a readable format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const day = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}`;
};
