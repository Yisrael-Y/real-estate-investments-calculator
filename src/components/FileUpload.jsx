import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Dropdown, Form } from "react-bootstrap";
import PropertyDetails from "./PropertyDetails";

function FileUpload() {
  const [parsedData, setParsedData] = useState([]);
  const [uniquePropertyIds, setUniquePropertyIds] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showDropdownToggle, setShowDropdownToggle] = useState(false);

  const changeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
      },
    });
  };

  useEffect(() => {
    const propertyIdsSet = new Set(parsedData.map((elm) => elm.property_id));
    const uniqueIds = [...propertyIdsSet];
    setUniquePropertyIds(uniqueIds);
    setShowDropdownToggle(true);
  }, [parsedData]);

  const handlePropertySelect = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  return (
    <div className="m-3">
      <Form style={{width: "20vw"}}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload CSV File:</Form.Label>
          <Form.Control type="file" onChange={changeHandler} />
        </Form.Group>
      </Form>
      {showDropdownToggle && (
        <>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select Property
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {uniquePropertyIds.map((propertyId) => (
                <Dropdown.Item
                  key={propertyId}
                  onClick={() => handlePropertySelect(propertyId)}
                >
                  {propertyId}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {selectedPropertyId !== null && (
            <PropertyDetails
              propertyData={parsedData.filter(
                (elm) => elm.property_id === selectedPropertyId
              )}
            />
          )}
        </>
      )}
    </div>
  );
}

export default FileUpload;
