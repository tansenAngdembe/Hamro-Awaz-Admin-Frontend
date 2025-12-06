import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MoreHorizontal } from "lucide-react";

const TableMenu = ({ items = [] }) => {
  return (
    <Menu as="div" className="absolute inline-block text-left mt-[10px]">
      <MenuButton className="p-1 hover:bg-gray-100 rounded-full">
        <MoreHorizontal size={18} className=" text-gray-600" />
      </MenuButton>
      <MenuItems className="absolute  py-2 left-[-30px] mt-2 z-50 w-30 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none before:absolute before:-top-2 before:left-9 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-t before:border-l before:border-gray-200">
        {items.map((item, idx) => (
          <MenuItem key={idx}>
            {({ active }) => (
              <button
                onClick={item.onClick}
                className={`${
                  active ? "bg-gray-100" : ""
                } group flex w-full items-center px-3 py-[5px] font-medium text-[13px] text-gray-700 cursor-pointer `}
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

export default TableMenu;
