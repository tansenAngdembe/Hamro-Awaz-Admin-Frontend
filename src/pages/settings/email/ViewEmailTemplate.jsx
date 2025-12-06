import {
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    CircleCheck,
    MoveLeft,
    UserPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/alerts/Alert";
import { StatusConstant } from "../../../constants/Constant.js";
import Loader from "../../../components/loader/Loader.jsx";
import config from "../../../utils/config.js";
import api from "../../../api/axios.js";

const ViewEmailTemplate = () => {
    const { templateName } = useParams();
    const [templateDetail, setTemplateDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const handleBackClick = (e) => {
        e.preventDefault();
        navigate("/setting/email-templates");
    };

    const fetchTemplateByName = () => {
        setLoading(true);
        api
            .post("/template/view", {
                name: templateName
            })
            .then((response) => {
                if (response.data.code == 200) {
                    setTemplateDetails(response.data.data);
                    setSuccessMessage(response.data.message);
                } else {
                    setErrorMessage(response.data.message);
                }
                setLoading(false);
            })
            .catch(() => {
                setErrorMessage("Something went wrong on server");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTemplateByName();
    }, []);
    return (
        <>
            <div className="p-6 flex flex-col bg-white  overflow-x-hidden">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                        <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
                        <h2 className="text-xl font-semibold">VIEW EMAIL TEMPLATE</h2>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                    View  template detail
                </p>
                <div className="w-full h-px bg-gray-200 mb-2"></div>
                {loading ? (
                    <Loader />
                ) : (
                    <div className="flex flex-col md:flex-row">


                        <div className="flex-1 px-4 py-4 md:py-6 flex flex-col justify-between">
                            <div dangerouslySetInnerHTML={{ __html: templateDetail?.template }} />
                        </div>
                    </div>
                )}
                {successMessage && (
                    <Alert
                        type="success"
                        message={successMessage}
                        duration={1000}
                        onClose={() => setSuccessMessage("")}
                    />
                )}

                {errorMessage && (
                    <Alert
                        type="error"
                        message={errorMessage}
                        duration={1000}
                        onClose={() => setErrorMessage("")}
                    />
                )}
            </div>
        </>
    );
};
export default ViewEmailTemplate;
