import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
 import { RiAdvertisementFill } from "react-icons/ri";

const IconCard = ({ iconName, text, link }) => {
  const LucideIcon = LucideIcons[iconName] || RiAdvertisementFill;
  return (
    <Link
      to={link}
      className="flex flex-col items-center justify-center border border-gray-400 p-6 text-center h-[190px] w-[200px] hover:shadow-md transition"
    >
      <LucideIcon className="w-20 h-20 text-gray-800" />
      <span className="mt-4 text-[14px] font-semibold text-gray-800">
        {text}
      </span>
    </Link>
  );
};

export default IconCard;
