import { toast } from "react-toastify";
import { getError } from "../../utils";

const handleLoading = async (
  asyncFunction,
  setLoading,
  setReload,
  successMessage
) => {
  try {
    setLoading(true);
    await asyncFunction();
    toast.success(successMessage);
    setReload((prev) => !prev);
  } catch (err) {
    toast.error(getError(err));
  } finally {
    setLoading(false);
  }
};

export default handleLoading;
