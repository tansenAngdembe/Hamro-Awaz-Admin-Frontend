import React from "react";
import DOMPurify from "dompurify";

export default function HtmlContent({ html = "" }) {
  // Decode HTML entities
  const decodeHtmlEntities = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const convertQuillLists = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    temp.querySelectorAll("span.ql-ui").forEach((span) => span.remove());

    const lis = Array.from(temp.querySelectorAll("li[data-list]"));
    let lastType = null;
    let currentWrapper = null;

    lis.forEach((li) => {
      const type = li.getAttribute("data-list"); 

      if (!currentWrapper || lastType !== type) {
        const wrapper = document.createElement(type === "bullet" ? "ul" : "ol");
        li.parentNode.insertBefore(wrapper, li);
        currentWrapper = wrapper;
        lastType = type;
      }

      currentWrapper.appendChild(li);
      li.removeAttribute("data-list");
    });

    return temp.innerHTML;
  };

  const decoded = decodeHtmlEntities(html);
  const cleaned = convertQuillLists(decoded);
  const safeHtml = DOMPurify.sanitize(cleaned);

  return (
    <div
      className="
        prose max-w-none
        [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3
        [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2
        [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
        [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1
        [&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-2 [&_h5]:mb-1
        [&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-2 [&_h6]:mb-1
        [&_p]:mb-2 [&_p]:leading-relaxed
        [&_strong]:font-bold
        [&_em]:italic
        [&_a]:text-green-600 [&_a]:underline hover:[&_a]:text-green-800
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2
        [&_li]:mb-1
        [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-3
        [&_img]:max-w-full [&_img]:h-auto [&_img]:my-3
        "
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
