import { useState } from "react";
import Modal from "../components/Modal";

function App() {
	const [showModal, setShowModal] = useState(false);

	return <Modal closeModal={() => setShowModal(false)} />;
}

export default App;
