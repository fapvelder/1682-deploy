import { useMediaQuery } from "@material-ui/core";
function Responsive() {
  const tablet = useMediaQuery("(max-width: 1400px)");
  const minipad = useMediaQuery("(max-width: 900px)");
  const mobile = useMediaQuery("(max-width: 500px)");

  return { tablet, mobile, minipad };
}
export default Responsive;
