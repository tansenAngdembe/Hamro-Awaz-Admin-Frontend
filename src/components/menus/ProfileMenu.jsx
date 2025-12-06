import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, MoreHorizontal } from "lucide-react";

const ProfileMenu = ({ items = [] }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="p-1 hover:bg-gray-100 rounded-full">
        <ChevronDown size={18} className=" text-gray-600" />
      </MenuButton>
      <MenuItems className="absolute pt-2 right-0 mt-2 z-50 w-35 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none before:absolute before:-top-2 before:right-10 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-t before:border-l before:border-gray-200">
        {items.map((item, idx) => (
          <MenuItem key={idx}>
            {({ active }) => (
              <button
                onClick={item.onClick}
                className={`${
                  active ? "bg-gray-100" : ""
                } group flex w-full items-center px-3 py-[5px] font-medium text-[13px] text-gray-700 cursor-pointer`}
              >
                {item.label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default ProfileMenu;
