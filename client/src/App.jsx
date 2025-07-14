import { useState, useRef } from "react";
import Form from "./components/Form";
import Output from "./components/Output";

export default function App() {
  const [result, setResult] = useState("");
  const [type, setType] = useState(""); // 'resume' or 'coverLetter'
  const outputRef = useRef(null); // 👈 added ref

  const handleResult = (content, selectedType) => {
    setResult(content);
    setType(selectedType);
  };

  return (
    <div className="min-h-screen bg-[#f6f5fc] p-4">
      <Form onResult={handleResult} outputRef={outputRef} />
      <Output result={result} type={type} outputRef={outputRef} />
    </div>
  );
}
