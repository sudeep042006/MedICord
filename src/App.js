import BrowseRouter from "./BrowseRouter";
import PatientRecords from "./components/PatientRecords";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

library.add(faInstagram, faFacebookF, faLinkedinIn);

function App() {
  return (
    <div>
      <BrowseRouter></BrowseRouter>
    </div>
  );
}

export default App;
