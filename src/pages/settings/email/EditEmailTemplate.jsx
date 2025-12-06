import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import Editor from "../../../components/RichText/Editor";
import api from "../../../api/axios";
import { ArrowLeftIcon, MoveLeft } from "lucide-react";

export const EditEmailTemplate = () => {
    const navigate = useNavigate();
    const { templateName } = useParams();
    const [loading, setLoading] = useState(false);
    const [fullTemplate, setFullTemplate] = useState(""); // store full HTML

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            template: "", // editor content (inner body)
        },
    });

    // Fetch template from backend
    const fetchEmailTemplate = async () => {
        try {
            const response = await api.post("/template/view", { name: templateName });
            if (response.data.code === 200) {
                const html = response.data.data.template || "";
                setFullTemplate(html);

                // Extract <body> content for editor
                const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                const bodyContent = bodyMatch ? bodyMatch[1] : html;

                reset({ template: bodyContent });
            } else {
                Swal.fire("Failed", response.data.message, "error");
            }
        } catch (err) {
            Swal.fire("Failed", "Something went wrong on server", "error");
        }
    };

    useEffect(() => {
        fetchEmailTemplate();
    }, [templateName]);

    // Submit handler
    const onSubmit = async (formData) => {
        try {
            setLoading(true);

            // Replace <body> in full HTML with editor content
            let updatedHtml = fullTemplate;
            if (fullTemplate.includes("<body")) {
                updatedHtml = fullTemplate.replace(
                    /<body[^>]*>[\s\S]*<\/body>/i,
                    `<body>${formData.template}</body>`
                );
            } else {

                updatedHtml = formData.template;
            }

            const response = await api.post("/template/edit", {
                name: templateName,
                template: updatedHtml,
            });

            if (response.data.code === 200) {
                Swal.fire({
                    title: "Success",
                    text: response.data.message,
                    icon: "success",
                    confirmButtonColor: "#5569FE",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/setting/email-templates");
                    }
                });
            } else {
                Swal.fire("Failed", response.data.message, "error");
            }
        } catch (err) {
            Swal.fire(
                "Failed",
                err.response?.data?.message || "Something went wrong",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    function extractBody(html) {
        const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        return match ? match[1] : html;
    }

    function wrapWithHtml(content) {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Account Verification</title>
    </head>
    <body>${content}</body>
    </html>`;
    }


    return (
        <div className="z-[9999] flex flex-col max-w-4xl rounded max-h-full">
            <div className=" rounded w-full relative">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <MoveLeft
                        fontSize="2rem"
                        className="cursor-pointer"
                        onClick={() => navigate("/setting/email-templates")}
                    />
                    Edit Email Template
                </h2>
                <h1 className="text-xl font-bold text-gray-800 mb-4">
                    Template name{" "} = {" "}
                    {templateName
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                </h1>



                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-600">Content</label>
                        <Controller
                            name="template"
                            control={control}
                            rules={{ required: "Content is required" }}
                            render={({ field }) => (
                                <Editor
                                    value={extractBody(field.value)}
                                    onTextChange={(content) => {
                                        field.onChange(wrapWithHtml(content));
                                    }}
                                />
                            )}
                        />

                        {errors.template && (
                            <p className="text-red-500 text-sm">{errors.template.message}</p>
                        )}
                    </div>

                    <div className="">
                        <button
                            type="submit"
                            className="mt-6 bg-bundl bg-[#2c9d2c] text-white px-4 py-2 rounded border  hover:bg-bundl-500 transition-all flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Template"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
