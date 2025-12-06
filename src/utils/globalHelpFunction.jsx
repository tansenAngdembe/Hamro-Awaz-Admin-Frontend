export function formatDate(dateString) {
  if (!dateString) return "";

  const options = {
    year: "numeric",
    month: "short", 
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(dateString).toLocaleString("en-US", options);
}

export function formatTime(timeString)  {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };